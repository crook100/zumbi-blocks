#pragma strict
var smokeparticles:Transform[];
var speed:float = 300;
var exp_range:float = 5;

var dano:float = 5;
var push:float = 5;
var grav:float = 0;
var ray:float = 0.07;
var vy:float = 0;
var conter:float = 0;
var canmove:boolean = false;
var std_particle:Transform;
var blood_particle:Transform;
var shooter:int = -1;
var shooterobj:Transform;
var ignore_net:boolean = false;
function Start () {
}

function Update () {
	var raydir:Vector3;
	var movimento:Vector3;
	var lmask:LayerMask;
	var tmpbool:boolean = false;
	var tmpfloat:float = 0;
	var tmpfloat2:float = 0;
	var hit:RaycastHit;
	movimento.x = speed;
	movimento *= Time.deltaTime;
	var alvoobj:GameObject[];
	var cont:int = 0;
	if(networkView.isMine || ignore_net)
	{
		lmask = (1 << 10) | (1 << 8) | (1 << 21);
		raydir = transform.TransformDirection(movimento);
		tmpbool = Physics.SphereCast(transform.position,ray,raydir,hit,(speed*Time.deltaTime)*1.5,lmask);
		
		if(tmpbool)
		{
			GetComponent(sc_explosao).shooter = shooterobj;
			if(GetComponent(sc_explosao).blow_up("Player",exp_range,shooter,dano,push,false,false,hit.point))
			{if(shooterobj != null){shooterobj.GetComponent(sc_player).add_hitmarker();}}
			
			if(GetComponent(sc_explosao).blow_up("zumbi",exp_range,shooter,dano,push,false,false,hit.point))
			{if(shooterobj != null){shooterobj.GetComponent(sc_player).add_hitmarker();}}
			
			GetComponent(sc_explosao).blow_up("",exp_range,shooter,dano,push,false,true,hit.point);

			if(!ignore_net)
			{
				Network.Instantiate(std_particle,hit.point,Quaternion.LookRotation(hit.normal),3);
				networkView.RPC("endmissile",RPCMode.AllBuffered);
			}
			else
			{	Instantiate(std_particle,hit.point,Quaternion.LookRotation(hit.normal));   endmissile(); }
			
		}
		////////////////////////////////////////////////////
		conter += 100*Time.deltaTime;
		if(conter > 500) 
		{
			networkView.RPC("endmissile",RPCMode.AllBuffered);
		}
	}
	
	if(canmove)
	{
		transform.Translate(movimento);
	}
}

@RPC
function endmissile()
{
	var cont:int = 0;
	while(cont < smokeparticles.Length)
	{
		if(smokeparticles[cont] != null)
		{
			smokeparticles[cont].parent = null;
			smokeparticles[cont].particleSystem.emissionRate = 0;
		}
		cont++;
	}
	Destroy(gameObject);
}

@RPC
function setcanmove()
{
	canmove = true;
}