#pragma strict
var lifetime:int = 25;
var bloodpart:Transform;
var dmgtime:float = 0;
var soundef:Transform;
function OnTriggerStay (other : Collider) {
	if(other.GetComponent(sc_zumbi) != null)
	{
		if(other.GetComponent(sc_zumbi).state != 4)if(dmgtime <= 0)
		{
			other.gameObject.networkView.RPC("setkillerid",RPCMode.All,-1);
			other.gameObject.GetComponent(sc_life).hurtme(25f);
			other.gameObject.networkView.RPC("hurtme",RPCMode.Others,25f);
			other.gameObject.networkView.RPC("pushme",RPCMode.All,0);
			
			lifetime--;
			dmgtime = 0.25;
			
			Network.Instantiate(bloodpart,(other.transform.position+transform.position)/2,bloodpart.rotation,3);
		}
	}
	
}
function OnTriggerEnter (other : Collider) {
	if(other.GetComponent(sc_player) != null)if(dmgtime <= 0)
	{
		other.gameObject.GetComponent(sc_life).quantia -= 10;
		other.gameObject.networkView.RPC("hurtme",RPCMode.Others,10f);
		other.gameObject.networkView.RPC("spillblood",RPCMode.All);
		
		lifetime--;
		dmgtime = 0.25;
		Network.Instantiate(bloodpart,(other.transform.position+transform.position)/2,bloodpart.rotation,3);
	}
	
}
	
function Start () {
	if(Network.isClient){enabled = false;}
}

function Update () {
	if(dmgtime > 0)
	{
		dmgtime -= Time.deltaTime;
	}
	if(lifetime <= 0)
	{
		if(soundef != null)
		{
			Network.Instantiate(soundef,transform.position,transform.rotation,11);
		}
		transform.parent.networkView.RPC("killmebuffered",RPCMode.OthersBuffered);
		Destroy(transform.parent.gameObject);
	}
}