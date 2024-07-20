#pragma strict

var conter:float = 0;
var lifetime:int = 1500;
var dietime:int = 1000;

var state:int = 0;
var head:Transform;
var headmesh:Transform;
var luzi:Transform;
var died:boolean = false;
var reviving:boolean = false;
var myspawner:Transform;
var gamecontrol:Transform;
var cam:Transform;
var playername:String;
var playerprefab:Transform;

var mouse_sense:float = 0;
var myid:int = 0;
var autoreload:boolean = false;
var invent:int[];
var ammo:int[];
var quant:int[];

var guiskin:GUISkin;
var lifes:int = 3;

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

var playerfab:Transform;


@RPC function dead_ask_aparence()
{
	if(networkView.isMine)
	{networkView.RPC("dead_sync_aparence",RPCMode.Others,beardnum,myskin,beardcolor,shirtcolor);}
}

@RPC function dead_sync_aparence(RPCbeardnum:int,RPCmyskin:int,RPCbeardcolor:int,RPCshirtcolor:int)
{
	//beardnum = RPCbeardnum;
	myskin = RPCmyskin;
	beardcolor = RPCbeardcolor;
	shirtcolor = RPCshirtcolor;
	
	var cont:int = 0;//////////cor de pele
	while(cont < skinpos.Length)
	{
		skinpos[cont].renderer.material = playerfab.GetComponent(sc_player).skincolors[RPCmyskin];
		cont++;
	}
	
	cont = 0;//////////cor da camisa
	while(cont < camisapos.Length)
	{
		camisapos[cont].renderer.material = playerfab.GetComponent(sc_player).camisacolors[RPCshirtcolor];
		cont++;
	}
	 //////////barba / bigode
	if(beard != null){Destroy(beard.gameObject);}
	if(RPCbeardnum >= 0)
	{	beard = Instantiate(playerfab.GetComponent(sc_player).beardprefabs[RPCbeardnum],beardpos.position,beardpos.rotation);
		beard.parent = beardpos;
		beard.GetComponent(sc_reference).refer.renderer.material = playerfab.GetComponent(sc_player).haircolors[RPCbeardcolor];
	}
	
	ap_synced = true;
}

function Start () {
	if(!networkView.isMine){enabled = false;}
	//dead_sync_aparence(-1,myskin,beardcolor,shirtcolor);
	rigidbody.AddForce(Vector3.up*300);
	conter = 0;
}

function Update () {
	var cont:int = 0;
	if(state == 0)if(!reviving)
	{
		conter += 100*Time.deltaTime;
		if(conter > lifetime)
		{
			state = 1;
			conter = 0;
			networkView.RPC("setdied",RPCMode.AllBuffered);
			myspawner.GetComponent(sc_spawner).playerobj = null;
			gamecontrol.GetComponent(sc_gamecontrol).scenecontroller.GetComponent(sc_scenecontroller).observator.eulerAngles = Vector3.zero;
			
			cam.parent = gamecontrol.GetComponent(sc_gamecontrol).scenecontroller.GetComponent(sc_scenecontroller).observator;
			cam.localPosition = Vector3.zero;
			cam.localEulerAngles = Vector3.zero;
			
			cont = 0;
			while(cont < 10)
			{
				var tmpvec3:Vector3 = Vector3.zero;
				tmpvec3 = transform.position;
				tmpvec3.x += Random.Range(-1f,1f);
				tmpvec3.z += Random.Range(-1f,1f);
				tmpvec3.y += Random.Range(-0.5,0.5);
				if(Network.isClient)
				{myspawner.networkView.RPC("dropitem",RPCMode.Server,invent[cont],tmpvec3,transform.rotation,quant[cont],ammo[cont]);}
				else{myspawner.GetComponent(sc_spawner).dropitem(invent[cont],tmpvec3,transform.rotation,quant[cont],ammo[cont]);}
				cont++;
			}
		}
	}
	if(state == 1)
	{
		conter += 100*Time.deltaTime;
		if(conter > dietime)
		{
			networkView.RPC("killmebuffered",RPCMode.AllBuffered);
		}
	}
}

function OnGUI()
{
	var tmpint:int = 0;
	GUI.skin = guiskin;
	if(!died)
	{
		tmpint = ((lifetime-conter)/100)+1;
		if(!reviving)
		{GUI.Label(Rect((Screen.width/2)-300,(Screen.height/2)-25,600,50),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[52]+tmpint);}
		else
		{GUI.Label(Rect((Screen.width/2)-300,(Screen.height/2)-25,600,50),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[69]);}
	}
}
@RPC
function revive()
{
	if(networkView.isMine && (state == 0) && (!died))
	{
		var insted:Transform = Network.Instantiate(playerprefab,Vector3(transform.position.x,transform.position.y+2.1,transform.position.z),playerprefab.rotation,0);
		
		insted.GetComponent(sc_player).beardnum = beardnum;
		insted.GetComponent(sc_player).shirtcolor = shirtcolor;
		insted.GetComponent(sc_player).beardcolor = beardcolor;
		insted.GetComponent(sc_player).myskin = myskin;
		
		insted.GetComponent(sc_player).cam = cam;
		insted.GetComponent(sc_player).gamecontrol = gamecontrol;
		insted.GetComponent(sc_player).playername = playername;
		
		insted.GetComponent(sc_player).mouse_sense = mouse_sense;
		insted.GetComponent(sc_player).myid = myid;
		insted.GetComponent(sc_player).lifes = lifes;
		insted.GetComponent(sc_player).networkView.RPC("setid",RPCMode.Others,myid);
		insted.GetComponent(sc_player).autoreload = autoreload;
		insted.GetComponent(sc_player).myspawner = myspawner;
		insted.GetComponent(sc_player).controled = true;
		insted.rigidbody.isKinematic = false;
		insted.GetComponent(sc_player).enabled = true;
		insted.GetComponent(sc_onlinecontroller).enabled = false;
		
		myspawner.GetComponent(sc_spawner).playerobj = insted;
		
		var cont:int = 0;
		while(cont < insted.GetComponent(sc_player).item.Length)
		{
			insted.GetComponent(sc_player).item[cont] = invent[cont];
			insted.GetComponent(sc_player).ammo[cont] = ammo[cont];
			insted.GetComponent(sc_player).quant[cont] = quant[cont];
			cont++;
		}
		networkView.RPC("killmebuffered",RPCMode.AllBuffered);
	}
}

@RPC
function setdied()
{
	died = true;
}

@RPC
function setreviving(isit:boolean)
{
	reviving = isit;
}