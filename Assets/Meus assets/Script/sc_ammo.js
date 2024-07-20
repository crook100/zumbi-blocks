#pragma strict

var gunid:int;

@RPC
function grabammo(playerid:int)
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
			players[tmpint].networkView.RPC("receiveammo",RPCMode.All,gunid,GetComponent(sc_canbetaken).ammo);
		}
		networkView.RPC("destroymeitem",RPCMode.OthersBuffered);
		Destroy(gameObject);
	}
}