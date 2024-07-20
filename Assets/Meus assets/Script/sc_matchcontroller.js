#pragma strict
var secstoincrease:int = 30;
var rateincrease:float = 0.5; 

var wave:int = 0;

var ismax = 15;
var itemspawnpoints:GameObject[];
var itemspawnrate:float = 0.05;
var itemspawncont:float = 0;

var zspawnrate:float = 0.2;
var zspawncont:float = 0;
var zsinscene:GameObject[];
var playersinscene:GameObject[];
var bodiesinscene:GameObject[];
var isinscene:GameObject[];

var ZperWave:int = 4;
var zsmax:int = 50;
var zminforwave:int = 15;
var zspawnpoints:GameObject[];
var zumbifab:Transform;
var terra:Transform;

var bagspawnpoints:GameObject[];
var everybodyspawners:GameObject[];
var spawners = 0;

var gamecontrol:Transform;
var minute:int = 0;
var second:int = 0;
var timecont:float = 0;
var increasesecs:int = 0;

var gamestarted:boolean = false;
var matchdata:Transform;
var myspawner:Transform;

var gameended:boolean = false;

var endgameconter:float = 0;
var secstoendgame:int = 3;

var grounditens:Transform[];
var separator_of_metal:boolean;
var supllyprefab:Transform;
var ammoboxprefab:Transform;
var itemsrand:Transform[];
var itensprob:int[];
var probmax:int = 0;
var probmin:int = 0;

var backpackprobmax:int = 0;
var backpackprobmin:int = 0;

var matinfoconter:float = 0;
var matinfosendconter:float = 0;

var endconter:float = 0;

var bannedip:String[];
var bannedips:int = 0;

var randomcont:int = 0;

var contructions:Transform[];

var sorttimer:float = 0;

var fpslist:int[];
var fpsnow:int = 0;

var cubinho:Texture;
var cubinho_b:Texture;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function generate_bulding(bid:int,ownerid:int,pos:Vector3,rot:Quaternion)
{
	var insted:Transform = Network.Instantiate(contructions[bid],pos,rot,10);
	insted.GetComponent(sc_haveowner).id = ownerid;
}
function OnPlayerConnected(pl:NetworkPlayer)
{
	var cont:int = 0;
	while(cont < bannedips)
	{
		if(pl.ipAddress == bannedip[cont])
		{
			Network.CloseConnection(pl,true);
			break;
		}
		cont++;
	}
}
function disban_player_ip(n:int)
{
	if(n < bannedips)
	{
		everybodyspawners[0].GetComponent(sc_spawner).receivechat("Ubanned: "+bannedip[n],5);
		bannedip[n] = bannedip[bannedips-1];
		bannedips--;
		
	}
	else
	{
		spreadchat("Invalid IP Id!",2);
	}
}
function ban_player_ip(p:int)
{
	if(p < spawners)
	{
		if(everybodyspawners[p].networkView.owner != Network.player)
		{
			if(bannedips < bannedip.Length)
			{
				spreadchat("Admin banned "+everybodyspawners[p].GetComponent(sc_spawner).playername,2);
				bannedip[bannedips] = everybodyspawners[p].networkView.owner.ipAddress;
				Network.CloseConnection(everybodyspawners[p].networkView.owner,true);
				bannedips++;
			}
			else{everybodyspawners[0].GetComponent(sc_spawner).receivechat("Blacklist is full!",2);}
		}
		else
		{
			everybodyspawners[0].GetComponent(sc_spawner).receivechat("Cant ban yourself!",2);
		}
	}
}
function kick_player(p:int)
{
	if(p < spawners)
	{
		if(everybodyspawners[p].networkView.owner != Network.player)
		{
			spreadchat("Admin kicked "+everybodyspawners[p].GetComponent(sc_spawner).playername,2);
			Network.CloseConnection(everybodyspawners[p].networkView.owner,true);
		}
		else
		{
			everybodyspawners[0].GetComponent(sc_spawner).receivechat("Cant kick yourself!",2);
		}
	}
}
function server_say(mes:String)
{
	var cont:int = 0;
	while(cont < spawners)
	{
		everybodyspawners[cont].networkView.RPC("servermessage",RPCMode.All,mes);
		cont++;
	}
}
function spreadchat(mes:String,cor:int)
{
	var cont:int = 0;
	while(cont < spawners)
	{
		if(everybodyspawners[cont] != null)
		{everybodyspawners[cont].networkView.RPC("receivechat",RPCMode.All,mes,cor);}
		cont++;
	}
}
function spawnsuplly()
{
	if(networkView.isMine)
	{
		var insted:Transform;
		var tmpint:int = Random.Range(0,bagspawnpoints.Length);
		
		var vectmp2:Vector2;
		
		vectmp2.x = bagspawnpoints[tmpint].transform.position.x;
		vectmp2.y = bagspawnpoints[tmpint].transform.position.z;
		
		insted = Network.Instantiate(supllyprefab,Vector3(vectmp2.x,bagspawnpoints[tmpint].transform.position.y,vectmp2.y),bagspawnpoints[tmpint].transform.rotation,5);
		insted.position.y += insted.GetComponent(sc_suplly).height;
		insted.GetComponent(sc_sendpositionupdate).enabled = true;
		insted.GetComponent(sc_updateposition).enabled = false;
	}
}

function spawnitem(id:int,pos:Vector3,rot:Quaternion,quant:int,ammo:int,decay:boolean)
{
	var insted:Transform;
	if(id >= 0)
	{
		insted = Network.Instantiate(grounditens[id],pos,rot,6);
		
		insted.GetComponent(sc_updateposition).enabled = false;
		insted.GetComponent(sc_sendpositionupdate).enabled = true;
		
		insted.GetComponent(sc_canbetaken).decaytime = 30000;
		
		insted.GetComponent(sc_canbetaken).quant = quant;
		insted.GetComponent(sc_canbetaken).ammo = ammo;
		insted.GetComponent(sc_canbetaken).decay = decay;
	}
}
function updatepermission(Fspawner:GameObject):void
{
	var cont:int =0;
	var found:boolean = false;
	while(cont < spawners)
	{
		if(everybodyspawners[cont].gameObject == Fspawner)
		{
			Fspawner.networkView.RPC("setpermission",RPCMode.AllBuffered,true,cont);
			found = true;
			cont = spawners;
		}
		cont++;
	}
	if(!found){addspawner(Fspawner);}
}
function addspawner(Fspawner:GameObject):void
{
	var cont:int = 0;
	
	if(spawners < everybodyspawners.Length)
	{
		everybodyspawners[spawners] = Fspawner;
		everybodyspawners[spawners].networkView.RPC("setpermission",RPCMode.AllBuffered,true,spawners);
		spawners++;
		spreadchat(everybodyspawners[spawners-1].GetComponent(sc_spawner).playername+" connected.",3);
		
		cont = 0;
		while(cont < spawners)
		{
			matchdata.GetComponent(sc_matchdata).playernames[cont] = everybodyspawners[cont].GetComponent(sc_spawner).playername;
			matchdata.GetComponent(sc_matchdata).playerkills[cont] = everybodyspawners[cont].GetComponent(sc_spawner).kills;
			matchdata.GetComponent(sc_matchdata).playermoneys[cont] = everybodyspawners[cont].GetComponent(sc_spawner).money;
			matchdata.GetComponent(sc_matchdata).playersingame = spawners;
			cont++;
		}
		cont = 0;
		while(cont < spawners)
		{
			matchdata.networkView.RPC("syncnames",RPCMode.Others,matchdata.GetComponent(sc_matchdata).playernames[cont],cont);
			cont++;
		}
		matchdata.networkView.RPC("syncinfo",RPCMode.Others,matchdata.GetComponent(sc_matchdata).playerkills,matchdata.GetComponent(sc_matchdata).playermoneys,matchdata.GetComponent(sc_matchdata).playerpings,matchdata.GetComponent(sc_matchdata).playersingame);
	}
}
function removespawner(Fspawner:int)
{
	var cont:int = 0;
	
	everybodyspawners[Fspawner] = everybodyspawners[spawners-1];
	if(everybodyspawners[Fspawner] != null)
	{everybodyspawners[Fspawner].networkView.RPC("setpermission",RPCMode.All,true,Fspawner);}
	spawners--;
	
	cont = 0;
	while(cont < spawners)
	{
		matchdata.GetComponent(sc_matchdata).playernames[cont] = everybodyspawners[cont].GetComponent(sc_spawner).playername;
		matchdata.GetComponent(sc_matchdata).playerkills[cont] = everybodyspawners[cont].GetComponent(sc_spawner).kills;
		matchdata.GetComponent(sc_matchdata).playermoneys[cont] = everybodyspawners[cont].GetComponent(sc_spawner).money;
		matchdata.GetComponent(sc_matchdata).playersingame = spawners;
		cont++;
	}
	cont = 0;
	while(cont < spawners)
	{
		matchdata.networkView.RPC("syncnames",RPCMode.Others,matchdata.GetComponent(sc_matchdata).playernames[cont],cont);
		cont++;
	}
	matchdata.networkView.RPC("syncinfo",RPCMode.Others,matchdata.GetComponent(sc_matchdata).playerkills,matchdata.GetComponent(sc_matchdata).playermoneys,matchdata.GetComponent(sc_matchdata).playerpings,matchdata.GetComponent(sc_matchdata).playersingame);
}
function sort_spawners()
{
	var cont:int = 0;
	while(cont < everybodyspawners.Length)
	{
		if( everybodyspawners[cont] == null )
		{
			var cont2:int = everybodyspawners.Length-1;
			while(cont2 > cont)
			{
				if( everybodyspawners[cont2] != null )
				{
					everybodyspawners[cont] = everybodyspawners[cont2];
					everybodyspawners[cont2] = null;
					
					everybodyspawners[cont].networkView.RPC("setpermission",RPCMode.All,true,cont);
										
					break;
				}
				cont2--;
			}
			if(cont2 == cont)
			{
				spawners = cont;
				break;
			}
		}
		cont++;
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Start () {
	zspawnpoints = GameObject.FindGameObjectsWithTag("zombiespawn");
	itemspawnpoints = GameObject.FindGameObjectsWithTag("itemspawn");
	bagspawnpoints = GameObject.FindGameObjectsWithTag("zombiespawn");
	
	var cont:int = 0;
	while(cont < fpslist.Length)
	{
		fpslist[cont] = 1;
		cont++;
	}
	
}

function Update () {

	var cont:int = 0;
	
	if(fpsnow < fpslist.Length-1)
	{
		fpslist[fpsnow] = 1/Time.deltaTime;
		fpsnow++;
	}
	else{
		cont = 0;
		while(cont < fpslist.Length-1)
		{
			fpslist[cont] = fpslist[cont+1];
			cont++;
		}
		fpslist[cont] = 1/Time.deltaTime;
	}
	
	var tmpint:int = 0;
	var tmpint2:int = 0;
	var tmpint3:int = 0;
	var tmpfloatx:float = 0;
	var tmpfloatz:float = 0;
	
	var insted:Transform;
	var tmpbool:boolean;
	
	sorttimer += Time.deltaTime;
	if(sorttimer > 0.5)
	{
		sort_spawners();
		sorttimer = 0;
	}
	
	matinfoconter += 100*0.5*Time.deltaTime;
	
	if(matinfoconter > 100)
	{
		cont = 0;
		while(cont < spawners)
		{
			matchdata.GetComponent(sc_matchdata).playerpings[cont] = Network.GetAveragePing(everybodyspawners[cont].networkView.owner);
			matchdata.GetComponent(sc_matchdata).playernames[cont] = everybodyspawners[cont].GetComponent(sc_spawner).playername;
			matchdata.GetComponent(sc_matchdata).playerkills[cont] = everybodyspawners[cont].GetComponent(sc_spawner).kills;
			matchdata.GetComponent(sc_matchdata).playermoneys[cont] = everybodyspawners[cont].GetComponent(sc_spawner).money;
			matchdata.GetComponent(sc_matchdata).playersingame = spawners;
			cont++;
		}
		matinfoconter = 0;
	}
	
	matinfosendconter += 100*Time.deltaTime;
	if(matinfosendconter > 75)
	{
		matchdata.networkView.RPC("syncinfo",RPCMode.Others,matchdata.GetComponent(sc_matchdata).playerkills,matchdata.GetComponent(sc_matchdata).playermoneys,matchdata.GetComponent(sc_matchdata).playerpings,matchdata.GetComponent(sc_matchdata).playersingame);
		matinfosendconter = 0;
	}
	
	cont = 0;
	while(cont < spawners)
	{
		if(everybodyspawners[cont] == null)
		{
			removespawner(cont);
			cont--;
		}
		cont++;
	}
	if(gamestarted)
	{
		itemspawncont += 1000*itemspawnrate*Time.deltaTime;
		if(itemspawncont > 1000)
		{
			isinscene = GameObject.FindGameObjectsWithTag("grounditem");
			if(isinscene.Length < ismax)
			{
				tmpint = Random.Range(0,itemspawnpoints.Length);
				
				tmpfloatx = itemspawnpoints[tmpint].transform.position.x+Random.Range(-(itemspawnpoints[tmpint].transform.localScale.x/2),(itemspawnpoints[tmpint].transform.localScale.x/2));
				tmpfloatz = itemspawnpoints[tmpint].transform.position.z+Random.Range(-(itemspawnpoints[tmpint].transform.localScale.z/2),(itemspawnpoints[tmpint].transform.localScale.z/2));
				tmpint2 = Random.Range(0,probmax);
				if( tmpint2 < probmin)
				{
					randomcont = 0;
					cont = 0;
					while(cont < itemsrand.Length)
					{
						randomcont += itensprob[cont];
						cont++;
					}
					tmpint3 = Random.Range(0,randomcont);
					
					randomcont = 0;
					cont = 0;
					while(cont < itemsrand.Length)
					{
						if((tmpint3 >= randomcont) && (tmpint3 < randomcont+itensprob[cont]))
						{tmpint3 = cont; break;}
						randomcont += itensprob[cont];
						cont++;
					}
					
					insted = Network.Instantiate(itemsrand[tmpint3],Vector3(tmpfloatx,itemspawnpoints[tmpint].transform.position.y+1.28,tmpfloatz),itemsrand[tmpint3].rotation,5);
					
					if(insted.GetComponent(sc_updateposition) == null){Debug.Log(insted.name);}
					insted.GetComponent(sc_updateposition).enabled = false;
					insted.GetComponent(sc_sendpositionupdate).enabled = true;
				}
				else
				{
					insted = Network.Instantiate(ammoboxprefab,Vector3(tmpfloatx,itemspawnpoints[tmpint].transform.position.y+1.28,tmpfloatz),ammoboxprefab.rotation,5);
					insted.GetComponent(sc_updateposition).enabled = false;
					insted.GetComponent(sc_sendpositionupdate).enabled = true;
				}
				
				isinscene = GameObject.FindGameObjectsWithTag("grounditem");
				itemspawncont = 0;
				/*
				tmpint2 = Random.Range(0,itemspawnpoints[tmpint].GetComponent(sc_itemspawner).itemsids.Length);
				insted = Network.Instantiate(grounditens[itemspawnpoints[tmpint].GetComponent(sc_itemspawner).itemsids[tmpint2]],Vector3(tmpfloatx,itemspawnpoints[tmpint].transform.position.y+1.28,tmpfloatz),grounditens[itemspawnpoints[tmpint].GetComponent(sc_itemspawner).itemsids[tmpint2]].rotation,5);
				insted.GetComponent(sc_updateposition).enabled = false;
				insted.GetComponent(sc_sendpositionupdate).enabled = true;
				itemspawncont = 0;
				isinscene = GameObject.FindGameObjectsWithTag("grounditem");
				*/
				
			}
		}
		
		////////
		
		//zspawncont += 1000*zspawnrate*Time.deltaTime;
		zsinscene = GameObject.FindGameObjectsWithTag("zumbi");
		
		zspawncont += 1*Time.deltaTime;
		if( zsinscene.Length <= 3 )
		{
			wave++;
			matchdata.networkView.RPC("syncwave",RPCMode.All,wave);
			spreadchat("Wave "+wave+" started!",5);
			
			zspawncont = 0;
			cont = 0;
			while(cont < spawners)
			{
				if(everybodyspawners[cont] != null)
				{everybodyspawners[cont].networkView.RPC("servermessage",RPCMode.All,"Wave "+wave);}
				cont++;
			}
			
			cont = 0;
			while(cont < zminforwave+((wave-1)*ZperWave))
			{
				if(zsinscene.Length < zsmax)
				{
					if(zspawnpoints.Length > 0)
					{
						tmpint = Random.Range(0,zspawnpoints.Length);
					}
					tmpfloatx = zspawnpoints[tmpint].transform.position.x+Random.Range(-(zspawnpoints[tmpint].transform.localScale.x/2),(zspawnpoints[tmpint].transform.localScale.x/2));
					tmpfloatz = zspawnpoints[tmpint].transform.position.z+Random.Range(-(zspawnpoints[tmpint].transform.localScale.z/2),(zspawnpoints[tmpint].transform.localScale.z/2));
					insted = Network.Instantiate(zumbifab,Vector3(tmpfloatx,zspawnpoints[tmpint].transform.position.y+1.28,tmpfloatz),zumbifab.rotation,5);
					insted.rigidbody.isKinematic = false;
					insted.GetComponent(sc_zumbionlinecontroller).enabled = false;
					insted.GetComponent(sc_zumbi).enabled = true;
					insted.GetComponent(sc_zumbi).gamecontrol = gamecontrol;
					insted.GetComponent(sc_zumbi).matchcontrol = transform;
					insted.GetComponent(sc_zumbi).headlife += 4*(wave-1);
					insted.GetComponent(sc_life).quantia += 10*(wave-1);
					insted.GetComponent(sc_zumbi).dmgmin += 0.6*(wave-1);
					insted.GetComponent(sc_zumbi).dmgmax += 0.6*(wave-1);
					insted.GetComponent(sc_zumbi).walkspeed += 0.06*(wave-1);
					if(insted.GetComponent(sc_zumbi).walkspeed > 6){insted.GetComponent(sc_zumbi).walkspeed = 6;}
					tmpint2 = Random.Range(0,backpackprobmax);
					if(tmpint2 < backpackprobmin)
					{
						insted.GetComponent(sc_zumbi).carryitem = true;
					}
					insted.GetComponent(sc_zumbi).nasceterra();
					insted.networkView.RPC("nasceterra",RPCMode.All);
					//Network.Instantiate(terra,Vector3(insted.position.x,insted.position.y-1.75,insted.position.z),insted.rotation,4);
					zspawncont = 0;
					zsinscene = GameObject.FindGameObjectsWithTag("zumbi");
				}
				cont++;
			}
		}
		
		if(!gameended)
		{
			timecont += 1000*Time.deltaTime;
			if(timecont > 1000)
			{
				second++;
				if(second >= 60)
				{
					minute++;
					second-= 60;
				}
				increasesecs++;
				if(increasesecs > secstoincrease)
				{
					zspawnrate+= rateincrease;
					increasesecs = 0;
				}
				timecont -= 1000;
			}
		}
		
		playersinscene = GameObject.FindGameObjectsWithTag("Player");
		if(playersinscene.Length == 0)
		{
			gameended = true;
			/*bodiesinscene = GameObject.FindGameObjectsWithTag("deadbody");
			cont = 0;
			tmpbool = false;
			while(cont < bodiesinscene.Length)
			{
				if(!bodiesinscene[cont].GetComponent(sc_deadplayer).died){tmpbool = true;}
				cont++;
			}
			if(!tmpbool){}*/
		}
	}
	if(gameended)
	{
		endconter += 100*Time.deltaTime;
		if(endconter > 400)
		{
			cont = 0;
			while(cont < spawners)
			{
				if(everybodyspawners[cont] != null)
				{
					if(!everybodyspawners[cont].networkView.isMine)
					{
						everybodyspawners[cont].networkView.RPC("endgame",RPCMode.OthersBuffered,matchdata.GetComponent(sc_matchdata).zombieskilled,matchdata.GetComponent(sc_matchdata).seconds,matchdata.GetComponent(sc_matchdata).minutes);
					}
				}
				cont++;
			}
			endgameconter += 1000*Time.deltaTime;
			if((endgameconter > 1000*secstoendgame) || (spawners <= 1))
			{
				Screen.showCursor = true;
				Screen.lockCursor = false;
				gamecontrol.GetComponent(sc_gamecontrol).lastscore = matchdata.GetComponent(sc_matchdata).zombieskilled;
				gamecontrol.GetComponent(sc_gamecontrol).timesurvivedsecs = matchdata.GetComponent(sc_matchdata).seconds;
				gamecontrol.GetComponent(sc_gamecontrol).timesurvivedmins = matchdata.GetComponent(sc_matchdata).minutes;
				gamecontrol.GetComponent(sc_gamecontrol).cam.parent = null;
				gamecontrol.GetComponent(sc_gamecontrol).cam.localPosition = Vector3.zero;
				gamecontrol.GetComponent(sc_gamecontrol).cam.localEulerAngles = Vector3.zero;
				gamecontrol.GetComponent(sc_gamecontrol).disconecplease = true;
				//Network.Disconnect(200);
				gamecontrol.GetComponent(sc_gamecontrol).gamestate = 12;
				gamecontrol.GetComponent(sc_gamecontrol).money += myspawner.GetComponent(sc_spawner).money;
				gamecontrol.GetComponent(sc_gamecontrol).lastaccmoney = myspawner.GetComponent(sc_spawner).money;
				gamecontrol.GetComponent(sc_gamecontrol).save();
				Application.LoadLevel(2);
			}
		}
	}
	
	matchdata.GetComponent(sc_matchdata).minutes = minute;
	matchdata.GetComponent(sc_matchdata).seconds = second;
	matchdata.GetComponent(sc_matchdata).isstarted = gamestarted;
}


function OnGUI()
{
	var cont:int = 0;
	var tmpfloat:float = 0;
	var tmpint:int = 0;
	
	if(Input.GetKey(KeyCode.F1))
	{	
		GUI.color.a = 0.9;
		GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height), cubinho_b, ScaleMode.StretchToFill, true, 10.0f);
		GUI.color =  Color.white;
		
		tmpfloat = 1/Time.smoothDeltaTime;
		tmpint = tmpfloat;
		GUI.Label(Rect(200,5,400,40),"FPS "+tmpint);
		cont = 0;
		while(cont < fpsnow)
		{
			tmpfloat = fpslist[cont]/60.000;
			GUI.color =  Color.Lerp(Color.red,Color.green, tmpfloat);
			
			GUI.DrawTexture(Rect(200+(cont),25,1,fpslist[cont]), cubinho, ScaleMode.StretchToFill, true, 10.0f);
			GUI.color =  Color.white;
			cont++;
		}
		
		GUI.Label(Rect(10,5,400,40),"BAN. IP.");
		cont = 0;
		while(cont < bannedips)
		{
			GUI.Label(Rect(10,30+(30*cont),400,40),cont+" = "+bannedip[cont]);
			cont++;
		}
		
		GUI.Label(Rect(200,150,400,40),"SERVER INFO");
		
		GUI.Label(Rect(200,170,400,40),"Zombie = "+zsinscene.Length);
		GUI.Label(Rect(200,190,400,40),"Item = "+isinscene.Length);
	}
}
