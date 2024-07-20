#pragma strict

var guiskin:GUISkin;
var gamecontrol:Transform;

@RPC function grabammocrate(playerid:int)
{
	if(networkView.isMine)
	{
		var players:GameObject[];
		players = GameObject.FindGameObjectsWithTag("Player");
		var cont:int = 0;
		var tmpint:int = -1;
		while(cont < players.Length)
		{
			if(players[cont].GetComponent(sc_player).myid == playerid)
			{
				tmpint = cont;
				cont = players.Length;
			}
			cont++;
		}
		
		if(tmpint >= 0)
		{
			players[tmpint].networkView.RPC("receiveammocrate",RPCMode.All);
		}
		networkView.RPC("killmebuffered",RPCMode.OthersBuffered);
		Destroy(gameObject);
	}
}

function Start () {
	gamecontrol = GameObject.Find("gamecontroler").transform;
}
function Update () {
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
		GUI.Label(Rect(posi.x-200,posi.y-20,400,40), "Ammo Box" );
	}
}