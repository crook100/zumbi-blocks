#pragma strict

var conter:float = -1;
var ownerid:int = -1;

var activated:boolean = false;

var exp_range:float = 5;
var dano:float = 5;
var push:float = 5;
var shooter:float = 5;
var std_particle:Transform;

function Start () {
	if(Network.isClient){enabled = false;}
}

function OnTriggerEnter (other : Collider) {
	if(!activated)
	{
		GetComponent(sc_explosao).shooter = null;
		//GetComponent(sc_explosao).blow_up("Player",exp_range,GetComponent(sc_haveowner).id,dano,push);
		GetComponent(sc_explosao).blow_up("zumbi",exp_range,GetComponent(sc_haveowner).id,dano,push,false,false,transform.position);
		GetComponent(sc_explosao).blow_up("",exp_range,GetComponent(sc_haveowner).id,dano,push,false,true,transform.position);

		Network.Instantiate(std_particle,transform.position,transform.rotation,3);
		activated = true;
		
		networkView.RPC("killmebuffered",RPCMode.OthersBuffered);
		Destroy(gameObject);
	}
}

function Update () {
}