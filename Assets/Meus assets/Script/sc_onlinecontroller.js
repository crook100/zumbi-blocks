#pragma strict

var posmulti:float = 10;
var angmulti:float = 5;
var guiskin:GUISkin;
var distmax:float = 1;

var yang:int = 0;
var headang:int = 0;
var posissao:Vector3;
var Rbending:float;

var anglerpcoef:float = 20;

var tmpint:int = 0;
var dist:int = 0;
var tmpfloat:float = 0;	

var armrottype:int = 0;	
function Start () {
	networkView.RPC("asktheplayeranim",RPCMode.All);
	posissao = transform.position;
	if(networkView.isMine){enabled = false;}
}


function LateUpdate ()
{
	if(!GetComponent(sc_player).ap_synced)
	{
		networkView.RPC("ask_aparence",RPCMode.All);
		networkView.RPC("askmyid",RPCMode.All);
	}
	
	if(GetComponent(sc_player).flash.light.enabled == true)
	{
		GetComponent(sc_player).flashconter -= 3000*Time.deltaTime;
		if(GetComponent(sc_player).flashconter <= 0)
		{
			GetComponent(sc_player).flash.light.enabled = false;
		}
	}
	
	var cont:int = 0;
	var tmpfloat:float = 0;
	
	GetComponent(sc_player).bending = Mathf.Lerp(GetComponent(sc_player).bending,Rbending,15*Time.deltaTime);
	
	tmpfloat = anglerpcoef*Time.deltaTime;
	if(tmpfloat > 1){tmpfloat = 1;}
	transform.rotation = Quaternion.Lerp(transform.rotation,Quaternion.Euler(0,yang,0),tmpfloat);
	transform.Translate((posissao-transform.position)*Time.deltaTime*posmulti,Space.World);
	GetComponent(sc_player).headang = Mathf.Lerp(GetComponent(sc_player).headang,headang,tmpfloat);
	
	cont = 0;
	while(cont < GetComponent(sc_player).bendingbones.Length)
	{
		GetComponent(sc_player).bendingbones[cont].Rotate(transform.forward*GetComponent(sc_player).bending,Space.World);
		cont++;
	}
	if(armrottype == 0)
	{
		GetComponent(sc_player).head.transform.Rotate(Vector3(0,0,GetComponent(sc_player).headang));
		
		cont = 0;
		while(cont<GetComponent(sc_player).arms.Length)
		{
			GetComponent(sc_player).arms[cont].RotateAround(GetComponent(sc_player).pivo.position,GetComponent(sc_player).pivo.right, -GetComponent(sc_player).headang);
			cont++;
		}
	}
	if(armrottype == 1)
	{
		GetComponent(sc_player).head.transform.Rotate(Vector3(0,0,GetComponent(sc_player).headang));
	}
}

function OnGUI()
{
	var namepos:Vector3;
	GUI.skin = guiskin;
	GUI.color = Color.green;
	if(GameObject.Find("Main Camera") != null)
	{
		namepos = GameObject.Find("Main Camera").camera.WorldToScreenPoint(Vector3(transform.position.x,transform.position.y+1.6,transform.position.z));
		if(namepos.z > 0)
		{
			tmpint = Vector2.Distance(Vector2(namepos.x,namepos.y),Vector2((Screen.width/2),(Screen.height/2)));
			dist = Vector2.Distance(Vector2(0,0),Vector2((Screen.width/2),(Screen.height/2)))*distmax;
			if(tmpint > dist){tmpint = dist;}
			tmpint = dist-tmpint;
			tmpfloat = tmpint;
			tmpfloat = tmpfloat/dist;
			GUI.color.a = tmpfloat;
			
			GUI.Label(Rect(namepos.x-300,Screen.height-namepos.y,600,40), GetComponent(sc_player).playername);
			GUI.color.a = 1;
		}
	}
}

@RPC
function setrot(type:int)
{
	armrottype = type;
}

@RPC
function setposstuff(RPCyang:int,RPCheadang:int,RPCpos:Vector3,exp:float,expback:float,leanang:float)
{
	Rbending = leanang;
	yang = RPCyang;
	headang = RPCheadang;
	posissao = RPCpos;
	GetComponent(sc_player).exposi = exp;
	GetComponent(sc_player).exposiback = expback;
}