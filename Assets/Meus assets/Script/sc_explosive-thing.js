#pragma strict

var exp_part:Transform;
var range:float;
var dano:float;
var push:float;
function Start () {
	if(!networkView.isMine){enabled = false;}
}

function Update () {
	if(GetComponent(sc_life).quantia <= 0)
	{
		GetComponent(sc_explosao).shooter = null;
		//GetComponent(sc_explosao).blow_up("Player",exp_range,GetComponent(sc_haveowner).id,dano,push);
		GetComponent(sc_explosao).blow_up("zumbi",range,GetComponent(sc_haveowner).id,dano,push,false,false,transform.position);
		GetComponent(sc_explosao).blow_up("",range,GetComponent(sc_haveowner).id,dano,push,false,true,transform.position);

		Network.Instantiate(exp_part,transform.position,transform.rotation,3);
		
		networkView.RPC("killmebuffered",RPCMode.OthersBuffered);
		Destroy(gameObject);
	}
}