#pragma strict
var timetospawn:int = 5;
var playerprefab:Transform;

var state = 1;
var scenecontrol:Transform;
var gamecontrol:Transform;
var playerobj:Transform;
var canspawn:boolean = false;
var conter:float = 0;
var guiskin:GUISkin;
var guiskin2:GUISkin;
var guiSlist:GUISkin;
var otherfont:GUISkin;
var chatfont:GUISkin;
var guiInv:GUISkin;
var guiInv2:GUISkin;
var newgui_square:GUISkin;
var newhud:Texture[];
var cubesprite:Texture;
var blackcube:Texture;
var inv3_sign:Texture[];
var justlogged:boolean = true;
var playername:String;
var mousesense:float;
var autoaim:boolean = false;
var autoreload:boolean = false;
var matchcontroller:GameObject;
var matchdata:Transform;
var myid:int = 0;
var spawns:GameObject[];
var inve:int[];
var money:int = 0;
var kills:int = 0;
var spawnei:boolean = false;

var BM_alpha:float = 0;
var BM_message:String;

var chat:String;
var chatbool:boolean = true;
var specplayers:GameObject[];
var spectarget:int = 0;
var specdist:float = 4;
var camfix:Vector3;

var my_beard:int = -1;
var my_beardcolor:int = 0;
var my_shirtcolor:int = 0;
var my_skincolor:int = 0;

var chatcommands:String[];
var send_cmd:int = -1;

var parsefrase:String;
var onmouse:int = -1;

var mouseup:boolean = false;

@RPC function servermessage(mess:String)
{
	BM_message = mess;
	BM_alpha = 4;
}

@RPC function addkill()
{
	kills++;
}

@RPC function addmoney(quant:int)
{
	money+=quant;
}

@RPC 
function receivechat(mes:String,cor:int)
{
	if(networkView.isMine)
	{
		var matchdata:GameObject;
		matchdata = GameObject.Find("matchdata(Clone)");
		if(matchdata != null)
		{
			matchdata.GetComponent(sc_matchdata).addmessage(mes,cor);
		}
	}
}

@RPC 
function dropitem(id:int,pos:Vector3,rot:Quaternion,quant:int,ammo:int)
{
	if(matchcontroller == null){matchcontroller = GameObject.Find("matchcontroller(Clone)");}
	if(matchcontroller != null)
	{
		matchcontroller.GetComponent(sc_matchcontroller).spawnitem(id,pos,rot,quant,ammo,true);
	}
}

@RPC
function sendchat(mes:String,cor:int)
{
	if(matchcontroller == null){matchcontroller = GameObject.Find("matchcontroller(Clone)");}
	if(matchcontroller != null)
	{
		matchcontroller.GetComponent(sc_matchcontroller).spreadchat(mes,cor);
	}
}

@RPC 
function asksuplly()
{
	if(matchcontroller == null){matchcontroller = GameObject.Find("matchcontroller(Clone)");}
	if(matchcontroller != null)
	{
		matchcontroller.GetComponent(sc_matchcontroller).spawnsuplly();
	}
}

@RPC 
function endgame(RPCscore:int,RPCsecs:int,RPCmins:int)
{	
	if(networkView.isMine)
	{
		Screen.showCursor = true;
		Screen.lockCursor = false;
		gamecontrol.GetComponent(sc_gamecontrol).lastscore = RPCscore;
		gamecontrol.GetComponent(sc_gamecontrol).timesurvivedsecs = RPCsecs;
		gamecontrol.GetComponent(sc_gamecontrol).timesurvivedmins = RPCmins;
		gamecontrol.GetComponent(sc_gamecontrol).cam.parent = null;
		gamecontrol.GetComponent(sc_gamecontrol).cam.localPosition = Vector3.zero;
		gamecontrol.GetComponent(sc_gamecontrol).cam.localEulerAngles = Vector3.zero;
		gamecontrol.GetComponent(sc_gamecontrol).disconecplease = true;
		//Network.Disconnect(200);
		gamecontrol.GetComponent(sc_gamecontrol).gamestate = 12;
		gamecontrol.GetComponent(sc_gamecontrol).money += money;
		gamecontrol.GetComponent(sc_gamecontrol).lastaccmoney = money;
		gamecontrol.GetComponent(sc_gamecontrol).save();
		Application.LoadLevel(2);
	}
}
@RPC 
function updatemypermission()
{
	if(GameObject.Find("matchcontroller(Clone)") != null)
	{
		GameObject.Find("matchcontroller(Clone)").GetComponent(sc_matchcontroller).updatepermission(gameObject);
	}
}
@RPC 
function addmyspawner()
{
	if(GameObject.Find("matchcontroller(Clone)") != null)
	{
		GameObject.Find("matchcontroller(Clone)").GetComponent(sc_matchcontroller).addspawner(gameObject);
	}
}
@RPC
function setpermission(permission:boolean,id:int)
{
	myid = id;
	canspawn = permission;
		
	if(playerobj != null)if(playerobj.GetComponent(sc_player) != null)
	{
		playerobj.GetComponent(sc_player).myid = id;
		playerobj.networkView.RPC("syncmyid",RPCMode.All,id);
	}
}

@RPC
function updatename(name:String)
{
	playername = name;
}

function Start () {
	specplayers = GameObject.FindGameObjectsWithTag("Player");
	Input.eatKeyPressOnTextFieldFocus = false;
	if(!networkView.isMine){enabled = false;}
	scenecontrol = gamecontrol.GetComponent(sc_gamecontrol).scenecontroller;
	networkView.RPC("updatename",RPCMode.Server,playername);
	networkView.RPC("addmyspawner",RPCMode.Server);
}

function Update () {
	mouseup = Input.GetKeyUp(KeyCode.Mouse0);
	
	var rndint:int = 0;
	var cont:int = 0;
	var cont2:int = 0;
	var cont3:int = 0;
	
	var tmpint:int = 0;
	var tmpint2:int = 0;
	
	var came:Transform;
	var obs:Transform;
	var hit:RaycastHit;
	var lmask:LayerMask;
	
	came = gamecontrol.GetComponent(sc_gamecontrol).cam;
	
	chatbool = true;
	if((!canspawn) && (playerobj == null))
	{
		networkView.RPC("updatemypermission",RPCMode.Server);
	}
	if(state == 1)       //normal
	{
		Screen.showCursor = false;
		Screen.lockCursor = true;
				
		var insted:Transform;
		var tmpfloat1:float = 0;
		var tmpfloat2:float = 0;
		
		if((canspawn)&&(playerobj == null))
		{
			conter += 100*Time.deltaTime;
			if(conter > 100*timetospawn)
			{
				if(!spawnei)
				{
					spawnei = true;
					spawns = GameObject.FindGameObjectsWithTag("playerspawn");
					rndint = Random.Range(0,spawns.Length);
					justlogged = false;
					tmpfloat1 = spawns[rndint].transform.position.x+Random.Range(-(spawns[rndint].transform.localScale.x/2),(spawns[rndint].transform.localScale.x/2));
					tmpfloat2 = spawns[rndint].transform.position.z+Random.Range(-(spawns[rndint].transform.localScale.z/2),(spawns[rndint].transform.localScale.z/2));
					insted = Network.Instantiate(playerprefab,Vector3(tmpfloat1,spawns[rndint].transform.position.y,tmpfloat2),playerprefab.rotation,0);
					
					cont = 0;
					while(cont < inve.Length)
					{
						insted.GetComponent(sc_player).item[cont] = inve[cont];
						if(inve[cont] >= 0)
						{
							if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[inve[cont]].tipo == 0)
							{
								insted.GetComponent(sc_player).quant[cont] = gamecontrol.GetComponent(sc_gamecontrol).itemlist[inve[cont]].prefab.GetComponent(sc_gunscript).maxammo;
								insted.GetComponent(sc_player).ammo[cont] = gamecontrol.GetComponent(sc_gamecontrol).itemlist[inve[cont]].prefab.GetComponent(sc_gunscript).maxammo;
							}
							if(gamecontrol.GetComponent(sc_gamecontrol).itemlist[inve[cont]].tipo == 4)
							{
								insted.GetComponent(sc_player).quant[cont] = 1;
								insted.GetComponent(sc_player).ammo[cont] = 1;
							}
						}
						cont++;
					}
					
					insted.GetComponent(sc_player).myskin = my_skincolor;
					insted.GetComponent(sc_player).beardcolor = my_beardcolor;
					insted.GetComponent(sc_player).shirtcolor = my_shirtcolor;
					insted.GetComponent(sc_player).beardnum = my_beard;
					
					if(insted.GetComponent(sc_player).myskin)
					{
						insted.GetComponent(sc_player).beardcolor = 2;
					}
					insted.GetComponent(sc_player).cam = gamecontrol.GetComponent(sc_gamecontrol).cam;
					insted.GetComponent(sc_player).gamecontrol = gamecontrol;
					insted.GetComponent(sc_player).playername = playername;
					insted.GetComponent(sc_player).mouse_sense = mousesense;
					insted.GetComponent(sc_player).myid = myid;
					insted.GetComponent(sc_player).networkView.RPC("setid",RPCMode.Others,myid);
					insted.GetComponent(sc_player).autoreload = autoreload;
					insted.GetComponent(sc_player).autoaim = autoaim;
					insted.GetComponent(sc_player).myspawner = transform;
					insted.GetComponent(sc_player).controled = true;
					insted.rigidbody.isKinematic = false;
					insted.GetComponent(sc_player).enabled = true;
					insted.GetComponent(sc_onlinecontroller).enabled = false;
					playerobj = insted;
					canspawn = false;
					conter = 0;
				}
			}
		}
		if(Input.GetKeyDown(KeyCode.Escape))
		{
			Screen.showCursor = true;
			Screen.lockCursor = false;
			state = 2;
			if(playerobj != null)
			{
				if(playerobj.GetComponent(sc_player) != null)
				{playerobj.GetComponent(sc_player).controled = false;}
			}
		}
		if(Input.GetKeyDown(KeyCode.I))
		{
			if(playerobj != null)
			{
				if(playerobj.GetComponent(sc_player) != null)
				{
					state = 5;
					Screen.showCursor = true;
					Screen.lockCursor = false;
					playerobj.GetComponent(sc_player).controled = false;
				}
			}
		}
		if(Input.GetKeyUp(KeyCode.T))
		{
			state = 4;chatbool = false;
			Screen.showCursor = true;
			Screen.lockCursor = false;
			GUI.FocusControl("chatbox");
		}
	}
	if(state == 5)
	{
		if(Input.GetKeyDown(KeyCode.Escape))
		{
			state = 1;
			Screen.showCursor = false;
			Screen.lockCursor = true;
			if(playerobj != null)
			{
				if(playerobj.GetComponent(sc_player) != null)
				{playerobj.GetComponent(sc_player).controled = true;}
			}
		}
	}
	if(state == 2)
	{
		if(Input.GetKeyUp(KeyCode.T))
		{
			state = 4;chatbool = false;
			Screen.showCursor = true;
			Screen.lockCursor = false;
			GUI.FocusControl("chatbox");
		}
	}
	if(state == 4)
	{
		if(playerobj != null)if(playerobj.GetComponent(sc_player) != null)
		{playerobj.GetComponent(sc_player).controled = false;}
		if(chatbool)if(Input.GetKeyDown(KeyCode.Return))
		{
			state = 1;
			if(playerobj != null)if(playerobj.GetComponent(sc_player) != null)
			{playerobj.GetComponent(sc_player).controled = true;}
			Screen.showCursor = false;
			Screen.lockCursor = true;
			
			if(chat.Length > 0)
			{
				if(Network.isClient){networkView.RPC("sendchat",RPCMode.Server,playername+": "+chat,0);}
				else
				{
					send_cmd = -1;
					cont = 0;
					while(cont < chatcommands.Length)
					{
						tmpint = 1;
						cont2 = 0;
						while(cont2 < chatcommands[cont].Length)
						{
							if(cont2 >= chat.Length){tmpint = 0;break;}
							
							if(chatcommands[cont].Chars[cont2] != chat.Chars[cont2])
							{tmpint = 0;}
							
							cont2++;
						}
						if(tmpint == 1){send_cmd = cont;break;}
						cont++;
					}
					if(send_cmd == -1)     ////////mandar chat
					{
						sendchat(playername+": "+chat,1);
					}
					else
					{
						if(send_cmd == 0)          
						{////////kickar do server
							parsefrase = chat.Substring(chatcommands[0].Length);
							
							if(int.TryParse(parsefrase,tmpint))
							{
								tmpint = int.Parse(parsefrase);
								GameObject.Find("matchcontroller(Clone)").GetComponent(sc_matchcontroller).kick_player(tmpint);
							}
						}
						if(send_cmd == 1)          
						{////////banir do server
							parsefrase = chat.Substring(chatcommands[1].Length);
							
							if(int.TryParse(parsefrase,tmpint))
							{
								tmpint = int.Parse(parsefrase);
								GameObject.Find("matchcontroller(Clone)").GetComponent(sc_matchcontroller).ban_player_ip(tmpint);
							}
						} 
						if(send_cmd == 2)         
						{ ///////mandar msg
							GameObject.Find("matchcontroller(Clone)").GetComponent(sc_matchcontroller).server_say(chat.Substring(chatcommands[2].Length));
						}
						if(send_cmd == 3)          
						{////////trocar de senha
							Network.incomingPassword = chat.Substring(chatcommands[3].Length);
							GameObject.Find("matchcontroller(Clone)").GetComponent(sc_matchcontroller).spreadchat("Server has changed password",5);
						}
						if(send_cmd == 4)          
						{////////trocar de senha
							parsefrase = chat.Substring(chatcommands[4].Length);
							
							if(int.TryParse(parsefrase,tmpint))
							{
								tmpint = int.Parse(parsefrase);
								GameObject.Find("matchcontroller(Clone)").GetComponent(sc_matchcontroller).disban_player_ip(tmpint);
							}
						}
					}
				}
			}
			
			chat = "";
		}
		if(Input.GetKeyDown(KeyCode.Escape))
		{
			state = 1;
			if(playerobj != null)if(playerobj.GetComponent(sc_player) != null)
			{playerobj.GetComponent(sc_player).controled = true;}
			Screen.showCursor = false;
			Screen.lockCursor = true;
		}
	}
	if(playerobj == null)
	{
		if(specplayers == null)
		{
			specplayers = GameObject.FindGameObjectsWithTag("Player");
			spectarget = 0;
		}
		else
		{
			if(Input.GetKeyDown(KeyCode.Mouse0))
			{
				spectarget++;
				if(spectarget > specplayers.Length-1)
				{
					spectarget = 0;
				}
				
				if(spectarget >= 0)if(spectarget < specplayers.Length)
				{
					if(specplayers[spectarget] != null)
					{
						camfix = specplayers[spectarget].transform.position;
						came.position = camfix;
					}
				}
			}
			if(specplayers.Length > 0)
			{
				if(specplayers[spectarget] == null)
				{
					specplayers = GameObject.FindGameObjectsWithTag("Player");
					spectarget = 0;
				}
				else
				{
					 obs = gamecontrol.GetComponent(sc_gamecontrol).scenecontroller.GetComponent(sc_scenecontroller).observator;
					 obs.position = specplayers[spectarget].transform.position;
					 camfix = Vector3.Lerp(camfix,obs.position,5*Time.deltaTime);
					 came = gamecontrol.GetComponent(sc_gamecontrol).cam;
					 came.position = camfix;
					 
					 lmask = (1 << 8);
					 if(Physics.Raycast(came.position,-came.forward,hit,4,lmask))
					 { specdist = Mathf.Lerp(specdist,hit.distance*0.99,15*Time.deltaTime); }
					 else{specdist = Mathf.Lerp(specdist,3.67,15*Time.deltaTime);}
					 came.Translate(-Vector3.forward*specdist);
				}
			}
			else
			{
				specplayers = GameObject.FindGameObjectsWithTag("Player");
				spectarget = 0;
			}
		}
	}
}

function OnGUI()
{
	GUI.skin = guiskin;
	var tmpint:int = 0;
	var cont:int = 0;
	var tmpvec3:Vector3;
	var sprt:Texture;
	
	if(state == 5) ////////////////////////inventory
	{
		if(playerobj.GetComponent(sc_player) == null){state = 1;}
		if(playerobj.GetComponent(sc_player) != null)
		{
			if(playerobj.GetComponent(sc_player) == null){state = 1;}
			else
			{
				GUI.color = Color.white;
				GUI.color.a = 0.7;
				GUI.DrawTexture(Rect( (Screen.width/2)-230,(Screen.height/2)-180,460,280),blackcube,ScaleMode.StretchToFill, true, 0);
				GUI.color.a = 0.1;
				GUI.DrawTexture(Rect( (Screen.width/2)-230,(Screen.height/2)-180,460,30),cubesprite,ScaleMode.StretchToFill, true, 0);
				GUI.skin = guiInv;
				GUI.color = Color.yellow;
				GUI.Label(Rect((Screen.width/2)-150,(Screen.height/2)-180,300,25),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[60]);
				
				GUI.skin = guiskin;
				tmpvec3 = Input.mousePosition;
				tmpvec3.y = Screen.height-Input.mousePosition.y;
				
				var canstack:boolean;
				
				cont = 0;
				while(cont < 5)
				{
					GUI.color = Color.white;
					
					if(Rect( (Screen.width/2)-20,(Screen.height/2)-120+(35*cont),96,33).Contains(tmpvec3))
					{
						GUI.color.a = 0.2;
						if(Input.GetKeyDown(KeyCode.Mouse0))if(playerobj.GetComponent(sc_player).item[cont] >= 0)
						if(cont != playerobj.GetComponent(sc_player).itemselected)
						{
							onmouse = cont;
						}
						if(onmouse >= 0)if(mouseup)if(onmouse != cont)
						{
							canstack = false;
							if(playerobj.GetComponent(sc_player).item[onmouse] >= 0)if(playerobj.GetComponent(sc_player).item[cont] >= 0)
							{
								tmpint = gamecontrol.GetComponent(sc_gamecontrol).itemlist[playerobj.GetComponent(sc_player).item[cont]].tipo;
								if((tmpint == 3)||(tmpint == 4)||(tmpint == 5))
								{
									if(playerobj.GetComponent(sc_player).item[onmouse] == playerobj.GetComponent(sc_player).item[cont] )
									{canstack = true;}
								}
							}
							if(cont != playerobj.GetComponent(sc_player).itemselected)
							{
								if(canstack)
								{
									playerobj.GetComponent(sc_player).ammo[cont] += playerobj.GetComponent(sc_player).ammo[onmouse];
									playerobj.GetComponent(sc_player).ammo[onmouse] = 0;
									playerobj.GetComponent(sc_player).item[onmouse] = -1;
								}
								else
								{
									tmpint = playerobj.GetComponent(sc_player).item[onmouse];
									playerobj.GetComponent(sc_player).item[onmouse] = playerobj.GetComponent(sc_player).item[cont];
									playerobj.GetComponent(sc_player).item[cont] = tmpint;
									
									tmpint = playerobj.GetComponent(sc_player).quant[onmouse];
									playerobj.GetComponent(sc_player).quant[onmouse] = playerobj.GetComponent(sc_player).quant[cont];
									playerobj.GetComponent(sc_player).quant[cont] = tmpint;
									
									tmpint = playerobj.GetComponent(sc_player).ammo[onmouse];
									playerobj.GetComponent(sc_player).ammo[onmouse] = playerobj.GetComponent(sc_player).ammo[cont];
									playerobj.GetComponent(sc_player).ammo[cont] = tmpint;
								}
							}
						}
						GUI.color = Color.white;
						GUI.color.a = 0.2;
					}
					else{GUI.color.a = 0.1;}
					
					if(cont == playerobj.GetComponent(sc_player).itemselected)
					{GUI.color = Color.red; GUI.color.a = 0.4;}
					
					GUI.DrawTexture(Rect( (Screen.width/2)-20,(Screen.height/2)-120+(35*cont),96,33),cubesprite,ScaleMode.StretchToFill, true, 0);
					if(playerobj.GetComponent(sc_player).item[cont] >= 0)if(onmouse != cont)
					{
						GUI.color = Color.white;
						GUI.color.a = 1;
						sprt = gamecontrol.GetComponent(sc_gamecontrol).itemlist[playerobj.GetComponent(sc_player).item[cont]].sprite;
						GUI.DrawTexture(Rect( (Screen.width/2)-20,(Screen.height/2)-120+(35*cont), sprt.width, sprt.height), sprt,ScaleMode.StretchToFill, true, 0);
						
						tmpint = gamecontrol.GetComponent(sc_gamecontrol).itemlist[playerobj.GetComponent(sc_player).item[cont]].tipo;
						if((tmpint == 3)||(tmpint == 4)||(tmpint == 5))
						{
							GUI.skin = guiInv2;
							GUI.Label(Rect( (Screen.width/2)-20,(Screen.height/2)-117+(35*cont), sprt.width, sprt.height), "x"+playerobj.GetComponent(sc_player).ammo[cont]);
						}
					}
					cont++;
				}
				while(cont < 10)
				{
					GUI.color = Color.white;

					if(Rect( (Screen.width/2)+95,(Screen.height/2)-120+(35*(cont-5)),96,33).Contains(tmpvec3))
					{
						GUI.color.a = 0.2;
						if(Input.GetKeyDown(KeyCode.Mouse0))if(playerobj.GetComponent(sc_player).item[cont] >= 0)
						if(cont != playerobj.GetComponent(sc_player).itemselected)
						{
							onmouse = cont;
						}
						if(onmouse >= 0)if(mouseup)if(onmouse != cont)
						{
							canstack = false;
							if(playerobj.GetComponent(sc_player).item[onmouse] >= 0)if(playerobj.GetComponent(sc_player).item[cont] >= 0)
							{
								tmpint = gamecontrol.GetComponent(sc_gamecontrol).itemlist[playerobj.GetComponent(sc_player).item[cont]].tipo;
								if((tmpint == 3)||(tmpint == 4)||(tmpint == 5))
								{
									if(playerobj.GetComponent(sc_player).item[onmouse] == playerobj.GetComponent(sc_player).item[cont] )
									{canstack = true;}
								}
							}
							if(cont != playerobj.GetComponent(sc_player).itemselected)
							{
								if(canstack)
								{
									playerobj.GetComponent(sc_player).ammo[cont] += playerobj.GetComponent(sc_player).ammo[onmouse];
									playerobj.GetComponent(sc_player).ammo[onmouse] = 0;
									playerobj.GetComponent(sc_player).item[onmouse] = -1;
								}
								else
								{
									tmpint = playerobj.GetComponent(sc_player).item[onmouse];
									playerobj.GetComponent(sc_player).item[onmouse] = playerobj.GetComponent(sc_player).item[cont];
									playerobj.GetComponent(sc_player).item[cont] = tmpint;
									
									tmpint = playerobj.GetComponent(sc_player).quant[onmouse];
									playerobj.GetComponent(sc_player).quant[onmouse] = playerobj.GetComponent(sc_player).quant[cont];
									playerobj.GetComponent(sc_player).quant[cont] = tmpint;
									
									tmpint = playerobj.GetComponent(sc_player).ammo[onmouse];
									playerobj.GetComponent(sc_player).ammo[onmouse] = playerobj.GetComponent(sc_player).ammo[cont];
									playerobj.GetComponent(sc_player).ammo[cont] = tmpint;
								}
							}
						}
						GUI.color = Color.white;
						GUI.color.a = 0.2;
					}
					else{GUI.color.a = 0.1;}
					
					if(cont == playerobj.GetComponent(sc_player).itemselected)
					{GUI.color = Color.red; GUI.color.a = 0.4;}
					
					GUI.DrawTexture(Rect( (Screen.width/2)+95,(Screen.height/2)-120+(35*(cont-5)),96,33),cubesprite,ScaleMode.StretchToFill, true, 0);
					if(playerobj.GetComponent(sc_player).item[cont] >= 0)if(onmouse != cont)
					{
						GUI.color = Color.white;
						GUI.color.a = 1;
						sprt = gamecontrol.GetComponent(sc_gamecontrol).itemlist[playerobj.GetComponent(sc_player).item[cont]].sprite;
						GUI.DrawTexture(Rect( (Screen.width/2)+95,(Screen.height/2)-120+(35*(cont-5)),sprt.width,sprt.height),sprt,ScaleMode.StretchToFill, true, 0);
					
						tmpint = gamecontrol.GetComponent(sc_gamecontrol).itemlist[playerobj.GetComponent(sc_player).item[cont]].tipo;
						if((tmpint == 3)||(tmpint == 4)||(tmpint == 5))
						{
							GUI.skin = guiInv2;
							GUI.Label(Rect( (Screen.width/2)+95,(Screen.height/2)-117+(35*(cont-5)),sprt.width,sprt.height), "x"+playerobj.GetComponent(sc_player).ammo[cont]);
						}
					}
					cont++;
				}
				if(mouseup)
				{
					if(Rect( (Screen.width/2)-230,(Screen.height/2)-180,460,280).Contains(tmpvec3))
					{
						onmouse = -1;
					}
					else if(onmouse >= 0)
					{
						if(Network.isClient)
						{
							networkView.RPC("dropitem",RPCMode.Server,playerobj.GetComponent(sc_player).item[onmouse],playerobj.position+(playerobj.transform.forward*0.4),transform.rotation,playerobj.GetComponent(sc_player).quant[onmouse],playerobj.GetComponent(sc_player).ammo[onmouse]);
						}
						else
						{
							dropitem(playerobj.GetComponent(sc_player).item[onmouse],playerobj.position+(playerobj.transform.forward*0.4),transform.rotation,playerobj.GetComponent(sc_player).quant[onmouse],playerobj.GetComponent(sc_player).ammo[onmouse]);
						}
						
						playerobj.GetComponent(sc_player).item[onmouse] = -1;
						playerobj.GetComponent(sc_player).quant[onmouse] = 0;
						playerobj.GetComponent(sc_player).ammo[onmouse] = 0;
						
						onmouse = -1;
					}
				}
				
				GUI.color = Color.white;
				GUI.color.a = 0.4;
				GUI.DrawTexture(Rect( (Screen.width/2)-40,(Screen.height/2)-130,1,195),cubesprite,ScaleMode.StretchToFill, true, 0);
				
				GUI.color.a = 0.1;
				cont = 0;
				while(cont < 3)
				{
					
					GUI.DrawTexture(Rect( (Screen.width/2)-160,(Screen.height/2)-120+(61*cont),96,33),cubesprite,ScaleMode.StretchToFill, true, 0);
					GUI.DrawTexture(Rect( (Screen.width/2)-200,(Screen.height/2)-120+(61*cont),33,33),cubesprite,ScaleMode.StretchToFill, true, 0);
					GUI.DrawTexture(Rect( (Screen.width/2)-200,(Screen.height/2)-82+(61*cont),135,12),cubesprite,ScaleMode.StretchToFill, true, 0);
					cont++;
				}
				GUI.color.a = 0.2;
				GUI.DrawTexture(Rect( (Screen.width/2)-198,(Screen.height/2)-115       ,inv3_sign[0].width,inv3_sign[0].height),inv3_sign[0],ScaleMode.StretchToFill, true, 0);
				GUI.DrawTexture(Rect( (Screen.width/2)-194,(Screen.height/2)-118+61    ,inv3_sign[1].width,inv3_sign[1].height),inv3_sign[1],ScaleMode.StretchToFill, true, 0);
				GUI.DrawTexture(Rect( (Screen.width/2)-195,(Screen.height/2)-118+122   ,inv3_sign[2].width,inv3_sign[2].height),inv3_sign[2],ScaleMode.StretchToFill, true, 0);
				
				if(onmouse >= 0)if(playerobj.GetComponent(sc_player).item[onmouse] >= 0)
				{
					GUI.color.a = 1;
					sprt = gamecontrol.GetComponent(sc_gamecontrol).itemlist[playerobj.GetComponent(sc_player).item[onmouse]].sprite;
					GUI.DrawTexture(Rect( tmpvec3.x-48,tmpvec3.y-16,sprt.width,sprt.height),sprt,ScaleMode.StretchToFill, true, 0);
				}
				///////////////////////////////
			}
		}
	}
	
	if(state == 4)///////////////chat
	{
		GUI.skin = chatfont;
		GUI.SetNextControlName("chatbox");
		GUI.FocusControl("chatbox");
		chat = GUI.TextField(Rect(3,3,320,19),chat.ToLower(),30);
		GUI.skin = guiskin;
	}
	if(state == 1)/////////////////////normal
	{
		GUI.skin = otherfont;
		if(BM_alpha < 1)
		{GUI.color.a = BM_alpha;}
		else
		{GUI.color.a = 1;}
		GUI.Label(Rect((Screen.width/2)-300,(Screen.height/2)-100,600,200),BM_message);
		if(BM_alpha > 0){BM_alpha -= 0.6*Time.deltaTime;}
		
		if(Input.GetKey(KeyCode.Tab))
		{
			GUI.skin = guiSlist;
			GUI.color.a = 0.4;
			GUI.Box(Rect((Screen.width/2)-310,(Screen.height/2)-270,620,500),"");
			
			GUI.color.a = 1;
			GUI.Label(Rect((Screen.width/2)-265,(Screen.height/2)-234,290,25),"Name");
			GUI.Label(Rect((Screen.width/2)+40,(Screen.height/2)-234,290,25),"Kill");
			GUI.Label(Rect((Screen.width/2)+130,(Screen.height/2)-234,290,25),"$$$");
			GUI.Label(Rect((Screen.width/2)-295,(Screen.height/2)-234,290,25),"Id");
			GUI.Label(Rect((Screen.width/2)+245,(Screen.height/2)-234,290,25),"Ping");
			
			if(matchdata != null)
			{
				GUI.color.a = 0.5;
			
				GUI.DrawTexture(Rect((Screen.width/2)+20,(Screen.height/2)-210,1,(27*matchdata.GetComponent(sc_matchdata).playersingame)),cubesprite, ScaleMode.StretchToFill, true, 0);
				GUI.DrawTexture(Rect((Screen.width/2)+120,(Screen.height/2)-210,1,(27*matchdata.GetComponent(sc_matchdata).playersingame)),cubesprite, ScaleMode.StretchToFill, true, 0);
				GUI.DrawTexture(Rect((Screen.width/2)-270,(Screen.height/2)-210,1,(27*matchdata.GetComponent(sc_matchdata).playersingame)),cubesprite, ScaleMode.StretchToFill, true, 0);
				GUI.DrawTexture(Rect((Screen.width/2)+240,(Screen.height/2)-210,1,(27*matchdata.GetComponent(sc_matchdata).playersingame)),cubesprite, ScaleMode.StretchToFill, true, 0);
				
				GUI.color.a = 1;
				GUI.DrawTexture(Rect((Screen.width/2)+0,(Screen.height/2)-265,1,27),cubesprite, ScaleMode.StretchToFill, true, 0);
				
				GUI.DrawTexture(Rect((Screen.width/2)-300,(Screen.height/2)-210,600,1),cubesprite, ScaleMode.StretchToFill, true, 0);
				GUI.DrawTexture(Rect((Screen.width/2)-300,(Screen.height/2)-235,600,1),cubesprite, ScaleMode.StretchToFill, true, 0);
				GUI.Label(Rect((Screen.width/2)-270,(Screen.height/2)-265,250,25), gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[71] );
				GUI.Label(Rect((Screen.width/2)+30,(Screen.height/2)-265,250,25), gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[72]+matchdata.GetComponent(sc_matchdata).wave );
				
				cont = 0;
				while(cont < matchdata.GetComponent(sc_matchdata).playersingame)
				{
					GUI.color.a = 0.2;
					GUI.DrawTexture(Rect((Screen.width/2)-300,(Screen.height/2)-210+((cont+1)*27),600,1),cubesprite, ScaleMode.StretchToFill, true, 0);
					GUI.color.a = 1;
					GUI.Label(Rect((Screen.width/2)+250,(Screen.height/2)-208+(cont*27),50,25), matchdata.GetComponent(sc_matchdata).playerpings[cont].ToString());
					GUI.Label(Rect((Screen.width/2)-297,(Screen.height/2)-208+(cont*27),50,25), cont.ToString());
					GUI.Label(Rect((Screen.width/2)-265,(Screen.height/2)-208+(cont*27),290,25), matchdata.GetComponent(sc_matchdata).playernames[cont]);
					GUI.Label(Rect((Screen.width/2)+30,(Screen.height/2)-207+(cont*27),75,25),""+matchdata.GetComponent(sc_matchdata).playerkills[cont]);
					GUI.Label(Rect((Screen.width/2)+130,(Screen.height/2)-207+(cont*27),75,25), ""+matchdata.GetComponent(sc_matchdata).playermoneys[cont]);
					cont++;
				}
			}
		}
		GUI.skin = guiskin;
		GUI.color.a = 1;
		if(playerobj == null)
		{
			if(!Input.GetKey(KeyCode.Tab))
			{
				if(canspawn)
				{
					if(justlogged)
					{
						tmpint = timetospawn-(conter/100)+1;
						GUI.Label(Rect((Screen.width/2)-300,(Screen.height/2)-50,600,100),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[32]+tmpint);
					}
				}
				else
				{
					if(justlogged)
					{
						GUI.Label(Rect((Screen.width/2)-300,(Screen.height/2)-50,600,100),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[36]);
					}
					else
					{
						GUI.Label(Rect((Screen.width/2)-300,(Screen.height/2)-50,600,100),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[37]);
					}
				}
			}
		}
	}
	if(state == 2)///////////
	{	
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		GUI.DrawTexture(Rect( (Screen.width/2)-(newhud[0].width/2),(Screen.height/2)-50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect( (Screen.width/2)-(newhud[0].width/2),(Screen.height/2)-0,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		//GUI.DrawTexture(Rect( (Screen.width/2)-(newhud[0].width/2),(Screen.height/2)+25,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		if(GUI.Button(Rect((Screen.width/2)-200,(Screen.height/2)-45,400,32),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[38] ) )
		{
			state = 1;
			if(playerobj != null)
			{
				if(playerobj.GetComponent(sc_player) != null)
				{playerobj.GetComponent(sc_player).controled = true;}
			}
		}
		if(GUI.Button(Rect((Screen.width/2)-200,(Screen.height/2)+5,400,32),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[39] ) )
		{
			state = 3;
		}
	}
	if(state == 3)//////////
	{	
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		
		GUI.DrawTexture(Rect( (Screen.width/2)-(newhud[0].width/2),(Screen.height/2)-50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect( (Screen.width/2)-(newhud[0].width/2),(Screen.height/2)   ,newhud[2].width,newhud[2].height),newhud[2],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect( (Screen.width/2)+15,(Screen.height/2)   ,newhud[2].width,newhud[2].height),newhud[2],ScaleMode.StretchToFill, true, 0);
		
		GUI.Label(Rect((Screen.width/2)-200,(Screen.height/2)-45,400,32), gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[40] );
		//GUI.Label(Rect((Screen.width/2)-200,(Screen.height/2)-35,400,32), gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[41] );
		
		if(GUI.Button(Rect((Screen.width/2)-160,(Screen.height/2)+5,90,32),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[42] ) )
		{
			networkView.RPC("sendchat",RPCMode.Server,playername+" disconnected."+chat,4);
			
			Screen.showCursor = true;
			Screen.lockCursor = false;
			gamecontrol.GetComponent(sc_gamecontrol).cam.parent = null;
			gamecontrol.GetComponent(sc_gamecontrol).cam.localPosition = Vector3.zero;
			gamecontrol.GetComponent(sc_gamecontrol).cam.localEulerAngles = Vector3.zero;
			gamecontrol.GetComponent(sc_gamecontrol).gamestate = 7;
			gamecontrol.GetComponent(sc_gamecontrol).lastaccmoney = money;
			gamecontrol.GetComponent(sc_gamecontrol).money += money;
			gamecontrol.GetComponent(sc_gamecontrol).save();
			
			if(gamecontrol.GetComponent(sc_gamecontrol).iamserver)
			{
				gamecontrol.GetComponent(sc_gamecontrol).errormsg = gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[44];
			}
			else
			{
				gamecontrol.GetComponent(sc_gamecontrol).errormsg = gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[45];
			}
			Application.LoadLevel(2);
			Network.Disconnect(500);
		}
		if(GUI.Button(Rect((Screen.width/2)+75,(Screen.height/2)+5,90,32),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[43] ) )
		{
			state = 2;
		}
		if(Input.GetKeyDown(KeyCode.Escape))
		{
			state = 2;
		}
	}
}