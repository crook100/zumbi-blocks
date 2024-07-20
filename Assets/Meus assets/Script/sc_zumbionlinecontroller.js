#pragma strict

var posmulti:float = 10;


var yang:int = 0;
var posissao:Vector3;

function Start () {
	posissao = transform.position;
	if(networkView.isMine){enabled = true;}
}

function LateUpdate ()
{
	var cont:int =0;
	transform.eulerAngles.y = yang;
	transform.Translate((posissao-transform.position)*Time.deltaTime*posmulti,Space.World);
}

@RPC
function setzumbistuff(RPCyang:int,RPCpos:Vector3)
{
	yang = RPCyang;
	posissao = RPCpos;
}