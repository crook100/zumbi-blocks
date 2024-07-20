#pragma strict

var speed:float = 300;
var dano:float = 5;
var push:float = 5;
var grav:float = 0;
var vy:float = 0;
var conter:float = 0;
var canmove:boolean = false;
var std_particle:Transform;
var shooter:int = -1;
var shooterobj:Transform;
var piercing:int = 0;
var lasthit:Transform;

function Start () {
}

function Update () {
	var raydir:Vector3;
	var movimento:Vector3;
	var lmask:LayerMask;
	var tmpbool:boolean = false;
	var hit:RaycastHit;
	var auxbool:boolean = false;
	var tmp_mov:Vector3;
	
	vy -= grav*Time.deltaTime;
	
	movimento.x = speed;
	movimento *= Time.deltaTime;
	
	tmp_mov = transform.TransformDirection(movimento);
	tmp_mov.y += vy*Time.deltaTime;
	
	if(networkView.isMine)
	{
		lmask = (1 << 10) | (1 << 8) | (1 << 21);
		raydir = transform.TransformDirection(movimento);
		tmpbool = Physics.Raycast(transform.position,raydir,hit,(tmp_mov.magnitude)*1.5,lmask);
		
		if(tmpbool)
		{
			auxbool = true;
			//GameObject.Find("lucci").transform.position = hit.point;
			if(hit.collider.gameObject.GetComponent(sc_dmgtaker) != null)if(hit.collider.transform != lasthit)
			{
				if(hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_zumbi) != null)
				{
					auxbool = false;
					if(hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_zumbi).state != -1)
					{
						hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("setkillerid",RPCMode.All,shooter);
						//hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_life).quantia -= dano;
						hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_life).hurtme(dano);
						hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("hurtme",RPCMode.Others,dano);
						hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("forcar",RPCMode.All,transform.right*60*push);
						
						if(hit.collider.gameObject.GetComponent(sc_dmgtaker).partid == 1)
						{
							//hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_zumbi).headlife -= dano;
							hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("hurthead",RPCMode.Others,dano);
							hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_zumbi).hurthead(dano);
						}
					}
				}
				else if(hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_player) != null)
				{
					auxbool = false;
					hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("spillblood",RPCMode.All);
				}
				else
				{
					hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.networkView.RPC("hurtme",RPCMode.Others,dano);
					hit.collider.gameObject.GetComponent(sc_dmgtaker).owner.GetComponent(sc_life).hurtme(dano);
				}
				if(shooterobj != null){shooterobj.GetComponent(sc_player).add_hitmarker();}
			}
			if(hit.collider.gameObject.GetComponent(sc_particula) != null)
			{
				Network.Instantiate(hit.collider.gameObject.GetComponent(sc_particula).prefab,hit.point,Quaternion.LookRotation(hit.normal),3);
			}
			else
			{
				Network.Instantiate(std_particle,hit.point,Quaternion.LookRotation(hit.normal),3);
			}
			
			/*if(!auxbool)
			{
				lasthit = hit.collider.transform;
				Debug.Log("Trepassed "+Random.Range(0,100));
				transform.position = hit.point;
			}
			else
			{}*/
			
			networkView.RPC("killmebuffered",RPCMode.AllBuffered);
		}
		
		////////////////////////////////////////////////////
		conter += 100*Time.deltaTime;
		if(conter > 350)
		{
			networkView.RPC("killmebuffered",RPCMode.AllBuffered);
		}
	}
	
	if(canmove)
	{
		transform.Translate(tmp_mov,Space.World);
	}
}

@RPC
function setcanmove()
{
	canmove = true;
}