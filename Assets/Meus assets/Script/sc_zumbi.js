#pragma strict

var sounds:AudioClip[];
var soundsources:AudioSource[]; 

var sendrate:float = 10;
var dataconter:float = 0;
var senddata:boolean = true;

var aaa_pf_component:AAA_PATHFINDING;

var path_state = 0;
var targetnum:int = 0;
var havepath:boolean = false;
var lastsawpos:Vector3;
var postogo:Vector3;

var path_stage:int = 0;
var NIA_waypoint:Vector3[];

var grav:float = 10;
var walkspeed:float = 20;
var spinspeed:float = 50;
var dmgmin:float = 5;
var dmgmax:float = 10;
var atackreach:float = 1.5;
var frontsight:int = 6;
var backsight:int = 3;
var armpos:Transform;

var gamecontrol:Transform;
var animador:Transform;
var animadorcomp:Animation;
var head:Transform;
var headmesh:Transform;
var state = 0;
var vy:float = 0;
var isalive:boolean = true;
var isgrounded:boolean = true;
var movimento:Vector3 = Vector3.zero;
var actconter:float = 0;
var actchance:int = 50;
var actrate:float = 2;
var isacting:boolean = false;
var acttime:int = 0;

var ragdoll:Transform;
var eyepos:Transform;

var parts:Transform[];

var peles:Transform[];
var skincolor:Material[];
var skinnum:int = 0;

var camisas:Transform[];
var camisacolor:Material[];
var camisanum:int = 0;

var alvo:Transform;
var alvorelativepos:Vector3;
var animationcont:float = 0;
var RTH:boolean = true;

var lastforce:Vector3 = Vector3.zero;
var needtopush:boolean = false;
var backpackobject:Transform;
var carryitem:boolean = false;
var matchcontrol:Transform;

var headlife:float = 60;
var headblowpart:Transform;
var killerid:int = -1;

var brains:GameObject[];
var lastalvoarea:GameObject;
var mylastarea:GameObject;

var timetogiveup:float = 0;
var timetogiveup2:float = 0;

var changealvo_cont:float = 0;

var cur_anim:String;
var stun_now:int = 0;
var needtostun:int = 0;
var stun_anim:String[];
var stun_move:float[];
var stun_end:float[];

var terrafab:Transform;

@RPC function nasceterra()
{
	Instantiate(terrafab,transform.position-(Vector3.up*1.8),terrafab.rotation);
}

function can_go_there(p1:Vector3, tr:Vector3):boolean
{
	var lmask:LayerMask = (1 << 8) | (1<<30);
	
	var vec : Vector3 = Vector3.up*-0.85;
	if( Physics.Raycast( p1+vec, tr-p1, Vector3.Distance(p1,tr), lmask ) )
	{
		return false;
	}
	return true;
}
function Start () {

	brains = GameObject.FindGameObjectsWithTag("Player");
	networkView.RPC("asktheanimation",RPCMode.Server);
	var cont:int = 0;
	if(!networkView.isMine){enabled = false;}
	animadorcomp = animador.GetComponent(Animation);
	
	animadorcomp.animation["idle"].speed = 0.2;
	animadorcomp.animation["look"].speed = 0.2;
	animadorcomp.animation["walkslow"].speed = 0.2*walkspeed;
	animadorcomp.animation["walkfast"].speed = 0.2*walkspeed;
	animadorcomp.animation["run"].speed = 0.07*walkspeed;
	animadorcomp.animation["atackstrong"].speed = 1.1;
	animadorcomp.animation["fall"].speed = 0.2;
	animadorcomp.animation["born"].speed = 0.35;
	animadorcomp.animation["stepback"].speed = 0.5;
	
	transform.eulerAngles.y = Random.Range(0,360);  //uma vez só
	
	animationcont = 0;
	state = -1;
	rigidbody.constraints = RigidbodyConstraints.FreezeAll;
	animador.animation.Play("born");
	networkView.RPC("playanim",RPCMode.Others,"born",animadorcomp.animation["born"].speed);
		
	skinnum = Random.Range(0,skincolor.Length);
	camisanum = Random.Range(0,camisacolor.Length);
	networkView.RPC("setskin",RPCMode.AllBuffered,skinnum,camisanum,carryitem);
}

@RPC function asktheanimation()
{
	if(!Network.isClient)
	{
		networkView.RPC("playanim",RPCMode.Others,cur_anim,animadorcomp.animation[cur_anim].speed);
	}
}

@RPC function pushme( num:int )
{
	needtostun = num;
	needtopush = true;
}

@RPC function hurthead(dmg:float)
{
	headlife -= dmg;
	if(alvo == null)
	{
		headlife -= dmg*2;
	}
}

@RPC function hearnoise(pid:int)
{	
	var i:int = 0;
	if(state != -1)
	{
		if(alvo == null)
		{
			brains = GameObject.FindGameObjectsWithTag("Player");
			i = 0;
			while(i < brains.Length)
			{
				if(brains[i].GetComponent(sc_player).myid == pid)
				{
					alvo = brains[i].transform;
					lastalvoarea = alvo.GetComponent(sc_findmyarea).myarea;
					break;
				}
				i++;
			}
		}
	}
}

@RPC function setskin(skin:int,camisa:int,bakpak:boolean)
{
	skinnum = skin;
	camisanum = camisa;
	carryitem = bakpak;
	if(!carryitem)
	{
		Destroy(backpackobject.gameObject);
	}
	var cont:int = 0;
	while(cont < peles.Length)
	{
		peles[cont].renderer.material = skincolor[skin];
		cont++;
	}
	
	cont = 0;
	while(cont < camisas.Length)
	{
		camisas[cont].renderer.material = camisacolor[camisa];
		cont++;
	}
}
function play_hit()
{
	if(Random.Range(0,100) > 50)
	{
		animador.animation.CrossFade("hit_right",0.2);
		networkView.RPC("fadeanim",RPCMode.Others,"hit_right",0.2,animadorcomp.animation["hit_right"].speed);
		cur_anim ="hit_right";
	}
	else
	{
		animador.animation.CrossFade("hit_left",0.2);
		networkView.RPC("fadeanim",RPCMode.Others,"hit_left",0.2,animadorcomp.animation["hit_left"].speed);
		cur_anim ="hit_left";
	}
}

function LateUpdate () {

	
	var cont:int = 0;
	var hit:RaycastHit;
	var lmask:LayerMask;
	var tmpbool:boolean = false;
	var tmpint:int = 0;
	var insted:Transform;
	var tmpfloat:float = 0;
	var tmpray:Ray;
	
	movimento = Vector3.zero;
	if(isalive)
	{
		if(alvo != null)
		{
			changealvo_cont += 1*Time.deltaTime;
			if(changealvo_cont > 1)
			{
				brains = GameObject.FindGameObjectsWithTag("Player");
				if(targetnum < brains.Length)
				{
					if(brains[targetnum] != null)
					{
						alvorelativepos = transform.InverseTransformPoint(brains[targetnum].transform.position);
						if(alvorelativepos.z > 0){tmpfloat = frontsight*brains[targetnum].GetComponent(sc_player).exposi;}
						else{tmpfloat = backsight*brains[targetnum].GetComponent(sc_player).exposiback;}
						tmpfloat += 0.005;
						lmask = (1 << 8)|(1 << 9);
						if(Physics.Raycast(eyepos.position,brains[targetnum].transform.position-transform.position,hit,tmpfloat,lmask))
						{
							if(hit.collider.gameObject == brains[targetnum])
							{
								//Vector3.SqrMagnitude(alvo.position-transform.position) > Vector3.SqrMagnitude(transform.position-brains[targetnum].transform.position)
								if(Vector3.Distance(alvo.position,transform.position) > Vector3.Distance(brains[targetnum].transform.position,transform.position)*1.5)
								{
									alvo = brains[targetnum].transform;
									lastalvoarea = alvo.GetComponent(sc_findmyarea).myarea;
								}
							}
							if(hit.collider.gameObject.transform.parent != null)
							{
								if(hit.collider.gameObject.transform.parent.gameObject == brains[targetnum])
								{
									alvo = brains[targetnum].transform;
									lastalvoarea = alvo.GetComponent(sc_findmyarea).myarea;
								}
							}
						}
					}
					targetnum++;
				}
				else
				{
					brains = GameObject.FindGameObjectsWithTag("Player");
					targetnum = 0;
				}
				changealvo_cont = 0;
			}
		}
		
		movimento = Vector3.zero;
		
		///////////////////////////////////////////////////////////////////////*checa o isgrounded*/////////////////////////
		lmask = 1 << 8;
		isgrounded = Physics.Raycast(transform.position,Vector3.down,hit,1.4,lmask);
		///////////////////////////////////////////////////////////////////////
		///////////////////////////    IA     /////////////////////////////////
		///////////////////////////////////////////////////////////////////////
		if(state != -1)
		{
			if(alvo == null) /*findtheguy*/
			{
				if(targetnum < brains.Length)
				{
					if(brains[targetnum] != null)
					{
						alvorelativepos = transform.InverseTransformPoint(brains[targetnum].transform.position);
						if(alvorelativepos.z > 0){tmpfloat = frontsight*brains[targetnum].GetComponent(sc_player).exposi;}
						else{tmpfloat = backsight*brains[targetnum].GetComponent(sc_player).exposiback;}
						tmpfloat += 0.005;
						lmask = (1 << 8)|(1 << 9);
						if(Physics.Raycast(eyepos.position,brains[targetnum].transform.position-transform.position,hit,tmpfloat,lmask))
						{
							if(hit.collider.gameObject == brains[targetnum])
							{
								alvo = brains[targetnum].transform;
								lastalvoarea = alvo.GetComponent(sc_findmyarea).myarea;
							}
							if(hit.collider.gameObject.transform.parent != null)
							{
								if(hit.collider.gameObject.transform.parent.gameObject == brains[targetnum])
								{
									alvo = brains[targetnum].transform;
									lastalvoarea = alvo.GetComponent(sc_findmyarea).myarea;
								}
							}
						}
					}
					targetnum++;
				}
				else
				{
					brains = GameObject.FindGameObjectsWithTag("Player");
					targetnum = 0;
				}
			}
		}
		
		///////////////////////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////////////////////
		if(state == -1) /*nascendo*/
		{
			animationcont += 100*Time.deltaTime;
			if(animationcont > 350)
			{
				networkView.RPC("setzumbistate",RPCMode.OthersBuffered);
				rigidbody.constraints = RigidbodyConstraints.FreezeRotation;
				state = 0;
				vy = 0;
			}
		}
		if(state != -1){rigidbody.constraints = RigidbodyConstraints.FreezeRotation;}
		
		if(state == 4) /*indo pratras*/
		{
			movimento.z = stun_move[stun_now];
			animationcont += 100*Time.deltaTime;
			
			if(animationcont > stun_end[stun_now])
			{
				state = 1;
				vy = 0;
				animador.animation.CrossFade("idle",0.2);
				networkView.RPC("fadeanim",RPCMode.Others,"idle",0.2,animadorcomp.animation["idle"].speed);
				cur_anim = "idle";
			}
		}
		
		if(state == 0) /*caindo ou pulando*/
		{
			if(Physics.Raycast(transform.position,transform.forward,hit,1,lmask))
			{
				movimento.x = walkspeed*0.7;
				if(hit.collider.gameObject.GetComponent(sc_punchme))
				{
					RTH = true;
					state = 3;
					animationcont = 0;
					vy = 0;
					play_hit();
				}
			}
			vy -= grav*Time.deltaTime;
			if(isgrounded && (vy < 0))
			{
				state = 1;
				vy = 0;
				animador.animation.CrossFade("idle",0.2);
				networkView.RPC("fadeanim",RPCMode.Others,"idle",0.2,animadorcomp.animation["idle"].speed);
				cur_anim = "idle";
			}
		}
		
		if(state == 1)   /*parado*/
		{
			if(!isacting)
			{
				actconter += 1000*actrate*Time.deltaTime;
				if(actconter > 1000)
				{
					if(Random.Range(0,100) < actchance)
					{
						animador.animation.CrossFade("look",0.2);
						networkView.RPC("fadeanim",RPCMode.Others,"look",0.2,animadorcomp.animation["look"].speed);
						cur_anim = "look";
						isacting = true;
						acttime = 250;
					}
					actconter = 0;
				}
			}
			if(isacting)
			{
				actconter += 100*Time.deltaTime;
				if(actconter > acttime)
				{
					animador.animation.CrossFade("idle",0.5);
					networkView.RPC("fadeanim",RPCMode.Others,"idle",0.5,animadorcomp.animation["idle"].speed);
					cur_anim = "idle";
					actconter = 0;
					isacting = false;
				}
			}
			
			if((alvo != null) && havepath)
			{
				state = 2;
				animador.animation.CrossFade("run",0.3);
				networkView.RPC("fadeanim",RPCMode.Others,"run",0.3,animadorcomp.animation["run"].speed);
				cur_anim = "run";
			}
		}
		
		if(state == 2) /*andando*/
		{
			movimento.z = walkspeed;
			
			lmask = (1 << 11) | (1 << 8);
			if(Physics.Raycast(transform.position,transform.forward,hit,1,lmask))
			{
				movimento.x = walkspeed*0.7;
				if(hit.collider.gameObject.GetComponent(sc_punchme))
				{
					RTH = true;
					state = 3;
					animationcont = 0;
					vy = 0;
					play_hit();
				}
			}
			
			if(alvo == null)
			{
				state = 1;
				vy = 0;
				animador.animation.CrossFade("idle",0.2);
				networkView.RPC("fadeanim",RPCMode.Others,"idle",0.2,animadorcomp.animation["idle"].speed);
				cur_anim = "idle";
				alvo = null;
				havepath = false;
			}
			if(alvo != null)
			{
				if(   Vector3.SqrMagnitude(transform.position-alvo.position) < 2.89 )
				{
					RTH = true;
					state = 3;
					animationcont = 0;
					vy = 0;
					play_hit();
				}
			}
		}
		if(state == 3)   /*atacando*/
		{
			animationcont += 100*Time.deltaTime;
			if(alvo != null)
			{
				if(Vector3.SqrMagnitude(transform.position-alvo.position) > 1.21)
				{
					movimento.z = walkspeed*0.5;
				}
			}
			if(RTH)
			{
				if(animationcont > 30)
				{
					lmask = (1 << 9) | (1 << 8);
					if(Physics.Raycast(armpos.position,transform.TransformDirection(Vector3.forward),hit,atackreach,lmask))
					{
						if(hit.collider.gameObject.GetComponent(sc_dmgtaker) != null)
						{	
							tmpfloat = Random.Range(dmgmin,dmgmax);
							
							if(hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_punchme) != null)
							{
								soundsources[0].clip = sounds[1];
								soundsources[0].pitch = Random.Range(0.9,1.1);
								soundsources[0].Play();
								networkView.RPC("playzombiesound",RPCMode.Others,0,1);
							}
							if(hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_player) != null)
							{
								hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("spillblood",RPCMode.All);
								soundsources[0].clip = sounds[0];
								soundsources[0].pitch = Random.Range(0.9,1.1);
								soundsources[0].Play();
								
								hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_player).hurtbyzombie(tmpfloat);
								hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("hurtbyzombie",RPCMode.Others,tmpfloat);
								
								networkView.RPC("playzombiesound",RPCMode.Others,0,0);
								
							
								tmpint = Random.Range(0,100);
								if(tmpint < 5)
								{
									hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("addbleed",RPCMode.All);
								}
							}
							else
							{
								hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_life).quantia -= tmpfloat;
								hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("hurtme",RPCMode.Others,tmpfloat);
							}
						}
						if(hit.collider.gameObject.GetComponent(sc_particula) != null)
						{
							Network.Instantiate(hit.collider.gameObject.GetComponent(sc_particula).prefab,hit.point,Quaternion.LookRotation(hit.normal),3);
						}
					}
					RTH = false;
				}
			}
			if(animationcont > 70)
			{
				state = 2;
				animador.animation.Play("run");
				networkView.RPC("playanim",RPCMode.Others,"run",animadorcomp.animation["run"].speed);
				cur_anim = "run";
			}
			if(alvo == null)
			{
				state = 1;
				vy = 0;
				animador.animation.CrossFade("idle",0.2);
				networkView.RPC("fadeanim",RPCMode.Others,"idle",0.2,animadorcomp.animation["idle"].speed);
				cur_anim = "idle";
				havepath = false;
			}
		}
		if((state == 1)||(state == 2)||(state == 3)) /*cair*/
		{
			if(!isgrounded)
			{
				state = 0;
				animador.animation.CrossFade("fall",0.3);
				networkView.RPC("fadeanim",RPCMode.Others,"fall",0.3,animadorcomp.animation["fall"].speed);
				cur_anim = "fall";
				vy = 0;
			}
		}	
		///////////////////////////////////////////arruma a movimentassao/////////////////////////////////////////////////
		movimento.y = vy;
		if((movimento.x != 0)&&(movimento.z != 0))
		{
			movimento.z *= 0.707;
			movimento.x *= 0.707;
		}
		movimento = transform.TransformDirection(movimento);
		rigidbody.velocity = movimento;
		if(headlife <= 0)
		{
			GetComponent(sc_life).quantia = 0;
		}
		if(GetComponent(sc_life).quantia <= 0)
		{
			GetComponent(sc_life).quantia = 0;
			isalive = false;
			
			if(killerid >= 0)
			{
				matchcontrol.GetComponent(sc_matchcontroller).everybodyspawners[killerid].networkView.RPC("addkill",RPCMode.All);
				tmpint = 15*Mathf.Pow(1.11,matchcontrol.GetComponent(sc_matchcontroller).wave);
				matchcontrol.GetComponent(sc_matchcontroller).everybodyspawners[killerid].networkView.RPC("addmoney",RPCMode.All,tmpint);
			}
			animador.animation.Stop();
			animador.animation.enabled = false;
			
			insted = Instantiate(ragdoll,transform.position,transform.rotation);
			cont = 0;
			while(cont < parts.Length)
			{
				insted.GetComponent(sc_ragdoll).parts[cont].position = parts[cont].position;
				insted.GetComponent(sc_ragdoll).parts[cont].eulerAngles = parts[cont].eulerAngles;
				cont++;
			}
			if(headlife <= 0)
			{
				insted.GetComponent(sc_ragdoll).bloodfont.emissionRate = 500;
				Instantiate(headblowpart,insted.GetComponent(sc_ragdoll).headpos.position,insted.GetComponent(sc_ragdoll).headpos.rotation);
				cont = 0;
				while(cont < insted.GetComponent(sc_ragdoll).headmesh.Length)
				{
					insted.GetComponent(sc_ragdoll).headmesh[cont].GetComponent(Renderer).enabled = false;
					cont++;
				}
				
			}
			
			if(gamecontrol != null)
			{
				if(gamecontrol.GetComponent(sc_gamecontrol).iamserver)
				{
					gamecontrol.GetComponent(sc_gamecontrol).matchdata.GetComponent(sc_matchdata).addzombiedeath();
				}
			}
			if(headlife > 0)
			{insted.rigidbody.AddForce(lastforce);}
			insted.GetComponent(sc_ragdoll).skin = skinnum;
			insted.GetComponent(sc_ragdoll).camisanum = camisanum;
			
			if(carryitem)
			{
				tmpint = Random.Range(0,gamecontrol.GetComponent(sc_gamecontrol).itemtosell.Length);
				tmpint = gamecontrol.GetComponent(sc_gamecontrol).itemtosell[tmpint];
				insted = Network.Instantiate(matchcontrol.GetComponent(sc_matchcontroller).grounditens[tmpint],transform.position,transform.rotation,5);
				
				insted.GetComponent(sc_updateposition).enabled = false;
				insted.GetComponent(sc_sendpositionupdate).enabled = true;
				if(insted.GetComponent(sc_gunscript) != null)
				{
					insted.GetComponent(sc_canbetaken).quant= insted.GetComponent(sc_gunscript).maxammo;
				}
				insted.GetComponent(sc_canbetaken).decay = true;
				insted.GetComponent(sc_canbetaken).decaytime = 30000;
			}
			if(headlife <= 0)
			{
				networkView.RPC("killme",RPCMode.OthersBuffered,Vector3.zero,true);
			}
			else
			{networkView.RPC("killme",RPCMode.OthersBuffered,lastforce,false);}
			Destroy(gameObject);
		}
		
		if(needtopush)
		{
			if((state != 0) && (state != -1))
			{
				state = 4;
				stun_now = needtostun;
				
				animationcont = 0;
				animador.animation.Rewind(stun_anim[stun_now]);
				animador.animation.CrossFade(stun_anim[stun_now],0.2);
				networkView.RPC("fadeanim",RPCMode.Others,stun_anim[stun_now],0.2,animadorcomp.animation[stun_anim[stun_now]].speed);
				cur_anim = stun_anim[stun_now];;
			}
			needtopush = false;
		}
		lastforce *= 0.5;
	}
	if(isalive)
	{
		if(senddata)
		{
			dataconter += 1000*sendrate*Time.deltaTime;
			if(dataconter > 1000)
			{
				tmpint = transform.eulerAngles.y;
				if((Network.peerType != NetworkPeerType.Disconnected) && (Network.peerType != NetworkPeerType.Connecting))
				{
					networkView.RPC("setzumbistuff",RPCMode.Others,tmpint,transform.position);
					dataconter = 0;
				}
			}
		}
	}
	
	
}

@RPC
function playzombiesound(source:int,id:int)
{
	soundsources[source].clip = sounds[id];
	soundsources[source].pitch = Random.Range(0.9,1.1);
	soundsources[source].Play();
}

@RPC
function setkillerid(id:int)
{
	killerid = id;
}

@RPC
function forcar(dir:Vector3)
{
	lastforce += dir;
}

@RPC
function setzumbistate()
{
	state = 0;
}

@RPC
function fadeanim(anim_name:String,time:float,animspeed:float)
{
	animador.GetComponent(Animation).animation[anim_name].speed = animspeed;
	animador.GetComponent(Animation).animation.CrossFade(anim_name,time);
}

@RPC
function playanim(anim_name:String,animspeed:float)
{
	animador.GetComponent(Animation).animation.Rewind(anim_name);
	animador.GetComponent(Animation).animation[anim_name].speed = animspeed;
	animador.GetComponent(Animation).animation.Play(anim_name);
}

@RPC
function killme(deathdir:Vector3,blowhead:boolean)
{	
	var insted:Transform;
	insted = Instantiate(ragdoll,transform.position,transform.rotation);
	
	if(gamecontrol != null)
	{
		if(gamecontrol.GetComponent(sc_gamecontrol).iamserver)
		{
			gamecontrol.GetComponent(sc_gamecontrol).matchdata.GetComponent(sc_matchdata).addzombiedeath();
		}
	}
	insted.GetComponent(sc_ragdoll).skin = skinnum;
	insted.GetComponent(sc_ragdoll).camisanum = camisanum;
	var cont:int = 0;
	while(cont < parts.Length)
	{
		insted.GetComponent(sc_ragdoll).parts[cont].position = parts[cont].position;
		insted.GetComponent(sc_ragdoll).parts[cont].eulerAngles = parts[cont].eulerAngles;
		cont++;
	}
	if(blowhead)
	{
		Instantiate(headblowpart,insted.GetComponent(sc_ragdoll).headpos.position,insted.GetComponent(sc_ragdoll).headpos.rotation);
		cont = 0;
		while(cont < insted.GetComponent(sc_ragdoll).headmesh.Length)
		{
			insted.GetComponent(sc_ragdoll).headmesh[cont].GetComponent(Renderer).enabled = false;
			cont++;
		}
		insted.GetComponent(sc_ragdoll).bloodfont.emissionRate = 500;
	}
	insted.rigidbody.AddForce(deathdir);
	Destroy(gameObject);
}