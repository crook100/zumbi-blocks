#pragma strict

var conter:float = -1;
var ownerid:int = -1;
var bloodpart:Transform;

var activated:boolean = false;

function Start () {
	if(Network.isClient){enabled = false;}
}

function OnTriggerEnter (other : Collider) {
	/*if(other.GetComponent(sc_player) != null)if(!activated)
	{
		other.gameObject.GetComponent(sc_life).quantia -= 999999f;
		other.gameObject.networkView.RPC("hurtme",RPCMode.Others,999999f);
		other.gameObject.networkView.RPC("spillblood",RPCMode.All);
	}*/
	if(other.GetComponent(sc_zumbi) != null)if(!activated)
	{
		if(other.GetComponent(sc_zumbi).state != 4)
		{
			other.gameObject.networkView.RPC("setkillerid",RPCMode.All,GetComponent(sc_haveowner).id);
			other.gameObject.GetComponent(sc_life).hurtme(999999f);
			//other.gameObject.networkView.RPC("pushme",RPCMode.Others);
			other.gameObject.networkView.RPC("hurtme",RPCMode.Others,999999f);
		}
	}
	if(!activated)
	{
		networkView.RPC("activatebeartrap",RPCMode.OthersBuffered);
		GetComponent(Animation).animation["chop"].speed = 10;
		animation.Play("chop");
		activated = true;
		conter = 0;
		Network.Instantiate(bloodpart,(other.transform.position+transform.position)/2,bloodpart.rotation,3);
	}
}

@RPC function activatebeartrap()
{
	GetComponent(Animation).animation["chop"].speed = 10;
	animation.Play("chop");
	activated = true;
}


function Update () {
	if(conter >= 0)
	{
		conter += 1*Time.deltaTime;
		if(conter > 20)
		{
			networkView.RPC("killmebuffered",RPCMode.OthersBuffered);
			Destroy(gameObject);
		}
	}
}