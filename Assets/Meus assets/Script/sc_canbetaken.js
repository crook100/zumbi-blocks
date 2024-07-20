#pragma strict

var itemid:int = 0;
var quant:int = 0;
var ammo:int = 0;
var gamecontrol:Transform;
var guiskin:GUISkin;

var decaytime:float = 15000;
var decay:boolean = false;

@RPC
function grabitem(playerid:int)
{
	if(networkView.isMine)
	{
		var players:GameObject[];
		players = GameObject.FindGameObjectsWithTag("Player");
		var cont:int = 0;
		var tmpint:int = -1;
		while(cont < players.Length)
		{
			if(players[cont].GetComponent(sc_player) == null){Debug.Log(players[cont].name);}
			if(players[cont].GetComponent(sc_player).myid == playerid)
			{
				tmpint = cont;
				cont = players.Length;
			}
			cont++;
		}
		if(tmpint >= 0)
		{
			if(players[tmpint].networkView.isMine)
			{
				players[tmpint].GetComponent(sc_player).receiveitem(itemid,quant,ammo);
			}
			else
			{
				players[tmpint].networkView.RPC("receiveitem",players[tmpint].networkView.owner,itemid,quant,ammo);
			}
		}
		networkView.RPC("destroymeitem",RPCMode.OthersBuffered);
		GameObject.DestroyImmediate(gameObject,false);
	}
}

function Start () 
{
	gamecontrol = GameObject.Find("gamecontroler").transform;
}
function Update()
{
	if(networkView.isMine && decay)
	{
		decaytime -= 1000*Time.deltaTime;
		if(decaytime <= 0)
		{
			networkView.RPC("destroymeitem",RPCMode.OthersBuffered);
			Destroy(gameObject);
		}
	}
}
function OnGUI()
{
	GUI.skin = guiskin;
	var posi:Vector3;
	var dist:float = 0;
	dist = Vector3.Distance(transform.position,gamecontrol.GetComponent(sc_gamecontrol).cam.position);
	posi = gamecontrol.GetComponent(sc_gamecontrol).cam.camera.WorldToScreenPoint(transform.position);
	
	posi.y = Screen.height-posi.y;
	
	if((posi.z > 0) && (dist > 2.7))
	{
		dist = 25-dist;
		if(dist < 0){dist = 0;}
		
		GUI.color.a = 0.3*(dist/25);
		GUI.Label(Rect(posi.x-200,posi.y-20,400,40),gamecontrol.GetComponent(sc_gamecontrol).itemlist[itemid].nome );
	}
}

@RPC
function destroymeitem()
{
	Destroy(gameObject);
}