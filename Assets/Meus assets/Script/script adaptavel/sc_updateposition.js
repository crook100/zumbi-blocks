#pragma strict

var posissao:Vector3;
var posmulti:float = 10;

function Start () 
{
	posissao = transform.position;
}

function Update () {

	transform.Translate((posissao-transform.position)*Time.deltaTime*posmulti,Space.World);
}

@RPC
function updateposition(RPCposition:Vector3)
{
	posissao = RPCposition;
}