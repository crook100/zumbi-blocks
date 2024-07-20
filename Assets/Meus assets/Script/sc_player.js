#pragma strict
var cheat_on:boolean = false;
var slowtime:boolean = false;
var sloweffect:float = 0.02;
var skill:boolean[];
var walljumpstr:String[];
var act_dj:boolean = false;
var alt_collider:GameObject;
var vault_speed:float;
//0 = Parkour nivel 1
//1 = Parkour nivel 2
//2 = ???
var camxmax:float = 1;
var camymax:float = 1;

var handtohide:Renderer[];
var sounds:AudioClip[];
var soundsources:AudioSource[];

var sendrate:float = 10;
var dataconter:float = 0;
var senddata:boolean = true;
var rpcrate = 10;
var def_fov = 70;
var headanglim:int = 70;
var controled:boolean;
var mintosrpint:int = 20;
var sprintregen:float = 10;
var sprintdecay:float = 10; 

var mouse_sense:float = 1;
var grav:float = 10;
var jumpspeed:float = 5;
var jumpmovement:float = 0.6;
var sprintspeed:float = 20;
var walkspeed:float = 20;
var walkbackmulti:float = 0.6;
var crosshair:Texture;
var hitmarker:Texture;
var pointcrosshair:Texture;
var interactsign:Texture[];
var autoreload:boolean = true;
var userange:float = 2;
var pushrange:float = 2;
var pushspeed:float = 1.5;
var lifes:int = 3;
var guiskin:GUISkin;
var guiskin2:GUISkin;
var guiskinammoL:GUISkin;
var guiskinammoR:GUISkin;
var guiskin_WB:GUISkin;
var whitebarskin:GUISkin;

var item:int[];
var quant:int[];
var ammo:int[];

var itemselected:int = 0;
var itemtoselect:int = 0;
var backpos:Transform;
var outpos:Transform;
var deadbody:Transform;
var handitem:Transform;
var gamecontrol:Transform;
var myspawner:Transform;
var eye:Transform;
var handpos:Transform;
var lhandpos:Transform;
var luminassao:Transform;
var flash:Transform;
var chest:Transform;
var legs:Transform;
var pivo:Transform;
var arms:Transform[];
var head:Transform;
var invisiblehead:Renderer;
var add_capsule:Transform;
var headmesh:Transform;
var vasamento:ParticleSystem;
var std_particle:Transform;
var cam:Transform;
var headang:float = 0;
var legstate = 0;
var armstate = 0;

var vy:float = 0;
var isgrounded:boolean = true;
var movimento:Vector3 = Vector3.zero;
var playername:String;
var autoaim:boolean = false;
var animationcont:float = 0;
var reloadact1:boolean = false;
var reloadact2:boolean = false;
var reloadact3:boolean = false;
var reloadact4:boolean = false;
var reloadact5:boolean = false;
var lhandmag:Transform;
var myid:int;
var interacttype:int = -1;
var armrottype = 0;
var canspin:boolean = true;
var aiming:boolean = false;

var futurearmstate:int = 0;
var waitingtime:int = 0;

var revivetarget:Transform;
var rpcconter:float = 0;
var rpcbar:float = 0;

var flashconter:float = 0;
var the_message:String = "";
var message_a:float = 0;
var message_col:Color = Color.white;
/*16    1.78    10*/
var zooming:boolean = false;
var start_eyey:float = 0;
var eyey:float = 0;

var bloodspill:Texture[];
var bloodpos:Vector2[];
var bloodtype:int[];
var bloodalpha:float[];
var bloods:int = 0;

var currentlife:float;
var itemtoload:int = 0;

var stepconter:float = 0;
var bleeding:float = 0;
var bleedingconter:float = 0;
var red_a:float;
var whitecube:Texture;
var crouch_stand_icons:Texture[];
var detection_icons:Texture[];
var sprintbar:float = 100;
var hideconter:float = 0;
var showscope:boolean = false;
var throw_charge:float = 0;
var throw_charge_min:float = 0.2;

var interact_obj:GameObject;
var canmoveinladder:boolean = false;

var startjump:float = 0;
var timecontroler:sc_timecontrol;

var solaris:GameObject;

var fakebarulho:float = 0;
var barulho:float = 0;
var lastbarulho:float = 0;
var soundwarningcont:float = 0;

var walknoise = 20;
var sprintnoise = 50;

var noisemultiplier:float = 5;
var exposiback:float = 0;
var exposi:float = 0;
var fake_exposi:float = 0;

var zbs:GameObject[];
var bendingbones:Transform[];
var bending:float = 20;

var cintopos:Transform;
var cintoitem:Transform;
var cinto_timer:float = 0;
var cinto_timerend:float = 0;

var crouch_cont:float = 0;
var crouching:boolean = false;
var real_crouching:boolean = false;
var walkmulti:float =1;

var spreadcoef:float = 1;

var skinpos:Transform[];
var camisapos:Transform[];
var beardpos:Transform;
var beard:Transform;

var beardnum:int;
var beardcolor:int;
var myskin:int;
var shirtcolor:int;

var beardprefabs:Transform[];
var skincolors:Material[];
var camisacolors:Material[];
var haircolors:Material[];

var ap_synced:boolean = false;

var placer:Transform;
var place_conter:float = 0;

var hitM_conter:float = 0;

var stuntef:float = 0;
var stuntefcont:float = 0;

var boxe_move:String[];
var boxe_atk:float[];
var boxe_end:float[];
var boxe_hittime:float[];
var boxe_efect:int[];
var boxenow:int = 0;

var destroyhead:boolean = true;
var showhud:boolean = true;

var sec_life:float = 100;
var food:float = 100;
var water:float = 100;

var Mtarg:Vector3;
var Mtargpos:Vector3;

var grabtype:int = 0;

var step_normal:Vector3;
var grabnormal:Vector3;
var grabpos:Vector3;

@RPC function sync_grab(n:int)
{
	grabtype = n;
}
@RPC function stun_me(amount:float)
{
	stuntef += amount;
}
@RPC function ask_aparence()
{
	if(networkView.isMine)
	{networkView.RPC("sync_aparence",RPCMode.Others,beardnum,myskin,beardcolor,shirtcolor);}
}

@RPC function sync_aparence(RPCbeardnum:int,RPCmyskin:int,RPCbeardcolor:int,RPCshirtcolor:int)
{
	//beardnum = RPCbeardnum;
	myskin = RPCmyskin;
	beardcolor = RPCbeardcolor;
	shirtcolor = RPCshirtcolor;
	var cont:int = 0;//////////cor de pele
	while(cont < skinpos.Length)
	{
		skinpos[cont].renderer.material = skincolors[RPCmyskin];
		cont++;
	}
	
	cont = 0;//////////cor da camisa
	while(cont < camisapos.Length)
	{
		camisapos[cont].renderer.material = camisacolors[RPCshirtcolor];
		cont++;
	}
	 //////////barba / bigode
	if(beard != null){Destroy(beard.gameObject);}
	if(RPCbeardnum >= 0)
	{	beard = Instantiate(beardprefabs[RPCbeardnum],beardpos.position,beardpos.rotation);
		beard.parent = beardpos;
		beard.GetComponent(sc_reference).refer.renderer.material = haircolors[RPCbeardcolor];
	}
	
	ap_synced = true;
}
@RPC function syncmyid(id:int)
{
	myid = id;
}

@RPC function askmyid()
{
	if(networkView.isMine)
	{
		networkView.RPC("syncmyid",RPCMode.All,myid);
	}
}
@RPC function call_for_fort(fabid:int,ownerid:int,pos:Vector3,rot:Quaternion)
{
	var obj:GameObject = GameObject.Find("matchcontroller(Clone)");
	
	obj.GetComponent(sc_matchcontroller).generate_bulding(fabid,ownerid,pos,rot);
}
@RPC function setbleeding(x:boolean)
{
	if(x){vasamento.emissionRate = 100;}
	else{vasamento.emissionRate = 0;}
}

@RPC function receiveammocrate()
{
	if(item[itemtoload] >= 0)
	{
		if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[item[itemtoload]].tipo == 0)
		{
			var tmpfloat:float = Random.Range(0.5,1.5); 
			var tmpint = gamecontrol.GetComponent(sc_gamecontrol).itemlist[item[itemtoload]].prefab.GetComponent(sc_gunscript).receiverammo*tmpfloat;
			if(tmpint < 1){tmpint = 1;}
			ammo[itemtoload] += tmpint;
			the_message = gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[67];
			message_a = 1;
			message_col = Color.yellow;
		}
	}
}

@RPC function playasound(num:int,source:int)
{
	audio.clip = sounds[num];
	soundsources[source].Play();
}

@RPC function addbleed()
{
	if(bleeding <= 0)
	{
		networkView.RPC("setbleeding",RPCMode.AllBuffered,true);
	}
	bleeding += 1;
	bleedingconter = 30;
}
@RPC
function hurtbyzombie(dmg:float)
{	
	if(armstate == 19)
	{
		GetComponent(sc_life).quantia -= dmg*0.3;
		GetComponent(sc_player).sec_life -= dmg/2*0.3;
	}
	else
	{	
		GetComponent(sc_life).quantia -= dmg;
		GetComponent(sc_player).sec_life -= dmg/2;
	}
}
@RPC
function hurt2(dmg:float)
{	
	sec_life -= dmg/2;
}

function Start (){
	//Input.simulateMouseWithTouches = true;
	var obj:GameObject;
		
	if(!networkView.isMine){enabled = false;}
	if(networkView.isMine)
	{
		sync_aparence(-1,myskin,beardcolor,shirtcolor);
		obj = GameObject.Find("timecontrol");
		if(obj != null)
		{
			timecontroler = obj.GetComponent(sc_timecontrol);
		}
		cam.parent = eye;
		cam.localPosition = Vector3.zero;
		cam.localEulerAngles = Vector3.zero;
		luminassao.light.enabled = true;
		
		start_eyey = cam.parent.parent.localPosition.x;
		eyey = start_eyey;
		
		currentlife = GetComponent(sc_life).quantia;
		sec_life = GetComponent(sc_life).quantia;
		
		if(destroyhead){Destroy(headmesh.gameObject); invisiblehead.enabled = true;}
		chest.GetComponent(Animation).animation["mp5grabmag"].speed = 0.5;
		chest.GetComponent(Animation).animation["m202grabmag"].speed = 0.5;
		chest.GetComponent(Animation).animation["shotpistol"].speed = 2;
		chest.GetComponent(Animation).animation["sprint"].speed = 0.22*sprintspeed;
		chest.GetComponent(Animation).animation["nogunidle"].speed = 0.25;
		chest.GetComponent(Animation).animation["interact"].speed = 0.25;
		chest.GetComponent(Animation).animation["holdingmeele1h"].speed = 0.25;
		chest.GetComponent(Animation).animation["cprhand"].speed = 1.6;
		chest.GetComponent(Animation).animation["handsback"].speed = 0.2;
		chest.GetComponent(Animation).animation["seringhold"].speed = 0.2;
		chest.GetComponent(Animation).animation["radiohold"].speed = 0.2;
		chest.GetComponent(Animation).animation["push"].speed = pushspeed;
		chest.GetComponent(Animation).animation["move_ladder"].speed = 2.8;
		chest.GetComponent(Animation).animation["climb_from_ladder"].speed = 1.1;
		chest.GetComponent(Animation).animation["flashlighthold"].speed = 0.25;
		chest.GetComponent(Animation).animation["gunbash"].speed = 2.5;
		chest.GetComponent(Animation).animation["axehold"].speed = 0.2;
		chest.GetComponent(Animation).animation["bathold"].speed = 0.2;
		chest.GetComponent(Animation).animation["barricade_hold"].speed = 0.2;
		chest.GetComponent(Animation).animation["m202remag"].speed = 0.7;
		chest.GetComponent(Animation).animation["bullpup_putmag"].speed = 0.85;
		chest.GetComponent(Animation).animation["colt_put"].speed = 0.85;
		
		chest.GetComponent(Animation).animation["jab_left"].speed =    2;
		chest.GetComponent(Animation).animation["jab_right"].speed = 1.8;
		chest.GetComponent(Animation).animation["cruzado_right"].speed = 3;
		chest.GetComponent(Animation).animation["cruzado_left"].speed = 3;
		chest.GetComponent(Animation).animation["boxe_block"].speed = 0.3;
		
		chest.GetComponent(Animation).animation["armroll"].speed = 1.5;
		chest.GetComponent(Animation).animation["arm_thiefvault"].speed = 1.6;
		
		legs.GetComponent(Animation).animation["walljumpleft"].speed = 2;
		legs.GetComponent(Animation).animation["walljumpright"].speed = 2;
		legs.GetComponent(Animation).animation["cprleg"].speed = 1.6;
		legs.GetComponent(Animation).animation["standing"].speed = 0.2;
		legs.GetComponent(Animation).animation["sprint"].speed = 0.22*sprintspeed;
		legs.GetComponent(Animation).animation["walk"].speed = 0.45*walkspeed;
		legs.GetComponent(Animation).animation["walkleft"].speed = 0.45*walkspeed;
		legs.GetComponent(Animation).animation["roll"].speed = 1.5;
		
		legs.GetComponent(Animation).animation["crouch_forward"].speed = 0.3*walkspeed;
		legs.GetComponent(Animation).animation["crouch_back"].speed = 0.17*walkspeed;
		legs.GetComponent(Animation).animation["crouch_left"].speed = 0.17*walkspeed;
		legs.GetComponent(Animation).animation["crouch_right"].speed = 0.17*walkspeed;
		
		legs.GetComponent(Animation).animation["move_ladder"].speed = 2.8;
		legs.GetComponent(Animation).animation["climb_from_ladder"].speed = 1.1;
		
		legs.GetComponent(Animation).animation["walkback"].speed = 0.70*walkspeed*walkbackmulti;
		legs.GetComponent(Animation).animation["jump"].speed = 2;
		legs.GetComponent(Animation).animation["leg_thiefvault"].speed = 1.6;
		
		generatehanditem();
		
		legs.animation.Play("fall");
		networkView.RPC("playleganim",RPCMode.Others,"standing",legs.GetComponent(Animation).animation["standing"].speed);
		
		transform.eulerAngles.y = Random.Range(0,360);
		networkView.RPC("setmyname",RPCMode.OthersBuffered,playername);
	}
}
@RPC function asktheplayeranim()
{
	if(networkView.isMine)
	{
		networkView.RPC("changeitem",RPCMode.Others,item[itemselected]);
		networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
	}
}
function animateinoptions()
{
	if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 0)
	{
		chest.animation.CrossFade(handitem.GetComponent(sc_gunscript).idleanim,0.2);
		networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_gunscript).idleanim,0.2,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).idleanim].speed);
	}
	if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 1)
	{
		chest.animation.CrossFade("nogunidle",0.2);
		networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
	}
	if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 2)
	{
		chest.animation.CrossFade(handitem.GetComponent(sc_meelegun).holdanim,0.2);
		networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_meelegun).holdanim,0.2,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_meelegun).holdanim].speed);
	}
	if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 3)
	{
		chest.animation.CrossFade(handitem.GetComponent(sc_consumable).holdanim,0.2);
		networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_consumable).holdanim,0.2,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_consumable).holdanim].speed);
	}
	if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 4)
	{
		chest.animation.CrossFade("seringhold",0.2);
		networkView.RPC("fadearmanim",RPCMode.Others,"seringhold",0.2,chest.GetComponent(Animation).animation["seringhold"].speed);
	}
	if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 5)
	{
		chest.animation.CrossFade(handitem.GetComponent(sc_fortification).hold_anim,0.2);
		networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_fortification).hold_anim,0.2,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_fortification).hold_anim].speed);
	}
}

function generatehanditem()
{
	if(handitem != null)
	{
		Destroy(handitem.gameObject);
	}
	if(item[itemselected] >= 0)
	{
		handitem = Instantiate(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].prefab);
		handitem.parent = handpos;
		handitem.localPosition = Vector3.zero;
		handitem.localEulerAngles = Vector3.zero;
		
		if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 0)
		{
			if(handitem.GetComponent(sc_gunscript).hidemagonoutammo)
			{
				if(quant[itemtoselect] <= 0)
				{
					if(handitem.GetComponent(sc_gunscript).magmesh != null)
					{handitem.GetComponent(sc_gunscript).magmesh.renderer.enabled = false;}
				}
			}
		}
		animateinoptions();
	}
	else
	{
		chest.animation.Play("nogunidle");
		networkView.RPC("playarmanim",RPCMode.Others,"nogunidle",chest.GetComponent(Animation).animation["nogunidle"].speed);
	}
	networkView.RPC("changeitem",RPCMode.Others,item[itemselected]);
}

@RPC function get_grab(targ:Vector3,pos:Vector3)
{
	grabtype = 1;
	networkView.RPC("sync_grab",RPCMode.Server,1);
	
	canspin = false;
	armrottype = 1;
	networkView.RPC("setrot",RPCMode.Others,armrottype);
				
	armstate = 20;
	legstate = 7;
	legs.animation.CrossFade("standing",0.2);
	networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);
	
	chest.animation.Play("grabed");
	networkView.RPC("playarmanim",RPCMode.Others,"grabed",chest.GetComponent(Animation).animation["grabed"].speed);
	
	Mtarg = targ;
	Mtargpos = pos;
}
 
@RPC function setcol(b:boolean)
{
	if(b)
	{
		alt_collider.collider.enabled = true;
		GetComponent(CapsuleCollider).height = 1.85;
	}
	else{
		alt_collider.collider.enabled = false;
		GetComponent(CapsuleCollider).height = 1;
	}
}
function OnCollisionStay(collision : Collision)
{
	
	if((legstate == 8)||(legstate == 9))
	{
		if(collision.collider.gameObject.layer == 9)
		{
			Debug.Log(""+Vector2.Distance(Vector2(transform.position.x,transform.position.z),Vector2(interact_obj.transform.position.x,interact_obj.transform.position.z)));
			if(Vector2.Distance(Vector2(transform.position.x,transform.position.z),Vector2(interact_obj.transform.position.x,interact_obj.transform.position.z)) > 0.7)
			{
				armrottype = 0;
				networkView.RPC("setrot",RPCMode.Others,armrottype);
				canspin = true;
				
				legstate = 0;
				legs.animation.CrossFade("jump",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"jump",0.3,legs.GetComponent(Animation).animation["jump"].speed);
					
				armstate = 11;
				animationcont = 0;
				futurearmstate = 0;
				waitingtime = 250;
				
				if(item[itemselected] >= 0)
				{animateinoptions();}
				else
				{
					chest.animation.CrossFade("nogunidle",0.2);
					networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
				}
			}
		}
	}
}
function LateUpdate () {
	if(slowtime)
	{
		Time.timeScale = sloweffect;
		Time.fixedDeltaTime = 0.02 * Time.timeScale;
	}
	if(cheat_on)
	{
		sprintbar = 100;
		GetComponent(sc_life).quantia = 100;
		sec_life = 100;
	}
	var cont:int = 0;
	var insted:Transform;
	var hit:RaycastHit;
	var lmask:LayerMask;
	var tmpbool:boolean = false;
	
	var tmpbool2:boolean = false;
	var tmpint:int = 0;
	var tmpint2:int = 0;
	movimento = Vector3.zero;
	var tmpfloat:float = 0;
	var tmpvec3:Vector3;
	var tmpvec2:Vector2;
	stuntef = Mathf.Lerp(stuntef,0,5*Time.deltaTime);
	if(stuntef < 0.05){stuntef = 0;}
	
	stuntefcont += Time.deltaTime;
	if(stuntefcont > 0.03)
	{
		headang += Random.Range(-stuntef,stuntef);
		transform.Rotate(Vector3.up*Random.Range(-stuntef,stuntef));
		stuntefcont = 0;
	}
	
	if(hitM_conter > 0)
	{
		hitM_conter -= Time.deltaTime*5;
		if(hitM_conter < 0 ){hitM_conter = 0;}
	}
	
	/*if(solaris == null)
	{
		solaris = GameObject.Find("sol1");
	}
	if(solaris != null)
	{
		solaris.transform.rotation = transform.rotation;
		solaris.transform.Rotate(Vector3.right*45);
	}*/
	
	luminassao.light.intensity = 0.1+(timecontroler.timecoef*0.1);
	luminassao.light.range = 30+(timecontroler.timecoef*250);
	
	if(GetComponent(sc_viewdist) != null)
	{
		GetComponent(sc_viewdist).coef = timecontroler.timecoef;
	}
	if(bleeding > 0)
	{
		red_a += 2*Time.deltaTime;
		if(red_a > 2){red_a -= 2;}
		
		GetComponent(sc_life).quantia -= bleeding*Time.deltaTime;
		bleedingconter -= Time.deltaTime;
		if(bleedingconter <= 0)
		{
			bleeding = 0;
			networkView.RPC("setbleeding",RPCMode.AllBuffered,false);
		}
		
	}
	
	///////////////////////////////////////////////////////////////////////*checa o isgrounded*/////////////////////////
	lmask = 1 << 8;
	isgrounded = Physics.Raycast(transform.position,Vector3.down,hit,1.35,lmask);
	if(isgrounded)
	{
		step_normal = hit.normal;
	}
	
	//cam.parent.parent.localPosition.x = eyey;
	if(cam.parent != null)
	{cam.parent.parent.localPosition.x = Mathf.Lerp(cam.parent.parent.localPosition.x,eyey,10*Time.deltaTime);}
	else
	{senddata = false;}
	if(flash.light.enabled == true)
	{
		flashconter -= 5000*Time.deltaTime;
		if(flashconter <= 0)
		{
			flash.light.enabled = false;
		}
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////PERNAS//////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	if(legstate == 0) /*caindo ou pulando*/
	{
		barulho = 0;
		if(controled)
		{
			if( (Input.GetAxis("Sprint") <= 0) || (sprintbar < mintosrpint) )
			{movimento.z = Input.GetAxis("Vertical")*walkspeed*jumpmovement;}
			else
			{
				movimento.z = Input.GetAxis("Sprint")*sprintspeed*jumpmovement;
				sprintbar -= Input.GetAxis("Sprint")*sprintdecay*Time.deltaTime;
			}
			movimento.x = Input.GetAxis("Horizontal")*walkspeed*jumpmovement;
		}
		if(vy > 0)////bateu a cabeça
		{
			lmask = 1 << 8;
			if(Physics.Raycast(transform.position,Vector3.up,hit,1.3,lmask))
			{vy = -0.01;}
		}
		
		tmpbool = (vy >= 0);
		vy -= grav*Time.deltaTime;
		
		if(vy < -16){vy = -16;} ////limite de velocidade

		if(tmpbool && (vy < 0)) //////mudança de animaçao
		{
			startjump = transform.position.y;
			legs.animation.CrossFade("fall",0.2);
			networkView.RPC("fadeleganim",RPCMode.Others,"fall",0.2,legs.GetComponent(Animation).animation["fall"].speed);
		}
		
		if(vy < jumpspeed/2) //////pulo na parede
		{
			if(act_dj)
			if(Input.GetButtonDown("Jump"))
			{
				tmpint = -1;
				
				lmask = 1 << 8;
				if(Physics.Raycast(transform.position-(Vector3.up*0.75),-transform.right,hit,0.75,lmask)){tmpint = 0;}
				if(Physics.Raycast(transform.position-(Vector3.up*0.75), transform.right,hit,0.75,lmask)){tmpint = 2;}
				
				if(Physics.Raycast(transform.position-(Vector3.up*0.75),transform.forward,hit,0.65,lmask)){tmpint = 1;}
				
				if(tmpint >= 0)
				{
					vy = jumpspeed*1.3;
					
					legs.animation.CrossFade(walljumpstr[tmpint],0.2);
					networkView.RPC("fadeleganim",RPCMode.Others,walljumpstr[tmpint],0.2,legs.GetComponent(Animation).animation[walljumpstr[tmpint]].speed);
					act_dj = false;
				}
			}
		}
		
		if(skill[0])if(Input.GetButton("Interact"))if((armstate == 0)||(armstate == 6)||(armstate == 7)) ////////grab na parede
		if(interacttype < 0)
		{
			lmask = 1 << 8;
			tmpbool = false;
			if(Physics.Raycast(transform.position+(Vector3.up*0.45),transform.forward,hit,0.7,lmask)){tmpbool = true;}
			if(Physics.Raycast(transform.position,transform.forward,hit,0.7,lmask)){tmpbool = true;}
			if(Physics.Raycast(transform.position-(Vector3.up*0.45),transform.forward,hit,0.7,lmask)){tmpbool = true;}
			
			if(tmpbool)
			{
				grabnormal = hit.normal;
				grabnormal.y = 0;
				grabnormal = -grabnormal;
				if(!Physics.SphereCast(transform.position+(Vector3.up*0.92),0.1,transform.forward,hit,0.65,lmask))
				{
					if(Physics.SphereCast(transform.position+(Vector3.up*1.03)+(transform.forward*0.65),0.1,Vector3.down,hit,1.6,lmask))
					{
						grabpos = transform.position;
						canspin = false;

						if(hit.distance > 0.55)
						{
							grabpos.y = hit.point.y+0.47;
							
							legstate = 13;
							legs.animation.CrossFade("leg_goodgrab",0.2);
							networkView.RPC("fadeleganim",RPCMode.Others,"leg_goodgrab",0.2,legs.GetComponent(Animation).animation["leg_goodgrab"].speed);

							armstate = 17;
							chest.animation.CrossFade("goodgrab",0.2);
							networkView.RPC("fadearmanim",RPCMode.Others,"goodgrab",0.2,chest.GetComponent(Animation).animation["goodgrab"].speed);
							armrottype = 1;
						}
						else
						{
							grabpos.y = hit.point.y-0.9;
							
							legstate = 12;
							legs.animation.CrossFade("leg_badgrab",0.2);
							networkView.RPC("fadeleganim",RPCMode.Others,"leg_badgrab",0.2,legs.GetComponent(Animation).animation["leg_badgrab"].speed);

							armstate = 17;
							chest.animation.CrossFade("badgrab",0.2);
							networkView.RPC("fadearmanim",RPCMode.Others,"badgrab",0.2,chest.GetComponent(Animation).animation["badgrab"].speed);
							armrottype = 1;
						}
						vy = 0;
					}
				}
			}
		}
		
		if(isgrounded && (vy < 0))
		{
			tmpfloat = startjump-transform.position.y;
			if(tmpfloat > 4.6)
			{
				spillblood();
				if((skill[0])&&(Input.GetKey(KeyCode.LeftControl)))
				{
					GetComponent(sc_life).quantia -= (tmpfloat-4.6)*5;
					sec_life -= (tmpfloat-4.6)*2.5;
				}
				else{
					GetComponent(sc_life).quantia -= (tmpfloat-4.6)*10;
					sec_life -= (tmpfloat-4.6)*5;
				}
			}
			tmpfloat = startjump-transform.position.y;
			
			if( (skill[0]) &&(Input.GetKey(KeyCode.LeftControl)) &&(tmpfloat > 0.5) &&(armstate == 0))
			{
				legstate = 11;
				animationcont = 0;
				legs.animation.CrossFade("roll",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"roll",0.2,legs.GetComponent(Animation).animation["roll"].speed);
				armstate = 17;
				chest.animation.CrossFade("armroll",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"armroll",0.2,chest.GetComponent(Animation).animation["armroll"].speed);
				armrottype = 1;
				vy = 0;
			}
			else
			{
				legstate = 1;
				legs.animation.CrossFade("standing",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);
			}
			vy = 0;
			soundsources[1].clip = sounds[3];
			soundsources[1].Play();
			networkView.RPC("playasound",RPCMode.Others,3,1);
		}
	}
	if((armstate == 1) && (legstate != 6)){armstate = 0;}
	
	
	if(legstate == 12) /*badgrab*/
	{
		transform.rotation = Quaternion.LookRotation(grabnormal, Vector3.up);
		transform.position = Vector3.Lerp(transform.position,grabpos,15*Time.deltaTime);
		
		if(Input.GetAxis("Vertical") < 0)
		{
			armstate = 0;
			if(item[itemselected] >= 0)
			{
				animateinoptions();
			}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
			
			legstate = 0;
			legs.animation.CrossFade("fall",0.5);
			networkView.RPC("fadeleganim",RPCMode.Others,"fall",0.3,legs.GetComponent(Animation).animation["fall"].speed);

			vy = 0;
			
			canspin = true;
			armrottype = 0;
		}
	}
	if(legstate == 13) /*goodgrab*/
	{
		transform.rotation = Quaternion.LookRotation(grabnormal, Vector3.up);
		transform.position = Vector3.Lerp(transform.position,grabpos,15*Time.deltaTime);
		if(Input.GetAxis("Vertical") > 0)if(Vector3.Distance(transform.position,grabpos) < 0.1)
		{			
			legstate = 14;
			animationcont = 0;
			legs.animation.CrossFade("goodclimb",0.5);
			networkView.RPC("fadeleganim",RPCMode.Others,"goodclimb",0.3,legs.GetComponent(Animation).animation["goodclimb"].speed);
			
			chest.animation.CrossFade("armgoodclimb",0.2);
			networkView.RPC("fadearmanim",RPCMode.Others,"armgoodclimb",0.2,chest.GetComponent(Animation).animation["armgoodclimb"].speed);

			vy = 0;
		}
		if(Input.GetAxis("Vertical") < 0)
		{
			armstate = 0;
			if(item[itemselected] >= 0)
			{
				animateinoptions();
			}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
			
			legstate = 0;
			legs.animation.CrossFade("fall",0.5);
			networkView.RPC("fadeleganim",RPCMode.Others,"fall",0.3,legs.GetComponent(Animation).animation["fall"].speed);

			vy = 0;
			
			canspin = true;
			armrottype = 0;
		}
	}
	if(legstate == 14) /*goodclimb*/
	{
		animationcont += 1*Time.deltaTime;
		if(animationcont < 0.35)
		{
			transform.Translate(Vector3.up*2*Time.deltaTime);
		}
		movimento.z = 4*(1-animationcont);
		if(animationcont >= 1)
		{
			armstate = 0;
			if(item[itemselected] >= 0)
			{
				animateinoptions();
			}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
			
			legstate = 0;
			legs.animation.CrossFade("fall",0.5);
			networkView.RPC("fadeleganim",RPCMode.Others,"fall",0.3,legs.GetComponent(Animation).animation["fall"].speed);

			vy = 0;
			
			canspin = true;
			armrottype = 0;
		}
	}
	if(legstate == 15) /*goodclimb*/
	{
		animationcont += 1*Time.deltaTime;

		transform.Translate(Vector3.up*vault_speed*(0.5-animationcont)*Time.deltaTime);
		
		movimento.z = 3+3*(animationcont);
		
		if(animationcont >= 1)
		{
			armstate = 0;
			if(item[itemselected] >= 0)
			{
				animateinoptions();
			}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
			
			legstate = 0;
			legs.animation.CrossFade("fall",0.5);
			networkView.RPC("fadeleganim",RPCMode.Others,"fall",0.3,legs.GetComponent(Animation).animation["fall"].speed);

			vy = 0;
			
			canspin = true;
			armrottype = 0;
			
			setcol(true);
			networkView.RPC("setcol",RPCMode.Others,true);
		}
	}
	if(legstate == 11) /*papa was a rolling stone, wherever he laid his hat was his home*/
	{
		movimento.z = 4;
		animationcont += 1*Time.deltaTime;
		
		if(animationcont > 1.3)
		{
			legstate = 1;
			crouching = true;
			legs.animation.CrossFade("crouch_idle",0.3);
			networkView.RPC("fadeleganim",RPCMode.Others,"crouch_idle",0.3,legs.GetComponent(Animation).animation["crouch_idle"].speed);
			
			//////////////////////////////
			armstate = 11;
			animationcont = 0;
			futurearmstate = 0;
			waitingtime = 250;
			armrottype = 0;
			
			if(item[itemselected] >= 0)
			{animateinoptions();}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
		}
		if(!isgrounded)
		{
			tmpbool = (vy >= 0);
			vy -= grav*Time.deltaTime;
			
			if(vy < -16){vy = -16;} ////limite de velocidade

			if(tmpbool && (vy < 0)) //////mudança de animaçao
			{
				startjump = transform.position.y;
			}
		}
		if(isgrounded && (vy < 0))
		{
			tmpfloat = startjump-transform.position.y;
			if(tmpfloat > 4.6)
			{
				spillblood();
				GetComponent(sc_life).quantia -= (tmpfloat-4.6)*10;
				sec_life -= (tmpfloat-4.6)*5;
			}
			vy = 0;
		}
	}
	if(legstate == 1) /*parado*/
	{
		barulho = 0;
		sprintbar += sprintregen*Time.deltaTime;
		if(sprintbar > 100){sprintbar = 100;}
		vy = 0;
		if(controled)
		{
			if(!crouching)
			{
				if(Input.GetKey(KeyCode.LeftControl)){legs.animation.CrossFade("crouch_idle",0.3);crouching = true;
				networkView.RPC("fadeleganim",RPCMode.Others,"crouch_idle",0.3,legs.GetComponent(Animation).animation["crouch_idle"].speed);}
			}
			else
			{
				if(!Input.GetKey(KeyCode.LeftControl)){legs.animation.CrossFade("standing",0.3);crouching = false;
				networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.3,legs.GetComponent(Animation).animation["standing"].speed);}
			}
			if(Input.GetAxis("Vertical") > 0)
			{
				legstate = 2;
				stepconter = 0;
				if(!crouching)
				{legs.animation.CrossFade("walk",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"walk",0.3,legs.GetComponent(Animation).animation["walk"].speed);}
				else
				{
					legs.animation.CrossFade("crouch_forward",0.3);
					networkView.RPC("fadeleganim",RPCMode.Others,"crouch_forward",0.3,legs.GetComponent(Animation).animation["crouch_forward"].speed);
				}
			}
			if(Input.GetAxis("Vertical") < 0)
			{
				legstate = 3;
				stepconter = 0;
				if(!crouching){
				legs.animation.CrossFade("walkback",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"walkback",0.3,legs.GetComponent(Animation).animation["walkback"].speed);}
				else
				{
					legs.animation.CrossFade("crouch_back",0.3);
					networkView.RPC("fadeleganim",RPCMode.Others,"crouch_back",0.3,legs.GetComponent(Animation).animation["crouch_back"].speed);
				}
			}
			if(Input.GetAxis("Vertical") == 0)
			{
				if(Input.GetAxis("Horizontal") < 0)
				{
					legstate = 4;
					stepconter = 0;
					if(!crouching)
					{legs.animation.CrossFade("walkleft",0.3);
					networkView.RPC("fadeleganim",RPCMode.Others,"walkleft",0.3,legs.GetComponent(Animation).animation["walkleft"].speed);}
					else
					{
						legs.animation.CrossFade("crouch_left",0.3);
						networkView.RPC("fadeleganim",RPCMode.Others,"crouch_left",0.3,legs.GetComponent(Animation).animation["crouch_left"].speed);
					}
				}
				if(Input.GetAxis("Horizontal") > 0)
				{
					legstate = 5;
					stepconter = 0;
					if(!crouching)
					{legs.animation.CrossFade("walkleft",0.3);
					networkView.RPC("fadeleganim",RPCMode.Others,"walkleft",0.3,legs.GetComponent(Animation).animation["walkleft"].speed);}
					else
					{
						legs.animation.CrossFade("crouch_right",0.3);
						networkView.RPC("fadeleganim",RPCMode.Others,"crouch_right",0.3,legs.GetComponent(Animation).animation["crouch_right"].speed);
					}
				}
			}
			
			if((Input.GetAxis("Sprint") > 0) && (armstate == 0) && (sprintbar >= mintosrpint))
			{
				legstate = 6;
				stepconter = 0;
				legs.animation.CrossFade("sprint",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"sprint",0.3,legs.GetComponent(Animation).animation["sprint"].speed);
				
				armstate = 1;
				chest.animation.CrossFade("sprint",0.3);
				networkView.RPC("fadearmanim",RPCMode.Others,"sprint",0.3,chest.GetComponent(Animation).animation["sprint"].speed);
			}
		}
		
	}
	
	if(crouching){walkmulti = 0.5;}
	else{walkmulti = 1;}
	if(legstate == 2) /*andando pra frente*/
	{
		if(!crouching)
		{barulho = walknoise;}
		else
		{barulho = 0;}
		sprintbar += sprintregen*0.33*Time.deltaTime;
		if(sprintbar > 100){sprintbar = 100;}
		vy = 0;
		if(controled)
		{
			if(!crouching)
			{
				if(Input.GetKey(KeyCode.LeftControl)){legs.animation.CrossFade("crouch_forward",0.3);crouching = true;
				networkView.RPC("fadeleganim",RPCMode.Others,"crouch_forward",0.3,legs.GetComponent(Animation).animation["crouch_forward"].speed);}
			}
			else
			{
				if(!Input.GetKey(KeyCode.LeftControl)){legs.animation.CrossFade("walk",0.3);crouching = false;
				networkView.RPC("fadeleganim",RPCMode.Others,"walk",0.3,legs.GetComponent(Animation).animation["walk"].speed);}
			}
			stepconter += 45*walkspeed*walkmulti*Time.deltaTime;
			if(stepconter > 100)
			{
				soundsources[1].clip = sounds[3];
				soundsources[1].Play();
				networkView.RPC("playasound",RPCMode.Others,3,1);
				stepconter -= 100;
			}
			movimento.z = Input.GetAxis("Vertical")*walkmulti*walkspeed;
			movimento.x = Input.GetAxis("Horizontal")*walkmulti*walkspeed;
			if(Input.GetAxis("Vertical") <= 0)
			{
				legstate = 1;
				if(!crouching)
				{legs.animation.CrossFade("standing",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);}
				else
				{
					legs.animation.CrossFade("crouch_idle",0.2);
					networkView.RPC("fadeleganim",RPCMode.Others,"crouch_idle",0.2,legs.GetComponent(Animation).animation["crouch_idle"].speed);
				}
			}
			if(Input.GetAxis("Vertical") < 0)
			{
				legstate = 3;
				if(!crouching){
				legs.animation.CrossFade("walkback",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"walkback",0.3,legs.GetComponent(Animation).animation["walkback"].speed);}
				else
				{
					legs.animation.CrossFade("crouch_back",0.3);
					networkView.RPC("fadeleganim",RPCMode.Others,"crouch_back",0.3,legs.GetComponent(Animation).animation["crouch_back"].speed);
				}
			}
			
			if((Input.GetAxis("Sprint") > 0) && (armstate == 0) && (sprintbar >= mintosrpint))
			{
				legstate = 6;
				legs.animation.CrossFade("sprint",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"sprint",0.3,legs.GetComponent(Animation).animation["sprint"].speed);
				
				armstate = 1;
				chest.animation.CrossFade("sprint",0.3);
				networkView.RPC("fadearmanim",RPCMode.Others,"sprint",0.3,chest.GetComponent(Animation).animation["sprint"].speed);
			}
		}
		else
		{
			legstate = 1;
			if(!crouching)
			{legs.animation.CrossFade("standing",0.2);
			networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);}
			else
			{
				legs.animation.CrossFade("crouch_idle",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"crouch_idle",0.2,legs.GetComponent(Animation).animation["crouch_idle"].speed);
			}
		}
	}
	if(legstate == 3)  /*andando pra trás*/
	{
		if(!crouching)
		{barulho = walknoise;}
		else
		{barulho = 0;}
		sprintbar += sprintregen*0.33*Time.deltaTime;
		if(sprintbar > 100){sprintbar = 100;}
		vy = 0;
		if(controled)
		{
			if(!crouching)
			{
				if(Input.GetKey(KeyCode.LeftControl)){legs.animation.CrossFade("crouch_back",0.3);crouching = true;
				networkView.RPC("fadeleganim",RPCMode.Others,"crouch_back",0.3,legs.GetComponent(Animation).animation["crouch_back"].speed);}
			}
			else
			{
				if(!Input.GetKey(KeyCode.LeftControl)){legs.animation.CrossFade("walkback",0.3);crouching = false;
				networkView.RPC("fadeleganim",RPCMode.Others,"walkback",0.3,legs.GetComponent(Animation).animation["walkback"].speed);}
			}
			stepconter += 70*walkbackmulti*walkmulti*walkspeed*Time.deltaTime;
			if(stepconter > 100)
			{
				soundsources[1].clip = sounds[3];
				soundsources[1].Play();
				networkView.RPC("playasound",RPCMode.Others,3,1);
				stepconter -= 100;
			}
			movimento.z = Input.GetAxis("Vertical")*walkmulti*walkspeed*walkbackmulti;
			movimento.x = Input.GetAxis("Horizontal")*walkmulti*walkspeed*walkbackmulti;
			if(Input.GetAxis("Vertical") >= 0)
			{
				legstate = 1;
				if(!crouching)
				{legs.animation.CrossFade("standing",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);}
				else
				{
					legs.animation.CrossFade("crouch_idle",0.2);
					networkView.RPC("fadeleganim",RPCMode.Others,"crouch_idle",0.2,legs.GetComponent(Animation).animation["crouch_idle"].speed);
				}
			}
			if(Input.GetAxis("Vertical") > 0)
			{
				legstate = 2;
				if(!crouching)
				{legs.animation.CrossFade("walk",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"walk",0.3,legs.GetComponent(Animation).animation["walk"].speed);}
				else
				{
					legs.animation.CrossFade("crouch_forward",0.3);
					networkView.RPC("fadeleganim",RPCMode.Others,"crouch_forward",0.3,legs.GetComponent(Animation).animation["crouch_forward"].speed);
				}
			}
			
			if((Input.GetAxis("Sprint") > 0) && (armstate == 0) && (sprintbar >= mintosrpint))
			{
				legstate = 6;
				legs.animation.CrossFade("sprint",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"sprint",0.3,legs.GetComponent(Animation).animation["sprint"].speed);
				
				armstate = 1;
				chest.animation.CrossFade("sprint",0.3);
				networkView.RPC("fadearmanim",RPCMode.Others,"sprint",0.3,chest.GetComponent(Animation).animation["sprint"].speed);
			}
		}
		else
		{
			legstate = 1;
			if(!crouching)
			{legs.animation.CrossFade("standing",0.2);
			networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);}
			else
			{
				legs.animation.CrossFade("crouch_idle",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"crouch_idle",0.2,legs.GetComponent(Animation).animation["crouch_idle"].speed);
			}
		}
	}
	if(legstate == 4) /*andando pra esquerda*/
	{
		if(!crouching)
		{barulho = walknoise;}
		else
		{barulho = 0;}
		sprintbar += sprintregen*0.33*Time.deltaTime;
		if(sprintbar > 100){sprintbar = 100;}
		vy = 0;
		if(controled)
		{
			if(!crouching)
			{
				if(Input.GetKey(KeyCode.LeftControl)){legs.animation.CrossFade("crouch_left",0.3);crouching = true;
				networkView.RPC("fadeleganim",RPCMode.Others,"crouch_left",0.3,legs.GetComponent(Animation).animation["crouch_left"].speed);}
			}
			else
			{
				if(!Input.GetKey(KeyCode.LeftControl)){legs.animation.CrossFade("walkleft",0.3);crouching = false;
				networkView.RPC("fadeleganim",RPCMode.Others,"walkleft",0.3,legs.GetComponent(Animation).animation["walkleft"].speed);}
			}
			stepconter += 45*walkmulti*walkspeed*Time.deltaTime;
			if(stepconter > 100)
			{
				soundsources[1].clip = sounds[3];
				soundsources[1].Play();
				networkView.RPC("playasound",RPCMode.Others,3,1);
				stepconter -= 100;
			}
			movimento.x = Input.GetAxis("Horizontal")*walkmulti*walkspeed;
			if(Input.GetAxis("Horizontal") == 0)
			{
				legstate = 1;
				if(!crouching)
				{legs.animation.CrossFade("standing",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);}
				else
				{
					legs.animation.CrossFade("crouch_idle",0.2);
					networkView.RPC("fadeleganim",RPCMode.Others,"crouch_idle",0.2,legs.GetComponent(Animation).animation["crouch_idle"].speed);
				}
			}
			if(Input.GetAxis("Horizontal") > 0)
			{
				legstate = 5;
				legs.animation.CrossFade("walkleft",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"walkleft",0.2,legs.GetComponent(Animation).animation["walkleft"].speed);
			}
			if(Input.GetAxis("Vertical") > 0)
			{
				legstate = 2;
				if(!crouching)
				{legs.animation.CrossFade("walk",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"walk",0.3,legs.GetComponent(Animation).animation["walk"].speed);}
				else
				{
					legs.animation.CrossFade("crouch_forward",0.3);
					networkView.RPC("fadeleganim",RPCMode.Others,"crouch_forward",0.3,legs.GetComponent(Animation).animation["crouch_forward"].speed);
				}
			}
			if(Input.GetAxis("Vertical") < 0)
			{
				legstate = 3;
				if(!crouching){
				legs.animation.CrossFade("walkback",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"walkback",0.3,legs.GetComponent(Animation).animation["walkback"].speed);}
				else
				{
					legs.animation.CrossFade("crouch_back",0.3);
					networkView.RPC("fadeleganim",RPCMode.Others,"crouch_back",0.3,legs.GetComponent(Animation).animation["crouch_back"].speed);
				}
			}
			
			if((Input.GetAxis("Sprint") > 0) && (armstate == 0) && (sprintbar >= mintosrpint))
			{
				legstate = 6;
				legs.animation.CrossFade("sprint",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"sprint",0.3,legs.GetComponent(Animation).animation["sprint"].speed);
				
				armstate = 1;
				chest.animation.CrossFade("sprint",0.3);
				networkView.RPC("fadearmanim",RPCMode.Others,"sprint",0.3,chest.GetComponent(Animation).animation["sprint"].speed);
			}
		}
		else
		{
			legstate = 1;
			if(!crouching)
			{legs.animation.CrossFade("standing",0.2);
			networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);}
			else
			{
				legs.animation.CrossFade("crouch_idle",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"crouch_idle",0.2,legs.GetComponent(Animation).animation["crouch_idle"].speed);
			}
		}
	}
	if(legstate == 5) /*andando pra direita*/
	{
		if(!crouching)
		{barulho = walknoise;}
		else
		{barulho = 0;}
		sprintbar += sprintregen*0.33*Time.deltaTime;
		if(sprintbar > 100){sprintbar = 100;}
		vy = 0;
		if(controled)
		{
			if(!crouching)
			{
				if(Input.GetKey(KeyCode.LeftControl)){legs.animation.CrossFade("crouch_right",0.3);crouching = true;
				networkView.RPC("fadeleganim",RPCMode.Others,"crouch_right",0.3,legs.GetComponent(Animation).animation["crouch_right"].speed);}
			}
			else
			{
				if(!Input.GetKey(KeyCode.LeftControl)){legs.animation.CrossFade("walkleft",0.3);crouching = false;
				networkView.RPC("fadeleganim",RPCMode.Others,"walkleft",0.3,legs.GetComponent(Animation).animation["walkleft"].speed);}
			}
			stepconter += 45*walkmulti*walkspeed*Time.deltaTime;
			if(stepconter > 100)
			{
				soundsources[1].clip = sounds[3];
				soundsources[1].Play();
				networkView.RPC("playasound",RPCMode.Others,3,1);
				stepconter -= 100;
			}
			movimento.x = Input.GetAxis("Horizontal")*walkmulti*walkspeed;
			if(Input.GetAxis("Horizontal") == 0)
			{
				legstate = 1;
				if(!crouching)
				{legs.animation.CrossFade("standing",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);}
				else
				{
					legs.animation.CrossFade("crouch_idle",0.2);
					networkView.RPC("fadeleganim",RPCMode.Others,"crouch_idle",0.2,legs.GetComponent(Animation).animation["crouch_idle"].speed);
				}
			}
			if(Input.GetAxis("Horizontal") < 0)
			{
				legstate = 4;
				legs.animation.CrossFade("walkleft",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"walkleft",0.2,legs.GetComponent(Animation).animation["walkleft"].speed);
			}
			if(Input.GetAxis("Vertical") > 0)
			{
				legstate = 2;
				if(!crouching)
				{legs.animation.CrossFade("walk",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"walk",0.3,legs.GetComponent(Animation).animation["walk"].speed);}
				else
				{
					legs.animation.CrossFade("crouch_forward",0.3);
					networkView.RPC("fadeleganim",RPCMode.Others,"crouch_forward",0.3,legs.GetComponent(Animation).animation["crouch_forward"].speed);
				}
			}
			if(Input.GetAxis("Vertical") < 0)
			{
				legstate = 3;
				if(!crouching){
				legs.animation.CrossFade("walkback",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"walkback",0.3,legs.GetComponent(Animation).animation["walkback"].speed);}
				else
				{
					legs.animation.CrossFade("crouch_back",0.3);
					networkView.RPC("fadeleganim",RPCMode.Others,"crouch_back",0.3,legs.GetComponent(Animation).animation["crouch_back"].speed);
				}
			}
			
			if((Input.GetAxis("Sprint") > 0) && (armstate == 0) && (sprintbar >= mintosrpint))
			{
				legstate = 6;
				legs.animation.CrossFade("sprint",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"sprint",0.3,legs.GetComponent(Animation).animation["sprint"].speed);
				
				armstate = 1;
				chest.animation.CrossFade("sprint",0.3);
				networkView.RPC("fadearmanim",RPCMode.Others,"sprint",0.3,chest.GetComponent(Animation).animation["sprint"].speed);
			}
		}
		else
		{
			legstate = 1;
			if(!crouching)
			{legs.animation.CrossFade("standing",0.2);
			networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);}
			else
			{
				legs.animation.CrossFade("crouch_idle",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"crouch_idle",0.2,legs.GetComponent(Animation).animation["crouch_idle"].speed);
			}
		}
	}
	
	if(crouching){real_crouching = true;}
	if((legstate != 1)&&(legstate != 2)&&(legstate != 3)&&(legstate != 4)&&(legstate != 5))
	{crouching = false;}
	if(crouching){crouch_cont = 0;}
	else if(real_crouching)
	{
		crouch_cont += 1*Time.deltaTime;
		if(crouch_cont > 0.3)
		{real_crouching = false;}
	}
	
	if(crouching)
	{spreadcoef = 0.5;}
	else{spreadcoef = 1f;}
	////////////////////////////////////////////
	if(real_crouching)
	{
		exposiback = 0;
		exposi = 0.3;
	}
	else
	{
		exposiback = 1;
		exposi = 1;
	}
	
	if(legstate == 6) /*SPRINTANDO BEM LOCO*/
	{
		barulho = sprintnoise;
		vy = 0;
		if(controled)
		{
			stepconter += 30*sprintspeed*Time.deltaTime;
			if(stepconter > 100)
			{
				soundsources[1].clip = sounds[3];
				soundsources[1].Play();
				networkView.RPC("playasound",RPCMode.Others,3,1);
				stepconter -= 100;
			}
			movimento.z = Input.GetAxis("Sprint")*sprintspeed;
			sprintbar -= Input.GetAxis("Sprint")*sprintdecay*Time.deltaTime;
			if(sprintbar < 0)
			{
				sprintbar = 0;
			}
			movimento.x = Input.GetAxis("Horizontal")*walkspeed;
			
			////////////////////////////VAULT
			if(skill[0])if(Input.GetButton("Interact"))if((armstate == 0)||(armstate == 6)||(armstate == 7)||(armstate == 17)||(armstate == 1)) ////////grab na parede
			if(interacttype < 0)
			{
				lmask = 1 << 8;
				tmpbool = false;
				if(Physics.Raycast(transform.position+(Vector3.up*0.45),transform.forward,hit,0.7,lmask)){tmpbool = true;}
				if(Physics.Raycast(transform.position,transform.forward,hit,0.7,lmask)){tmpbool = true;}
				if(Physics.Raycast(transform.position-(Vector3.up*0.45),transform.forward,hit,0.7,lmask)){tmpbool = true;}
				
				if(tmpbool)
				{
					grabnormal = hit.normal;
					grabnormal.y = 0;
					grabnormal = -grabnormal;
					if(!Physics.SphereCast(transform.position+(Vector3.up*0.92),0.1,transform.forward,hit,0.65,lmask))
					{
						if(Physics.SphereCast(transform.position+(Vector3.up*1.03)+(transform.forward*0.65),0.2,Vector3.down,hit,2.2,lmask))
						{
							grabpos = transform.position;
							if(hit.distance > 0.4)
							{
								tmpfloat = hit.distance-0.4;
								tmpfloat = tmpfloat/1.9;
								
								tmpfloat = 1-tmpfloat;
								
								vault_speed = 2+(6*tmpfloat);
								canspin = false;
								
								grabpos.y = hit.point.y+0.47;
								
								legstate = 15;
								legs.animation.CrossFade("leg_thiefvault",0.2);
								networkView.RPC("fadeleganim",RPCMode.Others,"leg_thiefvault",0.2,legs.GetComponent(Animation).animation["leg_thiefvault"].speed);

								armstate = 17;
								chest.animation.CrossFade("arm_thiefvault",0.2);
								networkView.RPC("fadearmanim",RPCMode.Others,"arm_thiefvault",0.2,chest.GetComponent(Animation).animation["arm_thiefvault"].speed);
								armrottype = 1;
								vy = 0;
								
								setcol(false);
								networkView.RPC("setcol",RPCMode.Others,false);
								
								animationcont = 0;
							}
						}
					}
				}
			}
			///////////////////////////////
			if((Input.GetAxis("Sprint") <= 0) || (sprintbar <= 0))
			{
				legstate = 1;
				legs.animation.CrossFade("standing",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);
				
				armstate = 11;
				animationcont = 0;
				futurearmstate = 0;
				waitingtime = 250;
				
				if(item[itemselected] >= 0)
				{
					animateinoptions();
				}
				else
				{
					chest.animation.CrossFade("nogunidle",0.2);
					networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
				}
			}
		}
		else
		{
			legstate = 1;
			legs.animation.CrossFade("standing",0.2);
			networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);
				
			if(item[itemselected] >= 0)
			{
				animateinoptions();
			}
			else
			{
				armstate = 0;
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
		}
	}
	if(legstate == 8) /*segurando na escada*/
	{
		barulho = 0;
		sprintbar += sprintregen*Time.deltaTime;
		if(sprintbar > 100){sprintbar = 100;}
		transform.rotation = Quaternion.Lerp(transform.rotation,interact_obj.transform.rotation,10*Time.deltaTime);
		tmpvec3 = interact_obj.transform.position;
		tmpvec3.y = transform.position.y;
		transform.position = Vector3.Lerp(transform.position,tmpvec3-(interact_obj.transform.forward*0.65),10*Time.deltaTime);
		if(transform.position.y > interact_obj.transform.position.y+(interact_obj.collider.bounds.size.y/2)-0.8)
		{
			transform.Translate(-Vector3.up*4*Time.deltaTime);
		}
		else
		{canmoveinladder = true;}
		if(Input.GetButtonDown("Jump") && controled)
		{
			armrottype = 0;
			networkView.RPC("setrot",RPCMode.Others,armrottype);
			canspin = true;
			
			legstate = 0;
			legs.animation.CrossFade("jump",0.3);
			networkView.RPC("fadeleganim",RPCMode.Others,"jump",0.3,legs.GetComponent(Animation).animation["jump"].speed);
					
			vy = jumpspeed;
			if(skill[0])
			{
				act_dj = true;
			}
				
			armstate = 11;
			animationcont = 0;
			futurearmstate = 0;
			waitingtime = 250;
			
			if(item[itemselected] >= 0)
			{animateinoptions();}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
		}
		if(controled &&(Input.GetAxis("Vertical") != 0) && canmoveinladder)
		{
			legs.animation.CrossFade("move_ladder",0.2);
			networkView.RPC("fadeleganim",RPCMode.Others,"move_ladder",0.2,legs.GetComponent(Animation).animation["move_ladder"].speed);
			
			chest.animation.CrossFade("move_ladder",0.2);
			networkView.RPC("fadearmanim",RPCMode.Others,"move_ladder",0.2,chest.GetComponent(Animation).animation["move_ladder"].speed);
			legstate = 9;
		}
	}
	if(legstate == 9)  /*andando na escada*/
	{
		barulho = 0;
		sprintbar += sprintregen*Time.deltaTime;
		if(sprintbar > 100){sprintbar = 100;}
		transform.Translate(Vector3.up*Input.GetAxis("Vertical")*2*Time.deltaTime);
		
		transform.rotation = Quaternion.Lerp(transform.rotation,interact_obj.transform.rotation,10*Time.deltaTime);
		tmpvec3 = interact_obj.transform.position;
		tmpvec3.y = transform.position.y;
		transform.position = Vector3.Lerp(transform.position,tmpvec3-(interact_obj.transform.forward*0.65),10*Time.deltaTime);
		
		if((Input.GetAxis("Vertical") == 0) || (!controled))
		{
			legs.animation.CrossFade("hold_ladder",0.2);
			networkView.RPC("fadeleganim",RPCMode.Others,"hold_ladder",0.2,legs.GetComponent(Animation).animation["hold_ladder"].speed);					
						
			chest.animation.CrossFade("hold_ladder",0.2);
			networkView.RPC("fadearmanim",RPCMode.Others,"hold_ladder",0.2,chest.GetComponent(Animation).animation["hold_ladder"].speed);
			legstate = 8;
		}
		if(Input.GetAxis("Vertical") > 0)
		{
			if(transform.position.y > interact_obj.transform.position.y+(interact_obj.collider.bounds.size.y/2)-0.8)
			{
				animationcont = 0;
				legstate = 10;
				chest.animation.CrossFade("climb_from_ladder",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"climb_from_ladder",0.2,chest.GetComponent(Animation).animation["climb_from_ladder"].speed);
			
				legs.animation.CrossFade("climb_from_ladder",0.2);
				networkView.RPC("fadeleganim",RPCMode.Others,"climb_from_ladder",0.2,legs.GetComponent(Animation).animation["climb_from_ladder"].speed);
			}
		}
		if((Input.GetAxis("Vertical") < 0) && (isgrounded || (transform.position.y < interact_obj.transform.position.y-(interact_obj.collider.bounds.size.y/2))) )
		{
			armrottype = 0;
			networkView.RPC("setrot",RPCMode.Others,armrottype);
			canspin = true;
			
			legstate = 1;
			legs.animation.CrossFade("standing",0.2);
			networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);
									
			armstate = 11;
			animationcont = 0;
			futurearmstate = 0;
			waitingtime = 250;
			
			if(item[itemselected] >= 0)
			{animateinoptions();}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
		}
		
		if(Input.GetButtonDown("Jump") && controled)
		{
			armrottype = 0;
			networkView.RPC("setrot",RPCMode.Others,armrottype);
			canspin = true;
			
			legstate = 0;
			legs.animation.CrossFade("jump",0.3);
			networkView.RPC("fadeleganim",RPCMode.Others,"jump",0.3,legs.GetComponent(Animation).animation["jump"].speed);
					
			vy = jumpspeed;
			if(skill[0])
			{
				act_dj = true;
			}
				
			armstate = 11;
			animationcont = 0;
			futurearmstate = 0;
			waitingtime = 250;
			
			if(item[itemselected] >= 0)
			{animateinoptions();}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
		}
	}
	if(legstate == 10)    /*segurando na escada*/
	{
		barulho = 0;
		sprintbar += sprintregen*Time.deltaTime;
		if(sprintbar > 100){sprintbar = 100;}
		transform.rotation = Quaternion.Lerp(transform.rotation,interact_obj.transform.rotation,10*Time.deltaTime);
		if(transform.position.y > interact_obj.transform.position.y+(interact_obj.collider.bounds.size.y/2)+0.5)
		{
			transform.Translate(Vector3.forward*2*Time.deltaTime);
		}
		if(transform.position.y < interact_obj.transform.position.y+(interact_obj.collider.bounds.size.y/2)+0.7)
		{
			transform.Translate(Vector3.up*2*Time.deltaTime);
		}
		animationcont += 100*Time.deltaTime;
		if(animationcont > 150)
		{
			armrottype = 0;
			networkView.RPC("setrot",RPCMode.Others,armrottype);
			canspin = true;
			
			legstate = 1;
			legs.animation.CrossFade("standing",0.2);
			networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);
									
			armstate = 11;
			animationcont = 0;
			futurearmstate = 0;
			waitingtime = 250;
			
			if(item[itemselected] >= 0)
			{animateinoptions();}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
		}
	}
	if((legstate == 1)||(legstate == 2)||(legstate == 3)||(legstate == 4)||(legstate == 5)||(legstate == 6))  /*pular OU CAIR*/
	{
		if(controled)
		{
			if(Input.GetButton("Jump"))
			{
				if(legstate == 6)
				{
					armstate = 0;
					if(item[itemselected] >= 0)
					{
						animateinoptions();
					}
					else
					{
						chest.animation.CrossFade("nogunidle",0.2);
						networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
					}
				}
				legstate = 0;
				legs.animation.CrossFade("jump",0.3);
				networkView.RPC("fadeleganim",RPCMode.Others,"jump",0.3,legs.GetComponent(Animation).animation["jump"].speed);
				
				barulho = 80;
				
				vy = jumpspeed;
				if(skill[0])
				{
					act_dj = true;
				}
			}
		}
		if(!isgrounded)
		{
			if(legstate == 6)
			{
				armstate = 0;
				if(item[itemselected] >= 0)
				{
					animateinoptions();
				}
				else
				{
					chest.animation.CrossFade("nogunidle",0.2);
					networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
				}
			}
			legstate = 0;
			legs.animation.CrossFade("fall",0.5);
			networkView.RPC("fadeleganim",RPCMode.Others,"fall",0.3,legs.GetComponent(Animation).animation["fall"].speed);

			vy = 0;
		}
	}
	///////////////////////////////////////////////////////////////////////*Gira o headang cabessa e brassos*///////////
	if(controled)
	{
		
		if(zooming)
		{headang += Input.GetAxis("Mouse Y")*mouse_sense*0.4;}
		else
		{headang += Input.GetAxis("Mouse Y")*mouse_sense;}
	}
	if(headang > headanglim){headang = headanglim;}
	if(headang < -headanglim){headang = -headanglim;}
	
	if(controled && canspin)
	{
		tmpint = 0;
		if(zooming)
		{
			if(handitem != null)
			{
				if(handitem.GetComponent(sc_gunscript) != null)
				{
					tmpfloat = 1/handitem.GetComponent(sc_gunscript).add_fov*15;
					if(tmpfloat > 1){tmpfloat = 0;}
					transform.Rotate(Vector3(0,Input.GetAxis("Mouse X")*mouse_sense*tmpfloat,0));
					tmpint = 1;
				}
			}
		}
		if(tmpint == 0)
		{
			transform.Rotate(Vector3(0,Input.GetAxis("Mouse X")*mouse_sense,0));
		}
	}
	if(armrottype == 0)
	{
		head.transform.Rotate(Vector3(0,0,headang));
		/*pivo.transform.Rotate(Vector3(0,0,headang));*/
		cont = 0;
		while(cont<arms.Length)
		{
			arms[cont].RotateAround (pivo.position,pivo.right, -headang);
			cont++;
		}
	}
	cont = 0;
	while(cont<bendingbones.Length)
	{
		bendingbones[cont].Rotate(transform.forward*bending,Space.World);
		cont++;
	}
	if(armrottype == 1)
	{
		head.transform.Rotate(Vector3(0,0,headang));
	}
	
	///////////////////////////////////////////////////////////////////////*checa o interact*//////////
	interacttype = -1;
	
	lmask = (1 << 15) | (1 << 8) | (1 << 20) | (1 << 21) | (1 << 22) | (1 << 23) | (1 << 27);
	tmpbool = Physics.Raycast(cam.position,cam.forward,hit,userange,lmask);
	if(tmpbool)
	{
		if(hit.collider.gameObject.layer == 15)
		{
			interacttype = 0;
		}
		if(hit.collider.gameObject.layer == 20)
		{
			if(!hit.collider.gameObject.GetComponent(sc_deadbodyparts).owner.GetComponent(sc_deadplayer).died)
			{
				interacttype = 1;
			}
		}
		if(hit.collider.gameObject.layer == 22)
		{
			interacttype = 2;
		}
		if(hit.collider.gameObject.layer == 23)
		{
			interacttype = 3;
		}
		if(hit.collider.gameObject.layer == 27)
		{
			tmpvec3 = hit.collider.gameObject.transform.InverseTransformPoint(transform.position);
			if(tmpvec3.z < 0)
			{
				if(hit.distance < (userange/2))
				{
					if(transform.position.y > hit.collider.gameObject.transform.position.y-(hit.collider.bounds.size.y/2)+0.7)
					if(transform.position.y < hit.collider.gameObject.transform.position.y+(hit.collider.bounds.size.y/2)-1)
					{interacttype = 4;}
				}
			}
			else
			{
				if(transform.position.y > hit.collider.gameObject.transform.position.y+(hit.collider.bounds.size.y/2))
				{interacttype = 4;}
			}
		}
	}
	tmpint = 0;
	if((controled)&&(item[itemselected] >= 0) && (armstate == 0))
	if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 0)
	{
		tmpint = 1;
		if(autoaim)
		{
			aiming = Input.GetButton("Aim");
		}
		else
		{
			if(Input.GetButtonDown("Aim"))
			{aiming = !aiming;}
		}
	}
	if(tmpint == 0){aiming = false;}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////Brassos/////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/*
		0 - mirando
		1 - sprint
		2,3,4,5,6,7,
		8 - ataque melee
		9 - ataque melee end
		10 - cpr
		11 - waiting
		12 - recuado
		13 - ??
		14 - ??
		15 - hold to throw
		16 - throw
		17 - ladder
	*/
	if(armstate == 15)              //*segurando o tróço*//
	{
		animationcont += 100*Time.deltaTime;
		if(animationcont > 30)
		{
			throw_charge += 0.8*Time.deltaTime;
			if(throw_charge > 1){throw_charge = 1;}
			
			if(!Input.GetButton("Shoot"))
			{
				chest.animation.CrossFade("throw_lance",0.1);
				networkView.RPC("fadearmanim",RPCMode.Others,"throw_lance",0.1,chest.GetComponent(Animation).animation["throw_lance"].speed);
				armstate = 16;
				animationcont = 0;
				
				reloadact1 = false;
			}
		}
	}
	if(armstate == 16)              //*tacando o tróço*//
	{
		animationcont += 100*Time.deltaTime;
		
		if(animationcont > 20)
		{
			if(!reloadact1)
			{
				insted = Network.Instantiate(handitem.GetComponent(sc_throwable).throw_prefab,handitem.position,handitem.rotation,3);
				if(handitem.GetComponent(sc_throwable).throw_prefab.GetComponent(sc_granada))
				{
					handitem.GetComponent(sc_throwable).throw_prefab.GetComponent(sc_granada).shooter = myid;
					handitem.GetComponent(sc_throwable).throw_prefab.GetComponent(sc_granada).shooterobj = transform;
				}
				insted.GetComponent(sc_sendpositionupdate).enabled = true;
				insted.GetComponent(sc_updateposition).enabled = false;
				if(insted.rigidbody)
				{
					insted.rigidbody.AddForce(throw_charge*cam.forward*handitem.GetComponent(sc_throwable).throw_force);
				}
				ammo[itemselected]--;
				Destroy(handitem.gameObject);
				reloadact1 = true;
			}
		}
		if(animationcont > 50)
		{			
			if(ammo[itemselected] > 0)
			{
				animationcont = 0;
				armstate = 2;
				chest.animation.CrossFade("changeitem",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"changeitem",0.2,chest.GetComponent(Animation).animation["changeitem"].speed);
			}
			else
			{
				armstate = 0;
				
				item[itemselected] = -1;
				quant[itemselected] = 0;
				ammo[itemselected] = 0;
				
				networkView.RPC("changeitem",RPCMode.Others,item[itemselected]);
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
		}
	}
	if(armstate == 20)              //*sendo agarrado*//
	{
		transform.position = Vector3.Lerp(transform.position,Mtargpos,Time.deltaTime*3);
		tmpvec3 = Mtarg-transform.position;
		tmpvec3.y = 0;
		transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(tmpvec3,Vector3.up),Time.deltaTime*3);
	}
	if(((armstate == 0)||(armstate == 11)||(armstate == 12)||(armstate == 14)||(armstate == 2)||(armstate == 3)||(armstate == 4)||(armstate == 5))&& controled) 
	{
		tmpint = 0;
		if(Input.GetKey(KeyCode.Z))
		{
			lmask = 1 << 8;
			if(!Physics.Raycast(transform.position+(Vector3.up*0.5),-transform.right,hit,0.7,lmask) )
			{bending = Mathf.Lerp(bending,25,3*Time.deltaTime);}
			else
			{tmpint = 1;}
		}
		if(Input.GetKey(KeyCode.X))
		{
			if(!Physics.Raycast(transform.position+(Vector3.up*0.5),transform.right,hit,0.7,lmask) )
			{bending = Mathf.Lerp(bending,-25,3*Time.deltaTime);}
			else
			{tmpint = 1;}
		}
		if((!Input.GetKey(KeyCode.Z)) && (!Input.GetKey(KeyCode.X))){tmpint= 1;}
		
		if(tmpint == 1){bending = Mathf.Lerp(bending,0,4*Time.deltaTime);}
	}
	else{bending = Mathf.Lerp(bending,0,4*Time.deltaTime);}
	
	if(cintoitem != null)
	{
		if(cintoitem.GetComponent(sc_throwable) != null)if(cintoitem.GetComponent(sc_throwable).islight)
		{	
			luminassao.light.enabled = false;
		}
		cinto_timer += 1*Time.deltaTime;
		if(cinto_timer > cinto_timerend)
		{
			Destroy(cintoitem.gameObject);
			networkView.RPC("changecintoitem",RPCMode.Others,-1);
			cinto_timer = 0;
		}
	}
	else
	{
		luminassao.light.enabled = true;
	}
	if(armstate == 0)              //*por na cintura*//
	{
		if(controled)
		{
			if(item[itemselected] >= 0)
			{
				if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 4)
				{
					if(handitem != null)if(handitem.GetComponent(sc_throwable).cinturavel)
					{
						if(Input.GetKey(KeyCode.Mouse2))
						{
							cinto_timer = 0;
							cinto_timerend = handitem.GetComponent(sc_throwable).decayend;
							
							ammo[itemselected]--;
							
							if(cintoitem != null)
							{Destroy(cintoitem.gameObject);}
							cintoitem = handitem;
							handitem = null;
							
							cintoitem.parent = cintopos;
							cintoitem.localPosition = Vector3.zero;
							cintoitem.localEulerAngles = Vector3.zero;
							
							networkView.RPC("changeitem",RPCMode.Others,item[itemselected]);
							reloadact1 = true;
							
							networkView.RPC("changecintoitem",RPCMode.Others,item[itemselected]);

							if(ammo[itemselected] > 0)
							{
								animationcont = 0;
								armstate = 2;
								chest.animation.CrossFade("changeitem",0.2);
								networkView.RPC("fadearmanim",RPCMode.Others,"changeitem",0.2,chest.GetComponent(Animation).animation["changeitem"].speed);
							}
							else
							{
								armstate = 0;
								
								item[itemselected] = -1;
								quant[itemselected] = 0;
								ammo[itemselected] = 0;
									
								chest.animation.CrossFade("nogunidle",0.2);
								networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
							}
							networkView.RPC("changeitem",RPCMode.Others,item[itemselected]);
						}
					}
				}
			}
		}
	}
	if(armstate != 0)
	{
		if(placer != null)
		{
			Destroy(placer.gameObject);
		}
	}
	if(armstate == 0)              //*mirando parado*//
	{
		if(lhandmag != null)
		{Destroy(lhandmag.gameObject);}
		
		if(controled)
		{
			itemtoselect -= Input.GetAxis("MouseWheel");
			
			if(itemtoselect < 0){itemtoselect = 9;}
			if(itemtoselect > 9){itemtoselect = 0;}
			
			if(Input.GetKey("1")){itemtoselect = 0;}
			if(Input.GetKey("2")){itemtoselect = 1;}
			if(Input.GetKey("3")){itemtoselect = 2;}
			if(Input.GetKey("4")){itemtoselect = 3;}
			if(Input.GetKey("5")){itemtoselect = 4;}
			if(Input.GetKey("6")){itemtoselect = 5;}
			if(Input.GetKey("7")){itemtoselect = 6;}
			if(Input.GetKey("8")){itemtoselect = 7;}
			if(Input.GetKey("9")){itemtoselect = 8;}
			if(Input.GetKey("0")){itemtoselect = 9;}
	
			if(Input.GetButtonDown("Interact"))
			{
				reloadact1 = false;
				armstate = 6;
				animationcont = 0;
				chest.animation.CrossFade("interact",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"interact",0.4,chest.GetComponent(Animation).animation["interact"].speed);
			}
		}
		
		if(item[itemselected] >= 0)
		{
			if(controled)
			{
				if(Input.GetButtonDown("Drop"))
				{
					tmpint = gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo;
					if(Input.GetKey(KeyCode.LeftAlt) && ((tmpint == 3)||(tmpint == 4)))
					{
						if(Network.isClient)
						{myspawner.networkView.RPC("dropitem",RPCMode.Server,item[itemselected],transform.position+(transform.forward*0.4),transform.rotation,quant[itemselected],1);}
						else{myspawner.GetComponent(sc_spawner).dropitem(item[itemselected],transform.position+(transform.forward*0.4),transform.rotation,quant[itemselected],1);}
						
						ammo[itemselected]--;
						if(ammo[itemselected] <= 0)
						{
							item[itemselected] = -1;
							quant[itemselected] = 0;
							ammo[itemselected] = 0;
							Destroy(handitem.gameObject);
							networkView.RPC("changeitem",RPCMode.Others,item[itemselected]);
						
							chest.animation.CrossFade("nogunidle",0.2);
							networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
							
							if(placer != null){Destroy(placer.gameObject);}
						}
					}
					else
					{
						if(Network.isClient)
						{myspawner.networkView.RPC("dropitem",RPCMode.Server,item[itemselected],transform.position+(transform.forward*0.4),transform.rotation,quant[itemselected],ammo[itemselected]);}
						else{myspawner.GetComponent(sc_spawner).dropitem(item[itemselected],transform.position+(transform.forward*0.4),transform.rotation,quant[itemselected],ammo[itemselected]);}
						
						item[itemselected] = -1;
						quant[itemselected] = 0;
						ammo[itemselected] = 0;
						
						Destroy(handitem.gameObject);
						networkView.RPC("changeitem",RPCMode.Others,item[itemselected]);
						
						chest.animation.CrossFade("nogunidle",0.2);
						networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
						
						if(placer != null){Destroy(placer.gameObject);}
					}
				}
			}
		}
		
		if(item[itemselected] >= 0)
		{
			if(controled)
			{
				if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 5)
				{
					if(place_conter >= 1){place_conter += Time.deltaTime;}
					if(placer == null)
					{
						placer = Instantiate(handitem.GetComponent(sc_fortification).ghost_fab,transform.position,transform.rotation);
					}
					if(placer != null)
					{
						placer.rotation = transform.rotation;
						lmask = (1 << 8)|(1 << 0);
						if(Physics.Raycast(cam.position,cam.forward,hit,5,lmask) )
						{
							placer.position = hit.point+(Vector3.up*handitem.GetComponent(sc_fortification).upintheair);
						}
						else
						{
							tmpvec3 = cam.position+(cam.forward*5);
							if(Physics.Raycast(tmpvec3,Vector3.down,hit,3,lmask) )
							{
								placer.position = hit.point+(Vector3.up*handitem.GetComponent(sc_fortification).upintheair);
							}
							else
							{
								placer.GetComponent(sc_canplace).willcan = 0;
								placer.GetComponent(sc_canplace).can = false;
								placer.position = tmpvec3+(Vector3.up*handitem.GetComponent(sc_fortification).downintheground);
							}
						}
						
						if(placer.GetComponent(sc_canplace).can == true)
						{
							if(Input.GetButtonDown("Shoot"))
							{
								place_conter = 1;
							}
						}
						else
						{place_conter = 0;}
						
						if(place_conter > 1.1)
						{
							if(Network.isClient)
							{
								networkView.RPC("call_for_fort",RPCMode.Server,handitem.GetComponent(sc_fortification).fabid,myid,placer.position,placer.rotation);
							}
							else
							{
								call_for_fort(handitem.GetComponent(sc_fortification).fabid,myid,placer.position,placer.rotation);
							}
							
							Destroy(placer.gameObject);
							ammo[itemselected]--;
							if(ammo[itemselected] <= 0)
							{
								item[itemselected] = -1;
								quant[itemselected] = 0;
								ammo[itemselected] = 0;
								Destroy(handitem.gameObject);
								networkView.RPC("changeitem",RPCMode.Others,item[itemselected]);
					
								chest.animation.CrossFade("nogunidle",0.2);
								networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
							}
							place_conter = 0;
						}
					}
				}
			}
		}
		if(item[itemselected] >= 0)
		{
			if(controled)
			{
				if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 1)
				{
					if(Input.GetButtonDown("Aim"))
					{
						reloadact1 = false;
						armstate = 14;
						animationcont = 0;
						chest.animation.CrossFade("push",0.2);
						networkView.RPC("fadearmanim",RPCMode.Others,"push",0.2,chest.GetComponent(Animation).animation["push"].speed);
					}
				}
				if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 4)
				{
					if(Input.GetButton("Shoot"))
					{
						armstate = 15;
						animationcont = 0;
						throw_charge = throw_charge_min;
						chest.animation.CrossFade("throwhold",0.3);
						networkView.RPC("fadearmanim",RPCMode.Others,"throwhold",0.3,chest.GetComponent(Animation).animation["throwhold"].speed);
						
						reloadact1 = false;
					}
					if(Input.GetButtonDown("Aim"))
					{
						reloadact1 = false;
						armstate = 14;
						animationcont = 0;
						chest.animation.CrossFade("push",0.2);
						networkView.RPC("fadearmanim",RPCMode.Others,"push",0.2,chest.GetComponent(Animation).animation["push"].speed);
					}
				}
				if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 2)
				{
					if(Input.GetButton("Shoot"))
					{
						armstate = 8;
						animationcont = 0;
						
						var atkrnd:int = 0;
						chest.GetComponent(Animation).animation[handitem.GetComponent(sc_meelegun).atkanim[atkrnd]].speed = handitem.GetComponent(sc_meelegun).atkspeed[atkrnd];
						chest.animation.CrossFade(handitem.GetComponent(sc_meelegun).atkanim[atkrnd],0.1);
						networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_meelegun).atkanim[atkrnd],0.1,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_meelegun).atkanim[atkrnd]].speed);
						
						reloadact1 = false;
					}
					if(Input.GetButtonDown("Aim"))
					{
						reloadact1 = false;
						armstate = 14;
						animationcont = 0;
						chest.animation.CrossFade("push",0.2);
						networkView.RPC("fadearmanim",RPCMode.Others,"push",0.2,chest.GetComponent(Animation).animation["push"].speed);
					}
				}
				if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 3)
				{
					if(Input.GetButton("Shoot"))
					{
						armstate = 13;
						animationcont = 0;
						
						if(!handitem.GetComponent(sc_consumable).rotarm)
						{
							armrottype = 1;
							networkView.RPC("setrot",RPCMode.Others,armrottype);
						}
						
						chest.animation.CrossFade(handitem.GetComponent(sc_consumable).consumeanim,0.1);
						networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_consumable).consumeanim,0.1,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_consumable).consumeanim].speed);
						
						reloadact1 = false;
					}
					if(Input.GetButtonDown("Aim"))
					{
						reloadact1 = false;
						armstate = 14;
						animationcont = 0;
						chest.animation.CrossFade("push",0.2);
						networkView.RPC("fadearmanim",RPCMode.Others,"push",0.2,chest.GetComponent(Animation).animation["push"].speed);
					}
				}
			}
			if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 0)
			{
				if(armstate == 0)
				{
					if(zooming)
					{
						if(handitem.GetComponent(sc_gunscript).hidemesh)
						{
							if(hideconter < handitem.GetComponent(sc_gunscript).timetohide)
							{
								hideconter += 10*Time.deltaTime;
								if(hideconter >= handitem.GetComponent(sc_gunscript).timetohide)
								{
									cont = 0;
									while(cont < handitem.GetComponent(sc_gunscript).meshtohide.Length)
									{
										handitem.GetComponent(sc_gunscript).meshtohide[cont].enabled = false;
										cont++;
									}
									cont = 0;
									while(cont < handtohide.Length)
									{
										handtohide[cont].enabled = false;
										cont++;
									}
									showscope = true;
								}
							}
						}
						if(!aiming)
						{
							if(handitem.GetComponent(sc_gunscript).hidemesh)
							{
								cont = 0;
								while(cont < handitem.GetComponent(sc_gunscript).meshtohide.Length)
								{
									handitem.GetComponent(sc_gunscript).meshtohide[cont].enabled = true;
									cont++;
								}
							}
							cont = 0;
							while(cont < handtohide.Length)
							{
								handtohide[cont].enabled = true;
								cont++;
							}
							showscope = false;
							cam.GetComponent(sc_camcript).to_fov = def_fov;
							eyey = start_eyey;
							zooming = false;
							chest.animation.CrossFade(handitem.GetComponent(sc_gunscript).idleanim,0.2);
							networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_gunscript).idleanim,0.2,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).idleanim].speed);
						}
					}
					else
					{
						if(aiming)
						{
							hideconter = 0;
							cam.GetComponent(sc_camcript).to_fov = def_fov-handitem.GetComponent(sc_gunscript).add_fov;
							eyey = start_eyey+handitem.GetComponent(sc_gunscript).add_ypos;
							zooming = true;
							chest.animation.CrossFade(handitem.GetComponent(sc_gunscript).aimanim,0.2);
							networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_gunscript).aimanim,0.2,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).aimanim].speed);
						}
					}
				}
				
				outpos.position = handitem.GetComponent(sc_gunscript).output.position;
				
				lmask = (1 << 11) | (1 << 8) | (1 << 21);
				tmpbool = Physics.Raycast(backpos.position,outpos.position-backpos.position,hit, Vector3.Distance(outpos.position,backpos.position)*1.1,lmask);
				if(tmpbool)
				{
					armstate = 12;
					chest.animation.CrossFade("handsback",0.2);
					networkView.RPC("fadearmanim",RPCMode.Others,"handsback",0.2,chest.GetComponent(Animation).animation["handsback"].speed);
				}
				
				tmpbool = false;
				if(controled)
				{
					if(handitem.GetComponent(sc_gunscript).auto && Input.GetButton("Shoot")){tmpbool = true;}
					if(!handitem.GetComponent(sc_gunscript).auto && Input.GetButtonDown("Shoot")){tmpbool = true;}
				}
				if((tmpbool) && (handitem.GetComponent(sc_gunscript).RFS) && (quant[itemselected] > 0) && (armstate == 0))
				{
					if(zooming)
					{
						chest.animation.Rewind(handitem.GetComponent(sc_gunscript).zoomshotanim);
						chest.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).zoomshotanim].speed = handitem.GetComponent(sc_gunscript).zoomshotanimspeed;
						chest.animation.Play(handitem.GetComponent(sc_gunscript).zoomshotanim);
						networkView.RPC("playarmanim",RPCMode.Others,handitem.GetComponent(sc_gunscript).zoomshotanim,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).zoomshotanim].speed);
					}
					else
					{
						chest.animation.Rewind(handitem.GetComponent(sc_gunscript).shotanim);
						chest.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).shotanim].speed = handitem.GetComponent(sc_gunscript).shotanimspeed;
						chest.animation.Play(handitem.GetComponent(sc_gunscript).shotanim);
						networkView.RPC("playarmanim",RPCMode.Others,handitem.GetComponent(sc_gunscript).shotanim,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).shotanim].speed);
						//headang+=1;
					}
					if(handitem.GetComponent(sc_gunscript).flyerpos != null)
					{
						insted = Instantiate(handitem.GetComponent(sc_gunscript).flyngbullet_fab,handitem.GetComponent(sc_gunscript).flyerpos.position,handitem.GetComponent(sc_gunscript).flyerpos.rotation);
						insted.rigidbody.AddForce(handitem.GetComponent(sc_gunscript).flyerpos.forward*300/Time.timeScale);
						insted.rigidbody.AddTorque(Vector3(Random.Range(-100,100),Random.Range(-100,100),0));
					}
					cont = 0;
					while(cont < handitem.GetComponent(sc_gunscript).bullets )
					{
						insted = Network.Instantiate(handitem.GetComponent(sc_gunscript).bulletprefab,handitem.GetComponent(sc_gunscript).output.position,handitem.GetComponent(sc_gunscript).output.rotation,1);
						insted.Rotate(Vector3.right*(Random.Range(0,360)));
						if(!zooming){tmpfloat = handitem.GetComponent(sc_gunscript).spread+handitem.GetComponent(sc_gunscript).addspread;}
						else{tmpfloat = handitem.GetComponent(sc_gunscript).spread;}
						tmpfloat = tmpfloat*spreadcoef;
						insted.Rotate(Vector3.forward*(Random.Range(-tmpfloat,tmpfloat)));
						if(insted.GetComponent(sc_shot) != null)
						{
							insted.GetComponent(sc_shot).canmove = true;
							insted.GetComponent(sc_shot).grav = handitem.GetComponent(sc_gunscript).gravity;
							insted.GetComponent(sc_shot).shooter = myid;
							insted.GetComponent(sc_shot).shooterobj = transform;
							insted.networkView.RPC("setcanmove",RPCMode.Others);
							insted.GetComponent(sc_shot).dano = handitem.GetComponent(sc_gunscript).dano;
							insted.GetComponent(sc_shot).push = handitem.GetComponent(sc_gunscript).pushforce;
							insted.GetComponent(sc_shot).speed = handitem.GetComponent(sc_gunscript).force;
						}
						if(insted.GetComponent(SC_MISSILE) != null)
						{
							insted.GetComponent(SC_MISSILE).canmove = true;
							insted.GetComponent(SC_MISSILE).shooter = myid;
							insted.GetComponent(SC_MISSILE).shooterobj = transform;
							insted.networkView.RPC("setcanmove",RPCMode.Others);
							insted.GetComponent(SC_MISSILE).dano = handitem.GetComponent(sc_gunscript).dano;
							insted.GetComponent(SC_MISSILE).exp_range = handitem.GetComponent(sc_gunscript).rangeofexp;
							insted.GetComponent(SC_MISSILE).push = handitem.GetComponent(sc_gunscript).pushforce;
							insted.GetComponent(SC_MISSILE).speed = handitem.GetComponent(sc_gunscript).force;
						}
						cont++;
					}
					barulho = handitem.GetComponent(sc_gunscript).noisemaker*noisemultiplier;
					if(handitem.GetComponent(sc_gunscript).muzleprefab != null)
					{
						insted = Network.Instantiate(handitem.GetComponent(sc_gunscript).muzleprefab,handitem.GetComponent(sc_gunscript).output.position,handitem.GetComponent(sc_gunscript).output.rotation,7);
						insted.parent = transform;
					}
					
					if(handitem.GetComponent(sc_gunscript).doflash)
					{
						flash.light.enabled = true;
						flashconter = 100;
						networkView.RPC("activelight",RPCMode.Others);
					}
					handitem.GetComponent(sc_gunscript).RFS = false;
					quant[itemselected]--;
					if(handitem.GetComponent(sc_gunscript).hidemagonoutammo)
					{
						if(quant[itemtoselect] <= 0)
						{
							if(handitem.GetComponent(sc_gunscript).magmesh != null)
							{handitem.GetComponent(sc_gunscript).magmesh.renderer.enabled = false;}
						}
					}
					handitem.GetComponent(sc_gunscript).conter = 0;
					
					headang += handitem.GetComponent(sc_gunscript).V_rec;
					transform.Rotate(Vector3.up*(Random.Range(-handitem.GetComponent(sc_gunscript).H_rec,handitem.GetComponent(sc_gunscript).H_rec)));
					if(handitem.GetComponent(sc_gunscript).animatedmesh != null)
					{
						if(handitem.GetComponent(sc_gunscript).gunshotanim != "null")
						{
							handitem.GetComponent(sc_gunscript).animatedmesh.animation.Rewind(handitem.GetComponent(sc_gunscript).gunshotanim);
							handitem.GetComponent(sc_gunscript).animatedmesh.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).gunshotanim].speed = handitem.GetComponent(sc_gunscript).gunshotanimspeed;
							handitem.GetComponent(sc_gunscript).animatedmesh.animation.Play(handitem.GetComponent(sc_gunscript).gunshotanim);
						}
					}	
					if(handitem.audio != null)
					{
						handitem.audio.Play();
					}
					networkView.RPC("playitemsound",RPCMode.Others);
				}
				
				if((quant[itemselected] < handitem.GetComponent(sc_gunscript).maxammo) && (ammo[itemselected] > 0))
				{
					if(Input.GetButton("Reload") && controled)
					{
						armstate = 4;
						animationcont = 0;
						
						reloadact1 = false;
						reloadact2 = false;
						reloadact3 = false;
						reloadact4 = false;
						reloadact5 = false;
					
						chest.animation.CrossFade(handitem.GetComponent(sc_gunscript).reloadgrabanim,0.2);
						networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_gunscript).reloadgrabanim,0.2,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).reloadgrabanim].speed);
					
						if(handitem.GetComponent(sc_gunscript).animatedmesh != null)
						{
							if(handitem.GetComponent(sc_gunscript).reloadanimST != "null")
							{
								handitem.GetComponent(sc_gunscript).animatedmesh.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).reloadanimST].speed = handitem.GetComponent(sc_gunscript).reloadanimSTspeed;
								handitem.GetComponent(sc_gunscript).animatedmesh.animation.CrossFade(handitem.GetComponent(sc_gunscript).reloadanimST,0.05);
							}
						}
					}
				}
				if(Input.GetButton("Shoot") && (quant[itemselected] <= 0) && (autoreload) && (ammo[itemselected] > 0))
				{
					armstate = 4;
					animationcont = 0;
					
					reloadact1 = false;
					reloadact2 = false;
					reloadact3 = false;
					reloadact4 = false;
					reloadact5 = false;
					chest.animation.CrossFade(handitem.GetComponent(sc_gunscript).reloadgrabanim,0.2);
					networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_gunscript).reloadgrabanim,0.2,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).reloadgrabanim].speed);
				
					if(handitem.GetComponent(sc_gunscript).animatedmesh != null)
					{
						if(handitem.GetComponent(sc_gunscript).reloadanimST != "null")
						{
							handitem.GetComponent(sc_gunscript).animatedmesh.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).reloadanimST].speed = handitem.GetComponent(sc_gunscript).reloadanimSTspeed;
							handitem.GetComponent(sc_gunscript).animatedmesh.animation.CrossFade(handitem.GetComponent(sc_gunscript).reloadanimST,0.05);
						}
					}
				}
				
			}
		}
		else
		{
			if(Input.GetButton("Aim"))
			{
				armstate = 19;
				animationcont = 0;
				chest.animation.CrossFade("boxe_block",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"boxe_block",0.2,chest.GetComponent(Animation).animation["boxe_block"].speed);
			}
			if(Input.GetButtonDown("Shoot"))     /*abc vou socar voce*/
			{
				boxenow = Random.Range(0,boxe_move.Length);
				
				sprintbar -= 10;
				if(sprintbar < 0){sprintbar = 0;}
				reloadact1 = false;
				armstate = 18;
				animationcont = 0;
				chest.animation.Rewind(boxe_move[boxenow]);
				chest.animation.CrossFade(boxe_move[boxenow],0.1);
				networkView.RPC("fadearmanim",RPCMode.Others,boxe_move[boxenow],0.1,chest.GetComponent(Animation).animation[boxe_move[boxenow]].speed);
			}
		}
		
		if(itemtoselect != itemselected)
		{
			if((item[itemtoselect] >= 0) || (item[itemselected] >= 0) )
			{
				animationcont = 0;
				armstate = 2;
				chest.animation.CrossFade("changeitem",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"changeitem",0.2,chest.GetComponent(Animation).animation["changeitem"].speed);
			}
			else if((item[itemtoselect] == -1) || (item[itemselected] == -1))
			{itemselected = itemtoselect;}
		}
	}
	if(armstate == 19)
	{
		if(animationcont < 0.3)
		{
			animationcont += Time.deltaTime;
		}
		else
		{
			if(!Input.GetButton("Aim"))
			{
				animationcont = 0;
				armstate = 0;
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
		}
	}
	if(armstate == 18)
	{
		animationcont += 10*Time.deltaTime;
		if(!reloadact1)if(animationcont > boxe_end[ boxenow ]*boxe_hittime[ boxenow ])
		{
			lmask = (1 << 10) | (1 << 8) | (1 << 21);
			if(Physics.Raycast(cam.position,cam.forward,hit,1.5,lmask))
			{
				if(hit.collider.gameObject.layer == 8)
				{
					soundsources[2].clip = sounds[6];
					soundsources[2].Play();
				}
				if(hit.collider.gameObject.GetComponent(sc_dmgtaker) != null)
				{
					if(hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_zumbi) != null)
					{
						hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("setkillerid",RPCMode.All,myid);
						
						hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_life).hurtme(boxe_atk[ boxenow ]);
						hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("hurtme",RPCMode.Others,boxe_atk[ boxenow ]);
						
						hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("pushme",RPCMode.All, boxe_efect[ boxenow ]);
					}
					soundsources[2].clip = sounds[4];
					soundsources[2].Play();
				}
			}
			reloadact1 = true;
		}
		
		if(animationcont > boxe_end[ boxenow ])
		{
			armstate = 0;
			chest.animation.CrossFade("nogunidle",0.2);
			networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
		}
	}	
	//////////////////////////////////////
	if(armstate != 0)
	{
		zooming = false;
		cam.GetComponent(sc_camcript).to_fov = def_fov;
		showscope = false;
		eyey = start_eyey;
		
		if(item[itemselected] >= 0)
		{
			if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 0)
			{
				if(handitem.GetComponent(sc_gunscript).hidemesh)
				{
					cont = 0;
					while(cont < handitem.GetComponent(sc_gunscript).meshtohide.Length)
					{
						handitem.GetComponent(sc_gunscript).meshtohide[cont].enabled = true;
						cont++;
					}
					cont = 0;
					while(cont < handtohide.Length)
					{
						handtohide[cont].enabled = true;
						cont++;
					}
				}
			}
		}
	}
	if(armstate == 14)
	{
		animationcont += 100*pushspeed*Time.deltaTime;
		if(!reloadact1)
		{
			if(animationcont > 30)
			{
				lmask = 1 << 11;
				if(Physics.Raycast(cam.position,cam.forward,hit,pushrange,lmask))
				{
					soundsources[2].clip = sounds[4];
					soundsources[2].Play();
					hit.collider.gameObject.networkView.RPC("pushme",RPCMode.All,0);
					reloadact1 = true;
				}
			}
		}
		if(animationcont > 60)
		{
			armstate = 11;
			animationcont = 0;
			futurearmstate = 0;
			waitingtime = 250;
			
			if(item[itemselected] >= 0)
			{
				animateinoptions();
			}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
		}
	}
	if(armstate == 13)
	{
		animationcont += 100*Time.deltaTime;
		if(animationcont > handitem.GetComponent(sc_consumable).consumetime)
		{
			armrottype = 0;
			networkView.RPC("setrot",RPCMode.Others,armrottype);
			
			Destroy(handitem.gameObject);
			networkView.RPC("changeitem",RPCMode.Others,item[itemselected]);
			
			if(handitem.GetComponent(sc_consumable).stopbleeding)
			{
				bleeding = 0;
				networkView.RPC("setbleeding",RPCMode.AllBuffered,false);
			}
			tmpint = handitem.GetComponent(sc_consumable).life;
			if(handitem.GetComponent(sc_consumable).life > 0){the_message = "+"+tmpint;}
			
			if(handitem.GetComponent(sc_consumable).callsuply)
			{
				the_message = "S.O.S";
				
				if(Network.isClient)	
				{myspawner.networkView.RPC("asksuplly",RPCMode.Server);}
				else{myspawner.GetComponent(sc_spawner).asksuplly();}
			}
			
			message_a = 1;
			message_col = Color.red;
			GetComponent(sc_life).quantia += handitem.GetComponent(sc_consumable).life;
			if(GetComponent(sc_life).quantia > 100){GetComponent(sc_life).quantia = 100;}
			
			sec_life += handitem.GetComponent(sc_consumable).life;
			if(sec_life > 100){sec_life = 100;}
			
			ammo[itemselected]--;
			if(ammo[itemselected] > 0)
			{
				animationcont = 0;
				armstate = 2;
				chest.animation.CrossFade("changeitem",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"changeitem",0.2,chest.GetComponent(Animation).animation["changeitem"].speed);
			}
			else
			{
				armstate = 0;
				
				item[itemselected] = -1;
				quant[itemselected] = 0;
				ammo[itemselected] = 0;
				
				Destroy(handitem.gameObject);
				networkView.RPC("changeitem",RPCMode.Others,item[itemselected]);
					
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
		}
	}
	if(armstate == 12)
	{
		lmask = (1 << 11) | (1 << 8) | (1 << 21);
		tmpbool = Physics.Raycast(backpos.position,outpos.position-backpos.position,hit, Vector3.Distance(outpos.position,backpos.position)*1.1,lmask);
		
		if(Input.GetButtonDown("Interact"))
		{
			reloadact1 = false;
			armstate = 6;
			animationcont = 0;
			chest.animation.CrossFade("interact",0.2);
			networkView.RPC("fadearmanim",RPCMode.Others,"interact",0.4,chest.GetComponent(Animation).animation["interact"].speed);
		}
		if((Input.GetButtonDown("Shoot") || Input.GetButtonDown("Aim")) && tmpbool)
		{
			if(hit.collider.gameObject.GetComponent(sc_zumbi) != null)
			{
				reloadact1 = false;
				armstate = 14;
				animationcont = 0;
				tmpint = 0;
				if(item[itemselected] >= 0)
				{
					if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 0)
					{
						if(handitem.GetComponent(sc_gunscript).basher)
						{tmpint = 1;}
					}
				}
				if(tmpint != 1)
				{
					chest.animation.CrossFade("push",0.2);
					networkView.RPC("fadearmanim",RPCMode.Others,"push",0.2,chest.GetComponent(Animation).animation["push"].speed);
				}
				else
				{
					chest.animation.CrossFade("gunbash",0.2);
					networkView.RPC("fadearmanim",RPCMode.Others,"gunbash",0.2,chest.GetComponent(Animation).animation["gunbash"].speed);
				}
			}
		}
		
		itemtoselect -= Input.GetAxis("MouseWheel");
			
		if(itemtoselect < 0){itemtoselect = 9;}
		if(itemtoselect > 9){itemtoselect = 0;}
		
		if(Input.GetKey("1")){itemtoselect = 0;}
		if(Input.GetKey("2")){itemtoselect = 1;}
		if(Input.GetKey("3")){itemtoselect = 2;}
		if(Input.GetKey("4")){itemtoselect = 3;}
		if(Input.GetKey("5")){itemtoselect = 4;}
		if(Input.GetKey("6")){itemtoselect = 5;}
		if(Input.GetKey("7")){itemtoselect = 6;}
		if(Input.GetKey("8")){itemtoselect = 7;}
		if(Input.GetKey("9")){itemtoselect = 8;}
		if(Input.GetKey("0")){itemtoselect = 9;}
		
		if(itemtoselect != itemselected)
		{
			if((item[itemtoselect] >= 0) || (item[itemselected] >= 0) )
			{
				animationcont = 0;
				armstate = 2;
				chest.animation.CrossFade("changeitem",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"changeitem",0.2,chest.GetComponent(Animation).animation["changeitem"].speed);
			}
			else if((item[itemtoselect] == -1) || (item[itemselected] == -1))
			{itemselected = itemtoselect;}
		}
			
		if(!tmpbool)
		{
			armstate = 11;
			animationcont = 0;
			futurearmstate = 0;
			waitingtime = 250;
			
			if(item[itemselected] >= 0)
			{
				animateinoptions();
			}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
		}
	}
	
	if(armstate == 8)    /*atkmelee*/
	{
		animationcont += 100*Time.deltaTime;
		if(!reloadact1)
		{
			if(animationcont > handitem.GetComponent(sc_meelegun).endtime[atkrnd]*handitem.GetComponent(sc_meelegun).hittime[atkrnd])
			{
				lmask = (1 << 10) | (1 << 8) | (1 << 21);
				tmpbool = Physics.Raycast(cam.position,cam.forward,hit,handitem.GetComponent(sc_meelegun).range,lmask);
				if(tmpbool)
				{
					reloadact1 = true;
					if(hit.collider.gameObject.layer == 8)
					{
						soundsources[2].clip = sounds[6];
						soundsources[2].Play();
					}
					if(hit.collider.gameObject.GetComponent(sc_dmgtaker) != null)
					{
						if(hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_zumbi) != null)
						{
							if(hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_zumbi).state != -1)
							{
								if(handitem.GetComponent(sc_meelegun).blunt)
								{
									soundsources[2].clip = sounds[4];
									soundsources[2].Play();
								}
								else
								{
									soundsources[2].clip = sounds[5];
									soundsources[2].Play();
								}
								//hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_life).quantia -= handitem.GetComponent(sc_meelegun).dmg+Random.Range(0,handitem.GetComponent(sc_meelegun).dmgrnd);
								tmpfloat = handitem.GetComponent(sc_meelegun).dmg+Random.Range(0,handitem.GetComponent(sc_meelegun).dmgrnd);
								hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("setkillerid",RPCMode.All,myid);
								hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_life).hurtme(tmpfloat);
								if(handitem.GetComponent(sc_meelegun).blunt){hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("pushme",RPCMode.All,handitem.GetComponent(sc_meelegun).blunt_efect);}
								hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("hurtme",RPCMode.Others,tmpfloat);
								hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("forcar",RPCMode.All,transform.TransformDirection(movimento)*5*(handitem.GetComponent(sc_meelegun).dmg+Random.Range(0,handitem.GetComponent(sc_meelegun).dmgrnd)));
							}
						}
						else
						{
							//hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_life).quantia -= handitem.GetComponent(sc_meelegun).dmg+Random.Range(0,handitem.GetComponent(sc_meelegun).dmgrnd);
							tmpfloat = handitem.GetComponent(sc_meelegun).dmg+Random.Range(0,handitem.GetComponent(sc_meelegun).dmgrnd);
							hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("hurtme",RPCMode.Others,tmpfloat);
							hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_life).hurtme(tmpfloat);
						}
					}
					if(hit.collider.gameObject.GetComponent(sc_particula) != null)
					{
						Network.Instantiate(hit.collider.gameObject.GetComponent(sc_particula).prefab,hit.point,Quaternion.LookRotation(hit.normal),3);
						if(hit.collider.gameObject.GetComponent(sc_particula).prefab.gameObject.name == "spark" )
						{
							soundsources[2].clip = sounds[7];
							soundsources[2].Play();
						}
					}
					else
					{
						Network.Instantiate(std_particle,hit.point,Quaternion.LookRotation(hit.normal),3);
					}
				}
			}
		}
		if(animationcont > handitem.GetComponent(sc_meelegun).endtime[atkrnd])
		{
			armstate = 9;
			animationcont = 0;
			chest.animation.CrossFade(handitem.GetComponent(sc_meelegun).holdanim,0.2);
			networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_meelegun).holdanim,0.2,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_meelegun).holdanim].speed);
		}
	}
	if(armstate == 9)    /*atkmeleend*/
	{
		animationcont += 1000*Time.deltaTime;
		
		if(animationcont > 210)
		{
			armstate = 0;
			animationcont = 0;
		}
	}
	
	if(armstate == 11)
	{
		animationcont += 1000*Time.deltaTime;
		if(animationcont > waitingtime)
		{
			armstate = futurearmstate;
			animationcont = 0;
		}
	}
	
	if(armstate == 10)  /*rpcendo*/
	{
		rpcbar -= 150*Time.deltaTime;
		if(Input.GetButtonDown("Shoot"))
		{
			rpcbar += 45;
		}
		if(rpcbar < 0){rpcbar = 0;}
		
		tmpbool = false;
		if(rpcbar > 500)
		{
			rpcconter = 0;
			rpcbar = 500;
			
			revivetarget.gameObject.networkView.RPC("revive",RPCMode.Others);
			myspawner.networkView.RPC("addmoney",RPCMode.All,50);
			tmpbool = true;
		}
		
		if(Input.GetButtonDown("Interact") || tmpbool || (revivetarget == null))
		{
			
			if(!tmpbool)
			{
				if(revivetarget != null){revivetarget.gameObject.networkView.RPC("setreviving",RPCMode.Others,false);}
			}
			legstate = 1;
			legs.animation.CrossFade("standing",0.2);
			networkView.RPC("fadeleganim",RPCMode.Others,"standing",0.2,legs.GetComponent(Animation).animation["standing"].speed);
			
			armstate = 11;
			animationcont = 0;
			futurearmstate = 0;
			waitingtime = 250;
			
			if(item[itemselected] >= 0)
			{
				animateinoptions();
			}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
			armrottype = 0;
			networkView.RPC("setrot",RPCMode.Others,armrottype);
			canspin = true;
		}
	}
	if(armstate == 6)    /*use 1*/
	{
		animationcont += 1000*Time.deltaTime;
		if(animationcont > 300)
		{
			if(!reloadact1)
			{
				lmask = (1 << 8)|(1 << 15)|(1 << 20)| (1 << 21) | (1 << 22) | (1 << 23) | (1 << 27);
				tmpbool = Physics.Raycast(cam.position,cam.forward,hit,userange,lmask);
				if(tmpbool)
				{
					if(hit.collider.gameObject.layer == 23)
					{
						hit.collider.gameObject.networkView.RPC("openbag",RPCMode.All);
						reloadact1 = true;
					}
					if(hit.collider.gameObject.layer == 27)
					{
						tmpvec3 = hit.collider.gameObject.transform.InverseTransformPoint(transform.position);
						if(tmpvec3.z < 0)
						{
							if(hit.distance < (userange/2))
							{
								if(transform.position.y > hit.collider.gameObject.transform.position.y-(hit.collider.bounds.size.y/2)+0.7)
								if(transform.position.y < hit.collider.gameObject.transform.position.y+(hit.collider.bounds.size.y/2)-1)
								{
									interact_obj = hit.collider.gameObject;
									legstate = 8;
									canmoveinladder = true;
									legs.animation.CrossFade("hold_ladder",0.3);
									networkView.RPC("fadeleganim",RPCMode.Others,"hold_ladder",0.3,legs.GetComponent(Animation).animation["hold_ladder"].speed);
											
									armstate = 17;
									chest.animation.CrossFade("hold_ladder",0.3);
									networkView.RPC("fadearmanim",RPCMode.Others,"hold_ladder",0.3,chest.GetComponent(Animation).animation["hold_ladder"].speed);
									
									armrottype = 1;
									networkView.RPC("setrot",RPCMode.Others,armrottype);
									canspin = false;
								}
							}
						}
						else
						{
							if(transform.position.y > hit.collider.gameObject.transform.position.y+(hit.collider.bounds.size.y/2))
							{
								interact_obj = hit.collider.gameObject;
								legstate = 8;
								canmoveinladder = false;
								legs.animation.CrossFade("hold_ladder",0.3);
								networkView.RPC("fadeleganim",RPCMode.Others,"hold_ladder",0.3,legs.GetComponent(Animation).animation["hold_ladder"].speed);
										
								armstate = 17;
								chest.animation.CrossFade("hold_ladder",0.3);
								networkView.RPC("fadearmanim",RPCMode.Others,"hold_ladder",0.3,chest.GetComponent(Animation).animation["hold_ladder"].speed);
								
								armrottype = 1;
								networkView.RPC("setrot",RPCMode.Others,armrottype);
								canspin = false;
							}
						}

					}
					if(hit.collider.gameObject.layer == 22)
					{
						if(item[itemselected] >= 0)
						{
							if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 0)
							{
								itemtoload = itemselected;
								if(Network.isClient)
								{hit.collider.gameObject.networkView.RPC("grabammocrate",RPCMode.Server,myid);}
								else{hit.collider.gameObject.GetComponent(sc_ammocrate).grabammocrate(myid);}
								reloadact1 = true;
								
								
								soundsources[0].clip = sounds[1];
								soundsources[0].Play();
								networkView.RPC("playasound",RPCMode.Others,1,0);
							}
							else
							{
								itemtoload = -1;
								cont = 0;
								while(cont < item.Length)
								{
									if(item[cont] >= 0)
									{
										if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[cont] ].tipo == 0)
										{
											itemtoload = cont;
											cont = item.Length;
										}
									}
									cont++;
								}
								if(itemtoload >= 0)
								{
									if(Network.isClient)
									{hit.collider.gameObject.networkView.RPC("grabammocrate",RPCMode.Server,myid);}
									else{hit.collider.gameObject.GetComponent(sc_ammocrate).grabammocrate(myid);}
									
									reloadact1 = true;
									soundsources[0].clip = sounds[1];
									soundsources[0].Play();
									networkView.RPC("playasound",RPCMode.Others,1,0);
								}
							}
						}
						else
						{
							itemtoload = -1;
							cont = 0;
							while(cont < item.Length)
							{
								if(item[cont] >= 0)
								{
									if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[cont] ].tipo == 0)
									{
										itemtoload = cont;
										cont = item.Length;
									}
								}
								cont++;
							}
							if(itemtoload >= 0)
							{
								if(Network.isClient)
								{hit.collider.gameObject.networkView.RPC("grabammocrate",RPCMode.Server,myid);}
								else{hit.collider.gameObject.GetComponent(sc_ammocrate).grabammocrate(myid);}
								reloadact1 = true;
								soundsources[0].clip = sounds[1];
								soundsources[0].Play();
								networkView.RPC("playasound",RPCMode.Others,1,0);
							}
						}
						
						
					}
					if(hit.collider.gameObject.layer == 20)
					{
						if(!hit.collider.gameObject.GetComponent(sc_deadbodyparts).owner.GetComponent(sc_deadplayer).died)
						{
							revivetarget = hit.collider.gameObject.GetComponent(sc_deadbodyparts).owner;
							if(!revivetarget.gameObject.GetComponent(sc_deadplayer).reviving)
							{
								revivetarget.gameObject.networkView.RPC("setreviving",RPCMode.Others,true);
								legstate = 7;
								legs.animation.CrossFade("cprleg",0.3);
								networkView.RPC("fadeleganim",RPCMode.Others,"cprleg",0.3,legs.GetComponent(Animation).animation["cprleg"].speed);
								
								armstate = 10;
								chest.animation.CrossFade("cprhand",0.3);
								networkView.RPC("fadearmanim",RPCMode.Others,"cprhand",0.3,chest.GetComponent(Animation).animation["cprhand"].speed);
							
								armrottype = 1;
								networkView.RPC("setrot",RPCMode.Others,armrottype);
								canspin = false;
								//hit.collider.gameObject.GetComponent(sc_deadbodyparts).owner.gameObject.networkView.RPC("revive",RPCMode.Others);
								reloadact1 = true;
								
								rpcbar = 0;
								rpcconter = 0;
							}
						}
					}
					if(hit.collider.gameObject.layer == 15)
					{
						if(hit.collider.gameObject.GetComponent(sc_ammo) == null)
						{
							tmpbool = false;
							cont = 0;
							while(cont < item.Length)
							{
								if(item[cont] < 0)
								{
									tmpbool =  true;
									cont = item.Length;
								}
								cont++;
							}
							if(tmpbool)
							{
								if(Network.isClient)
								{
									hit.collider.gameObject.networkView.RPC("grabitem",RPCMode.Server,myid);
								}
								else
								{
									hit.collider.gameObject.GetComponent(sc_canbetaken).grabitem(myid);
								}
								soundsources[0].clip = sounds[1];
								soundsources[0].Play();
								networkView.RPC("playasound",RPCMode.Others,1,0);
							}
						}
						else                               //munissao
						{
							tmpbool = false;
							cont = 0;
							while(cont < item.Length)
							{
								if(item[cont] == hit.collider.gameObject.GetComponent(sc_ammo).gunid)
								{
									tmpbool =  true;
									cont = item.Length;
								}
								cont++;
							}
							if(tmpbool)
							{
								if(Network.isClient)
								{hit.collider.gameObject.networkView.RPC("grabammo",RPCMode.Server,myid);}
								else
								{hit.collider.gameObject.GetComponent(sc_ammo).grabammo(myid);}
								soundsources[0].clip = sounds[1];
								soundsources[0].Play();
								networkView.RPC("playasound",RPCMode.Others,1,0);
								
							}
							else   //guardar o item da bala
							{
								tmpbool2 = false;
								cont = 0;
								while(cont < item.Length)
								{
									if(item[cont] < 0)
									{
										tmpbool2 =  true;
										cont = item.Length;
									}
									cont++;
								}
								if(tmpbool2)
								{
									if(Network.isClient)
									{hit.collider.gameObject.networkView.RPC("grabitem",RPCMode.Server,myid);}
									else
									{hit.collider.gameObject.GetComponent(sc_canbetaken).grabitem(myid);}
									soundsources[0].clip = sounds[1];
									soundsources[0].Play();
									networkView.RPC("playasound",RPCMode.Others,1,0);
								}
							}
						}
						reloadact1 = true;
					}
				}
			}
		}
		if(animationcont > 500)
		{
			armstate = 7;
			animationcont = 0;
			if(item[itemselected] >= 0)
			{				
				animateinoptions();
			}
			else
			{
				chest.animation.CrossFade("nogunidle",0.2);
				networkView.RPC("fadearmanim",RPCMode.Others,"nogunidle",0.2,chest.GetComponent(Animation).animation["nogunidle"].speed);
			}
		}
	}
	if(armstate == 7)    /*use 2*/
	{
		animationcont += 1000*Time.deltaTime;
		if(animationcont > 200)
		{
			armstate = 0;
			animationcont = 0;
		}
	}
	if(armstate == 4)   /*recarregando grab*/
	{
		animationcont += 100*Time.deltaTime;
		if( handitem.GetComponent(sc_gunscript).magmesh != null)
		{
			if(!reloadact1)
			{
				if(animationcont> handitem.GetComponent(sc_gunscript).releasemoment)
				{
					handitem.GetComponent(sc_gunscript).magmesh.renderer.enabled = false;
				}
			}
			if(!reloadact4)
			{
				if(animationcont> handitem.GetComponent(sc_gunscript).releasemoment)
				{	
					if(handitem.GetComponent(sc_gunscript).clipoutsound != null)
					{
						Network.Instantiate(handitem.GetComponent(sc_gunscript).clipoutsound,handitem.position,handitem.rotation,6);
					}
					reloadact4 = true;
				}	
			}
			if(!reloadact2)
			{
				if(animationcont> handitem.GetComponent(sc_gunscript).grabmoment)
				{
					if(handitem.GetComponent(sc_gunscript).magprefab != null)
					{
						lhandmag = Instantiate(handitem.GetComponent(sc_gunscript).magprefab);
						lhandmag.parent = lhandpos;
						lhandmag.localPosition = Vector3.zero;
						lhandmag.localEulerAngles = Vector3.zero;
					}
					reloadact2 = true;
				}
			}
		}
		if( handitem.GetComponent(sc_gunscript).magprefab != null)
		{
			if(!reloadact2)
			{
				if(animationcont> handitem.GetComponent(sc_gunscript).grabmoment)
				{
					if(handitem.GetComponent(sc_gunscript).magprefab != null)
					{
						lhandmag = Instantiate(handitem.GetComponent(sc_gunscript).magprefab);
						lhandmag.parent = lhandpos;
						lhandmag.localPosition = Vector3.zero;
						lhandmag.localEulerAngles = Vector3.zero;
					}
					reloadact2 = true;
				}
			}
		}
		if(animationcont > handitem.GetComponent(sc_gunscript).grabtime)
		{
			reloadact1 = false;
			reloadact2 = false;
			armstate = 5;
			animationcont = 0;
			chest.animation.CrossFade(handitem.GetComponent(sc_gunscript).reloadputanim,0.2);
			networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_gunscript).reloadputanim,0.2,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).reloadputanim].speed);
		}
	}
	if(armstate == 5)   /*recarregando put*/
	{
		animationcont += 100*Time.deltaTime;
		if( handitem.GetComponent(sc_gunscript).magmesh != null)
		{
			if(animationcont< handitem.GetComponent(sc_gunscript).putmoment)
			{
				handitem.GetComponent(sc_gunscript).magmesh.renderer.enabled = false;
			}
		}

		if(!reloadact1)
		{
			if(animationcont> handitem.GetComponent(sc_gunscript).putmoment)
			{
				if(lhandmag != null)
				{
					Destroy(lhandmag.gameObject);
				}
				if( handitem.GetComponent(sc_gunscript).magmesh != null)
				{handitem.GetComponent(sc_gunscript).magmesh.renderer.enabled = true;}
				if(handitem.GetComponent(sc_gunscript).clipinsound != null)
				{Network.Instantiate(handitem.GetComponent(sc_gunscript).clipinsound,handitem.position,handitem.rotation,6);}
				reloadact1 = true;
			}
		}
		if(!reloadact3)
		{
			if(animationcont> handitem.GetComponent(sc_gunscript).reloadendtime)
			{
				if(handitem.GetComponent(sc_gunscript).animatedmesh != null)
				{
					if(handitem.GetComponent(sc_gunscript).reloadanimEND != "null")
					{
						handitem.GetComponent(sc_gunscript).animatedmesh.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).reloadanimEND].speed = handitem.GetComponent(sc_gunscript).reloadanimENDspeed;
						handitem.GetComponent(sc_gunscript).animatedmesh.animation.CrossFade(handitem.GetComponent(sc_gunscript).reloadanimEND,0.05);
					}
				}
				reloadact3 = true;
			}
		}
		if(animationcont > handitem.GetComponent(sc_gunscript).puttime)
		{
			reloadact1 = false;
			reloadact2 = false;
			
			armstate = 0;
			animationcont = 0;
			
			chest.animation.CrossFade(handitem.GetComponent(sc_gunscript).idleanim,0.2);
			networkView.RPC("fadearmanim",RPCMode.Others,handitem.GetComponent(sc_gunscript).idleanim,0.2,chest.GetComponent(Animation).animation[handitem.GetComponent(sc_gunscript).idleanim].speed);
			
			if(ammo[itemselected] >= handitem.GetComponent(sc_gunscript).reloadamount)
			{
				ammo[itemselected] -= handitem.GetComponent(sc_gunscript).reloadamount;
				quant[itemselected] += handitem.GetComponent(sc_gunscript).reloadamount;
			}
			else
			{
				quant[itemselected] += ammo[itemselected];
				ammo[itemselected] = 0;
			}
			if(quant[itemselected] > handitem.GetComponent(sc_gunscript).maxammo)
			{
				ammo[itemselected] += quant[itemselected]-handitem.GetComponent(sc_gunscript).maxammo;
				quant[itemselected] = handitem.GetComponent(sc_gunscript).maxammo;
			}
		}
	}
	if(armstate == 1) /*sprint*/
	{
	}
	if(armstate == 2) /*changeitem*/
	{
		if(animationcont > 0)
		{
			itemtoselect -= Input.GetAxis("MouseWheel");
				
			if(itemtoselect < 0){itemtoselect = 9;}
			if(itemtoselect > 9){itemtoselect = 0;}
			
			if(Input.GetKey("1")){itemtoselect = 0;}
			if(Input.GetKey("2")){itemtoselect = 1;}
			if(Input.GetKey("3")){itemtoselect = 2;}
			if(Input.GetKey("4")){itemtoselect = 3;}
			if(Input.GetKey("5")){itemtoselect = 4;}
			if(Input.GetKey("6")){itemtoselect = 5;}
			if(Input.GetKey("7")){itemtoselect = 6;}
			if(Input.GetKey("8")){itemtoselect = 7;}
			if(Input.GetKey("9")){itemtoselect = 8;}
			if(Input.GetKey("0")){itemtoselect = 9;}
		}
			
		animationcont += 1000*Time.deltaTime;
		if(animationcont > 220)
		{
			armstate = 3;
			animationcont = 0;
			itemselected = itemtoselect;
			
			if(handitem != null)
			{
				Destroy(handitem.gameObject);
			}
			generatehanditem();
		}
	}
	if(armstate == 3)
	{
		if(animationcont > 0)
		{
			itemtoselect -= Input.GetAxis("MouseWheel");
				
			if(itemtoselect < 0){itemtoselect = 9;}
			if(itemtoselect > 9){itemtoselect = 0;}
			
			if(Input.GetKey("1")){itemtoselect = 0;}
			if(Input.GetKey("2")){itemtoselect = 1;}
			if(Input.GetKey("3")){itemtoselect = 2;}
			if(Input.GetKey("4")){itemtoselect = 3;}
			if(Input.GetKey("5")){itemtoselect = 4;}
			if(Input.GetKey("6")){itemtoselect = 5;}
			if(Input.GetKey("7")){itemtoselect = 6;}
			if(Input.GetKey("8")){itemtoselect = 7;}
			if(Input.GetKey("9")){itemtoselect = 8;}
			if(Input.GetKey("0")){itemtoselect = 9;}
		}
		
		animationcont += 1000*Time.deltaTime;
		if(animationcont > 220)
		{
			armstate = 0;
		}
	}
	
	/////////////////////////////////////////////
	if(controled)
	{
		if(zooming)
		{cam.localPosition.x += Input.GetAxis("Mouse X")*Time.deltaTime*camxmax*0.4;}
		else
		{cam.localPosition.x += Input.GetAxis("Mouse X")*Time.deltaTime*camxmax;}
		
		if(cam.localPosition.x > camxmax){cam.localPosition.x = camxmax;}
		if(cam.localPosition.x < -camxmax){cam.localPosition.x = -camxmax;}
		
		if(zooming)
		{cam.localPosition.y += Input.GetAxis("Mouse Y")*Time.deltaTime*camymax*2*0.4;}
		else
		{cam.localPosition.y += Input.GetAxis("Mouse Y")*Time.deltaTime*camymax*2;}
		
		if(cam.localPosition.y > camymax){cam.localPosition.y = camymax;}
		if(cam.localPosition.y < -camymax){cam.localPosition.y = -camymax;}
		
	}
	
	if(cam.localPosition.x > 0)
	{
		cam.localPosition.x -= Time.deltaTime*camxmax;
		if(cam.localPosition.x < 0){cam.localPosition.x = 0;}
	}
	if(cam.localPosition.x < 0)
	{
		cam.localPosition.x += Time.deltaTime*camxmax;
		if(cam.localPosition.x > 0){cam.localPosition.x = 0;}
	}
	
	if(cam.localPosition.y > 0)
	{
		cam.localPosition.y -= Time.deltaTime*camymax;
		if(cam.localPosition.y < 0){cam.localPosition.y = 0;}
	}
	if(cam.localPosition.y < 0)
	{
		cam.localPosition.y += Time.deltaTime*camymax;
		if(cam.localPosition.y > 0){cam.localPosition.y = 0;}
	}
	
	//////////////////////////////
	movimento.y = vy;
	if((movimento.x != 0)&&(movimento.z != 0))
	{
		movimento.z *= 0.707;
		movimento.x *= 0.707;
	}
	movimento = transform.TransformDirection(movimento);
	if(legstate != 0)  /*nao está caindo ou pulando*/
	{
		if(legstate != 11) 
		{movimento.y = 0;}
		if(Physics.Raycast(transform.position,Vector3.down,hit,1.35,lmask))
		{
			if(1.16-hit.distance < 0)
			{movimento.y = 1.16-hit.distance;}
		}
	}
	
	if(isgrounded)if(legstate != 1)if(legstate != 0)
	{
		tmpvec2.x = movimento.x;
		tmpvec2.y = movimento.z;
		
		tmpfloat = Vector2.Dot(Vector2(step_normal.x,step_normal.z).normalized,tmpvec2.normalized);
		if(tmpfloat < 0){tmpfloat = 0;}
		if(1-step_normal.y < 0.5)
		{
			movimento.y -= ( 1-step_normal.y )*tmpvec2.magnitude*10*tmpfloat;
		}
	}
	
	rigidbody.velocity = movimento;
	
	if(senddata)
	{
		dataconter += 1000*sendrate*Time.deltaTime;
		if(dataconter > 1000)
		{
			tmpint = transform.eulerAngles.y;
			tmpint2 = headang;
			networkView.RPC("setposstuff",RPCMode.Others,tmpint,tmpint2,transform.position,exposi,exposiback,bending);
			dataconter = 0;
		}
	}
	//if(Input.GetKey(KeyCode.H)){GetComponent(sc_life).quantia -= 100*Time.deltaTime;}
	if(GetComponent(sc_life).quantia <= 0)
	{
		GetComponent(sc_life).quantia = 0;
		tmpbool = true;
		if(gamecontrol.GetComponent(sc_gamecontrol).gamestate == 3)if(!gamecontrol.GetComponent(sc_gamecontrol).matchcontroller.GetComponent(sc_matchcontroller).gamestarted)
		{
			tmpbool = false;
		}
		if(tmpbool)
		{
			cam.GetComponent(sc_camcript).to_fov = def_fov;
			if(revivetarget != null)
			{revivetarget.gameObject.networkView.RPC("setreviving",RPCMode.Others,false);}
			
			insted = Network.Instantiate(deadbody,transform.position,transform.rotation,0);
			
			insted.GetComponent(sc_deadplayer).beardnum = beardnum;
			insted.GetComponent(sc_deadplayer).beardcolor = beardcolor;
			insted.GetComponent(sc_deadplayer).shirtcolor = shirtcolor;
			insted.GetComponent(sc_deadplayer).myskin = myskin;
			insted.GetComponent(sc_deadplayer).dead_sync_aparence(-1,myskin,beardcolor,shirtcolor);
			if(Network.isClient){myspawner.networkView.RPC("sendchat",RPCMode.Server,playername+" is dying!",2);}
			else{myspawner.GetComponent(sc_spawner).sendchat(playername+" is dying!",2);}
				
			cont = 0;
			while(cont < 10)
			{
				insted.GetComponent(sc_deadplayer).invent[cont] = item[cont];
				insted.GetComponent(sc_deadplayer).quant[cont] = quant[cont];
				insted.GetComponent(sc_deadplayer).ammo[cont] = ammo[cont];
				cont++;
			}
			
			insted.gameObject.networkView.RPC("senddeadname",RPCMode.Others,playername);
			
			insted.GetComponent(sc_onlinedeadplayer).enabled = false;
			myspawner.GetComponent(sc_spawner).playerobj = insted;	
			insted.GetComponent(sc_deadplayer).myspawner = myspawner;
			insted.GetComponent(sc_deadplayer).lifes = lifes-1;
			if(lifes <= 0)
			{
				insted.GetComponent(sc_deadplayer).state = 1;
				insted.GetComponent(sc_deadplayer).died = true;
				insted.networkView.RPC("setdied",RPCMode.AllBuffered);
				cont = 0;
				while(cont < 10)
				{
					tmpvec3 = transform.position;
					tmpvec3.x += Random.Range(-1f,1f);
					tmpvec3.z += Random.Range(-1f,1f);
					tmpvec3.y += Random.Range(-0.5,0.5);
					if(Network.isClient)
					{myspawner.networkView.RPC("dropitem",RPCMode.Server,item[cont],tmpvec3,transform.rotation,quant[cont],ammo[cont]);}
					else{myspawner.GetComponent(sc_spawner).dropitem(item[cont],tmpvec3,transform.rotation,quant[cont],ammo[cont]);}
					cont++;
				}
			}
			insted.GetComponent(sc_deadplayer).gamecontrol = gamecontrol;
			insted.GetComponent(sc_deadplayer).cam = cam;
			insted.GetComponent(sc_deadplayer).playername = playername;
			
			insted.GetComponent(sc_deadplayer).mouse_sense = mouse_sense;
			insted.GetComponent(sc_deadplayer).myid = myid;
			insted.GetComponent(sc_deadplayer).autoreload = autoreload;
			
			Destroy(insted.GetComponent(sc_deadplayer).headmesh.gameObject);
			//insted.GetComponent(sc_deadplayer).luzi.light.enabled = true;
			cam.parent = insted.GetComponent(sc_deadplayer).head;
			cam.localPosition = Vector3.zero;
			cam.localEulerAngles = Vector3.zero;
			
			myspawner.GetComponent(sc_spawner).canspawn = false;
			//Network.Destroy(networkView.viewID);
			networkView.RPC("killmebuffered",RPCMode.AllBuffered);
		}
	}
	if(barulho > lastbarulho)
	{
		fakebarulho = barulho;
		zbs = GameObject.FindGameObjectsWithTag("zumbi");
		cont = 0;
		while(cont < zbs.Length)
		{
			if(Vector3.Distance(zbs[cont].transform.position,transform.position) < (barulho/4))
			{
				if(Network.isServer)
				{zbs[cont].GetComponent(sc_zumbi).hearnoise(myid);}
				else{zbs[cont].networkView.RPC("hearnoise",RPCMode.Server,myid);}
			}
			cont++;
		}
	}
	else
	{
		fakebarulho = Mathf.Lerp(fakebarulho,barulho,4*Time.deltaTime);
		soundwarningcont += 1*Time.deltaTime;
		if(soundwarningcont > 1)
		{
			zbs = GameObject.FindGameObjectsWithTag("zumbi");
			cont = 0;
			while(cont < zbs.Length)
			{
				if(Vector3.Distance(zbs[cont].transform.position,transform.position) < (barulho/4))
				{
					if(Network.isServer)
					{zbs[cont].GetComponent(sc_zumbi).hearnoise(myid);}
					else{zbs[cont].networkView.RPC("hearnoise",RPCMode.Server,myid);}
				}
				cont++;
			}
			soundwarningcont = 0;
		}
	}
	//////////Se ta de noite a exposi e menor
	exposi *= 0.5+(timecontroler.timecoef/2);
	exposiback *= 0.5+(timecontroler.timecoef/2);
	
	//////////Se ta com item de luz na cintura, aumenta a exposi
	if(cintoitem != null)
	{
		if(cintoitem.GetComponent(sc_throwable).islight)
		{
			exposi = 1;
			exposiback = 1;
		}
	}
	
	///////////////////////////////blablablablablabla
	lastbarulho = barulho;
	fake_exposi = Mathf.Lerp(fake_exposi,exposi,4*Time.deltaTime);
	/////////////
	
	currentlife = Mathf.Lerp(currentlife,GetComponent(sc_life).quantia,10*Time.deltaTime);
	
	if((currentlife > GetComponent(sc_life).quantia-0.5)&&(currentlife < GetComponent(sc_life).quantia+0.5))
	{
		currentlife = GetComponent(sc_life).quantia;
	}
	
	if(bleeding <= 0)
	{
		//if(food > 50)
		//{}
		GetComponent(sc_life).quantia += 0.4*Time.deltaTime;
		if(GetComponent(sc_life).quantia > sec_life){GetComponent(sc_life).quantia = sec_life;}
	}
	/*if(food < 20)
	{
		GetComponent(sc_life).quantia -= 0.7*Time.deltaTime;
	}*/
	//food -= (1f/12f)*Time.deltaTime;
	//water -= (1f/8f)*Time.deltaTime;
	
}

function OnGUI()
{
	var tmpint:int = 0;
	var tmpint2:int = 0;
	var cont:int = 0;
	var tmpfloat:float = 0;
	
	if(showhud)
	{
		if(item[itemselected] >= 0)
		{	
			if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 0)
			{
				if(showscope)
				{GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height),handitem.GetComponent(sc_gunscript).scope,ScaleMode.ScaleAndCrop, true, 0);}
			}
		}
		if(bleeding > 0)
		{
			GUI.color = Color.red;
			
			tmpfloat = Mathf.Cos(red_a*Mathf.PI)*0.2;
			
			if(tmpfloat < 0){GUI.color.a = -tmpfloat;}
			else{GUI.color.a = tmpfloat;}
			
			GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height),whitecube,ScaleMode.StretchToFill, true, 0);
		}
		GUI.color = Color.white;
		
		cont = 0;
		while(cont < bloods)
		{
			GUI.color.a = bloodalpha[cont];
			GUI.DrawTexture(Rect(bloodpos[cont].x-(bloodspill[bloodtype[cont]].width*4),bloodpos[cont].y-(bloodspill[bloodtype[cont]].height*4),bloodspill[bloodtype[cont]].width*8,bloodspill[bloodtype[cont]].height*8),bloodspill[bloodtype[cont]],ScaleMode.StretchToFill, true, 0);
			cont++;
		}
		cont = 0;
		while(cont < bloods)
		{
			bloodalpha[cont] -= 0.1*Time.deltaTime;
			if(bloodalpha[cont] <= 0)
			{
				bloodalpha[cont] = 0;
				bloodalpha[cont] = bloodalpha[bloods-1];
				bloodpos[cont] = bloodpos[bloods-1];
				bloodtype[cont] = bloodtype[bloods-1];
				bloods--;
			}
			cont++;
		}
		if(armstate == 15)
		{
			GUI.skin = guiskin_WB;
			GUI.color.a = 0.4;
			GUI.Box(Rect((Screen.width/2)-(throw_charge*90/2),Screen.height-45,(throw_charge*90),9),"");
		}
		//////////////////////////////////////////
		GUI.color.a = 1;
		if(real_crouching)
		{GUI.DrawTexture(Rect(5,Screen.height-42-crouch_stand_icons[1].height,crouch_stand_icons[1].width,crouch_stand_icons[1].height),crouch_stand_icons[1],ScaleMode.StretchToFill, true, 0);}
		else
		{GUI.DrawTexture(Rect(5,Screen.height-42-crouch_stand_icons[0].height,crouch_stand_icons[0].width,crouch_stand_icons[0].height),crouch_stand_icons[0],ScaleMode.StretchToFill, true, 0);}
		
		GUI.DrawTexture(Rect(55,Screen.height-65-detection_icons[0].height,detection_icons[0].width,detection_icons[0].height),detection_icons[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(55,Screen.height-45-detection_icons[1].height,detection_icons[1].width,detection_icons[1].height),detection_icons[1],ScaleMode.StretchToFill, true, 0);
		
		GUI.skin = whitebarskin;
		tmpfloat = fakebarulho/120;
		if(tmpfloat > 1){tmpfloat=1;}
		GUI.Box(Rect(85,Screen.height-79,10+(75*tmpfloat),10),"");
		GUI.Box(Rect(85,Screen.height-56,10+(75*((fake_exposi+exposiback)/2)),10),"");
				
		/*GUI.skin = guiskinammoL;
		GUI.Box(Rect(5,Screen.height-55,100,10),"");
		GUI.Box(Rect(110,Screen.height-55,100,10),"");
		
		GUI.skin = whitebarskin;
		GUI.color = Color(1,0.5,0,1);
		GUI.Box(Rect(5,Screen.height-56,10+(food*0.9),12),"");
		GUI.color = Color.cyan;
		GUI.Box(Rect(110,Screen.height-56,10+(water*0.9),12),"");
		*/
		tmpint2 = sprintbar;
		
		GUI.skin = guiskinammoL;
		GUI.color.a = 0.6;
		GUI.Box(Rect(5,Screen.height-30,10+200,20),"");
		GUI.color.a = 1;
		GUI.skin = guiskin;
		
		tmpint = sec_life;
		GUI.color = Color.gray;
		GUI.Box(Rect(5,Screen.height-30,10+(tmpint*2),20),"");
		
		tmpint = currentlife;
		GUI.color = Color.white;
		GUI.Label(Rect(15+(tmpint*2),Screen.height-35,400,25),""+tmpint+"%");
		GUI.Box(Rect(5,Screen.height-30,10+(tmpint*2),20),"");
		
		
		
		GUI.skin = guiskin2;
		if(tmpint2 < mintosrpint){GUI.color.a = 0.2;}
		GUI.Box(Rect(5,Screen.height-40,10+(tmpint2*2),10),"");
		GUI.color.a = 1;
		
		//GUI.Box(Rect(5,Screen.height-50,10+(fakebarulho*0.5),10),"");
		
		//GUI.Box(Rect(5,Screen.height-60,10+(fake_exposi*80),10),"");
		if(item[itemselected] >= 0)
		{
			GUI.skin = guiskinammoR;
			GUI.Label(Rect(Screen.width-210,Screen.height-30,200,30),gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].nome);
				
			if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 0)
			{
				GUI.skin = guiskinammoR;
				GUI.Label(Rect(Screen.width-105,Screen.height-60,50,30),""+quant[itemselected]);
				GUI.skin = guiskinammoL;
				GUI.Label(Rect(Screen.width-50,Screen.height-60,100,30),"/ "+ammo[itemselected]);
				GUI.skin = guiskin;
			}
			if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 3)
			{
				GUI.skin = guiskinammoL;
				GUI.Label(Rect(Screen.width-50,Screen.height-60,100,30),"x"+ammo[itemselected]);
				GUI.skin = guiskin;
			}
			if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 4)
			{
				GUI.skin = guiskinammoL;
				GUI.Label(Rect(Screen.width-50,Screen.height-60,100,30),"x"+ammo[itemselected]);
				GUI.skin = guiskin;
			}
			if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 5)
			{
				GUI.skin = guiskinammoL;
				GUI.Label(Rect(Screen.width-50,Screen.height-60,100,30),"x"+ammo[itemselected]);
				GUI.skin = guiskin;
			}
		}
		
		
		var lmask:LayerMask;
		var tmpbool:boolean = false;
		var hit:RaycastHit;
		var crosspos:Vector2;
		
		crosspos = Vector2((Screen.width/2),(Screen.height/2));
		if((item[itemselected] >= 0) && (armstate == 0))
		{	
			if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 0)if(handitem != null)
			{
				lmask = (1 << 8)|(1 << 11)| (1 << 21);
				tmpbool = Physics.Raycast(handitem.GetComponent(sc_gunscript).output.position,handitem.GetComponent(sc_gunscript).output.right,hit,80,lmask);
				
				if(tmpbool)
				{
					crosspos.x = cam.camera.WorldToScreenPoint(hit.point).x;
					crosspos.y = cam.camera.WorldToScreenPoint(hit.point).y;
					crosspos.y = Screen.height-crosspos.y;
				}
			}
		}
		
		//Mira
		if(myspawner.GetComponent(sc_spawner).state == 1)           
		{
			if((armstate == 0)||(armstate == 12)||(armstate == 6))
			{
				if(interacttype < 0)
				{
					if(!zooming)
					{
						if(item[itemselected] >= 0)
						{
							if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[itemselected] ].tipo == 0)
							{
								if(handitem.GetComponent(sc_gunscript).crosshair)
								{
									GUI.color = Color.white;
									GUI.color.a = 0.4;
									GUI.DrawTexture(Rect((Screen.width/2)-8,(Screen.height/2)-8,16,16),pointcrosshair,ScaleMode.StretchToFill, true, 0);
									GUI.color.a = 1;
									GUI.DrawTexture(Rect(crosspos.x-16,crosspos.y-16,32,32),crosshair,ScaleMode.StretchToFill, true, 0);
									GUI.color = Color.red;
									GUI.color.a = hitM_conter;
									GUI.DrawTexture(Rect(crosspos.x-16,crosspos.y-16,32,32),hitmarker,ScaleMode.StretchToFill, true, 0);
								}
							}
							else
							{
								GUI.color = Color.white;
								GUI.color.a = 0.4;
								GUI.DrawTexture(Rect((Screen.width/2)-8,(Screen.height/2)-8,16,16),pointcrosshair,ScaleMode.StretchToFill, true, 0);
								GUI.color.a = 1;
								GUI.DrawTexture(Rect(crosspos.x-16,crosspos.y-16,32,32),crosshair,ScaleMode.StretchToFill, true, 0);
								GUI.color = Color.red;
								GUI.color.a = hitM_conter;
								GUI.DrawTexture(Rect(crosspos.x-16,crosspos.y-16,32,32),hitmarker,ScaleMode.StretchToFill, true, 0);
							}
						}
					}
				}
				else
				{
					GUI.DrawTexture(Rect((Screen.width/2)-16,(Screen.height/2)-16,32,32),interactsign[interacttype],ScaleMode.StretchToFill, true, 0);
				}
			}
			if(armstate == 10)
			{
				GUI.skin = guiskinammoL;
				tmpint = 500;
				GUI.Box(Rect((Screen.width/2)-250,(Screen.height/2)-10,tmpint+10,20),"");
				GUI.skin = guiskinammoR;
				tmpint = rpcbar;
				GUI.Box(Rect((Screen.width/2)-250,(Screen.height/2)-10,tmpint+10,20),"");
				
				GUI.skin = guiskin2;
				GUI.Label(Rect((Screen.width/2)-300,(Screen.height/2)-50,600,50),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[51]+revivetarget.GetComponent(sc_deadplayer).playername);
			}
			GUI.skin = guiskin2;
			GUI.color = message_col;
			GUI.color.a = message_a;
			GUI.Label(Rect((Screen.width/2)-300,(Screen.height/2)-25,600,50),the_message);
			message_a -= 0.5*Time.deltaTime;
			if(message_a < 0){message_a = 0;}
			GUI.color = Color.white;
		}	
		
		if(gamecontrol.GetComponent(sc_gamecontrol).gamestate == 3)
		{
			if(!gamecontrol.GetComponent(sc_gamecontrol).matchcontroller.GetComponent(sc_matchcontroller).gamestarted)
			{
				if(myspawner.GetComponent(sc_spawner).state == 1)
				{
					if(!Input.GetKey(KeyCode.Tab) && controled)
					{
						GUI.skin = guiskin2;
						GUI.Label(Rect((Screen.width/2)-300,(Screen.height/2)-125,600,100),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[35]);
						if(Input.GetKeyDown(KeyCode.Return))
						{
							gamecontrol.GetComponent(sc_gamecontrol).matchcontroller.GetComponent(sc_matchcontroller).gamestarted = true;
						}
					}
				}
			}
		}
		if(gamecontrol.GetComponent(sc_gamecontrol).gamestate == 6)      
		{
			if(GameObject.Find("matchdata(Clone)") != null)
			{
				if(!GameObject.Find("matchdata(Clone)").GetComponent(sc_matchdata).isstarted)
				{
					if(myspawner.GetComponent(sc_spawner).state == 1)
					{
						GUI.skin = guiskin2;
						GUI.Label(Rect((Screen.width/2)-300,(Screen.height/2)-125,600,100),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[34]);
					}
				}
			}
		}
		
		cont = 0;                              ///items no menu
		while(cont < item.Length)
		{
			if(cont == itemtoselect){GUI.color.a = 0.3;}
			else {GUI.color.a = 0.1;}
			GUI.DrawTexture(Rect(Screen.width-100,(Screen.height/2)-175+(35*cont),96,33),gamecontrol.GetComponent(sc_gamecontrol).backsprite,ScaleMode.StretchToFill, true, 0);
			if(item[cont] >= 0)
			{
				if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[cont] ].sprite != null)
				{
					if(cont == itemselected){GUI.color.a = 1;}
					else{GUI.color.a = 0.6;}
					GUI.DrawTexture(Rect(Screen.width-100,(Screen.height/2)-175+(35*cont),96,33),gamecontrol.GetComponent(sc_gamecontrol).itemlist[ item[cont] ].sprite,ScaleMode.StretchToFill, true, 0);
				}
			}
			cont++;
		}
	}
	else
	{
		if(gamecontrol.GetComponent(sc_gamecontrol).gamestate == 3)
		{
			if(!gamecontrol.GetComponent(sc_gamecontrol).matchcontroller.GetComponent(sc_matchcontroller).gamestarted)
			{
				if(myspawner.GetComponent(sc_spawner).state == 1)
				{
					if(!Input.GetKey(KeyCode.Tab) && controled)
					{
						GUI.skin = guiskin2;
						GUI.Label(Rect((Screen.width/2)-300,(Screen.height/2)-125,600,100),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[35]);
						if(Input.GetKeyDown(KeyCode.Return))
						{
							gamecontrol.GetComponent(sc_gamecontrol).matchcontroller.GetComponent(sc_matchcontroller).gamestarted = true;
						}
					}
				}
			}
		}
	}
}
function add_hitmarker()
{
	hitM_conter = 2;
}
function OnDestroy () 
{
	if(placer != null){Destroy(placer.gameObject);}
}


@RPC function activelight()
{
	flashconter =  100;
	flash.light.enabled = true;
}
@RPC function spillblood()
{
	var num:int = 0;
	
	if(bloods < bloodalpha.Length)
	{
		num = bloods;
		bloodalpha[num] = 0.4;
		bloodpos[num].x = Random.Range(0,Screen.width);
		bloodpos[num].y = Random.Range(0,Screen.height);
		bloodtype[num] = Random.Range(0,bloodspill.Length);
		bloods++;
	}
	else
	{
		num = 0;
		bloodalpha[num] = 0.4;
		bloodpos[num].x = Random.Range(0,Screen.width);
		bloodpos[num].y = Random.Range(0,Screen.height);
		bloodtype[num] = Random.Range(0,bloodspill.Length);
	}
}

@RPC
function changecintoitem(itemid:int)
{
	gamecontrol = GameObject.Find("gamecontroler").transform;
	if(gamecontrol != null)
	{
		if(cintoitem != null){Destroy(cintoitem.gameObject);}
		if(itemid >= 0)
		{
			cintoitem = Instantiate(gamecontrol.GetComponent(sc_gamecontrol).itemlist[itemid].prefab);
			cintoitem.parent = cintopos;
			cintoitem.localPosition = Vector3.zero;
			cintoitem.localEulerAngles = Vector3.zero;
		}
	}
}

@RPC
function changeitem(itemid:int)
{
	gamecontrol = GameObject.Find("gamecontroler").transform;
	if(gamecontrol != null)
	{
		if(handitem != null){Destroy(handitem.gameObject);}
		if(itemid >= 0)
		{
			handitem = Instantiate(gamecontrol.GetComponent(sc_gamecontrol).itemlist[itemid].prefab);
			handitem.parent = handpos;
			handitem.localPosition = Vector3.zero;
			handitem.localEulerAngles = Vector3.zero;
		}
	}
}
@RPC
function setmyname(RPCplayername:String)
{
	playername = RPCplayername;
}

@RPC
function playitemsound()
{
	if(handitem.audio != null)
	{
		handitem.audio.Play();
	}
}

@RPC
function playarmanim(anim_name:String,animspeed:float)
{
	chest.GetComponent(Animation).animation.Rewind(anim_name);
	chest.GetComponent(Animation).animation[anim_name].speed = animspeed;
	chest.GetComponent(Animation).animation.Play(anim_name);
}

@RPC
function fadearmanim(anim_name:String,time:float,animspeed:float)
{
	chest.GetComponent(Animation).animation[anim_name].speed = animspeed;
	chest.GetComponent(Animation).animation.CrossFade(anim_name,time);
}

@RPC
function playleganim(anim_name:String,animspeed:float)
{
	legs.GetComponent(Animation).animation.Rewind(anim_name);
	legs.GetComponent(Animation).animation[anim_name].speed = animspeed;
	legs.GetComponent(Animation).animation.Play(anim_name);
}

@RPC
function fadeleganim(anim_name:String,time:float,animspeed:float)
{
	legs.GetComponent(Animation).animation[anim_name].speed = animspeed;
	legs.GetComponent(Animation).animation.CrossFade(anim_name,time);
}

@RPC
function setid(id:int)
{
	myid = id;
}

@RPC
function receiveammo(RPCid:int,RPCammo:int)
{
	if(networkView.isMine)
	{
		message_col = Color.white;
		the_message = gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[53]+gamecontrol.GetComponent(sc_gamecontrol).itemlist[ RPCid ].nome;
		message_a = 1;
		if(item[itemselected] == RPCid)
		{
			ammo[itemselected] += RPCammo;
		}
		else
		{
			var tmpint:int = -1;
			var cont:int = 0;
			while(cont < item.Length)
			{
				if(item[cont] == RPCid){tmpint = cont;cont = item.Length;}
				cont++;
			}
			if(tmpint >= 0)
			{
				ammo[tmpint] += RPCammo;
			}
		}
	}
}
@RPC
function receiveitem(RPCid:int,RPCquant:int,RPCammo:int)
{
	if(networkView.isMine)
	{
		var tmpint:int = -1;
		var cont:int = 0;
		while(cont < item.Length)
		{
			if(item[cont] == -1){tmpint = cont;cont = item.Length;}
			cont++;
		}
		
		if(tmpint >= 0)
		{
			item[tmpint] = RPCid;
			quant[tmpint] = RPCquant;
			ammo[tmpint] = RPCammo;
			message_col = Color.white;
			the_message = gamecontrol.GetComponent(sc_gamecontrol).itemlist[ RPCid ].nome;
			message_a = 1;
			if(tmpint == itemselected)
			{
				generatehanditem();
			}
		}
	}
}