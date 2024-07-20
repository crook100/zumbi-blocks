#pragma strict

var destrosso:Transform;
var lootid:int = -1;
var lootquant:int = 0;
var lootammo:int = 1;
var soundef:Transform;

function Start () {
	if(Network.isClient){enabled = false;}
}

function Update () {
	if( GetComponent(sc_life).quantia <= 0 )
	{
		if(lootid >= 0)
		{
			var contr:GameObject = GameObject.Find("matchcontroller(Clone)");
			if(contr != null)
			{
				contr.GetComponent(sc_matchcontroller).spawnitem(lootid,transform.position,transform.rotation,lootquant,lootammo,true);
			}
		}
		if(soundef != null)
		{
			Network.Instantiate(soundef,transform.position,transform.rotation,11);
		}
		networkView.RPC("destroy_droploot",RPCMode.Others);
		networkView.RPC("killmebuffered",RPCMode.OthersBuffered);
		destroy_droploot();
		GetComponent(sc_killmebuffered).killmebuffered();
	}
}

@RPC function destroy_droploot()
{	
	if(destrosso != null)
	{Instantiate(destrosso,transform.position,transform.rotation);}
} 