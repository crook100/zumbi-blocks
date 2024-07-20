#pragma strict
var dano:float = 200;
var exp_range:float = 5;
var push:float = 5;
var time:float = 50;
var std_particle:Transform;
var blood_particle:Transform;
var shooter:int = -1;
var conter:float = 0;
var shooterobj:Transform;

function Start () {
	if(!networkView.isMine){enabled = false;}
}

function Update () {
	var lmask:LayerMask;
	var tmpfloat:float = 0;
	var tmpfloat2:float = 0;
	var hit:RaycastHit;
	var alvoobj:GameObject[];
	var cont:int = 0;
	
	conter += 10*Time.deltaTime;
	
	if(conter > time)
	{
		GetComponent(sc_explosao).shooter = shooterobj;
		
		if(GetComponent(sc_explosao).blow_up("Player",exp_range,shooter,dano,push,false,false,transform.position))
		{if(shooterobj != null){shooterobj.GetComponent(sc_player).add_hitmarker();}}
		
		if(GetComponent(sc_explosao).blow_up("zumbi",exp_range,shooter,dano,push,false,false,transform.position))
		{if(shooterobj != null){shooterobj.GetComponent(sc_player).add_hitmarker();}}
		
		GetComponent(sc_explosao).blow_up("",exp_range,shooter,dano,push,false,true,transform.position);
		
		Network.Instantiate(std_particle,transform.position,std_particle.rotation,3);
		networkView.RPC("killmebuffered",RPCMode.AllBuffered);
	}
}