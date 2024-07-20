#pragma strict

var sendrate:float = 10;
var dataconter:float = 0;
var senddata:boolean = true;

function Start () {

}

function Update () {
	if(senddata)
	{
		dataconter += 1000*sendrate*Time.deltaTime;
		if(dataconter > 1000)
		{
			networkView.RPC("updateposition",RPCMode.Others,transform.position);
			dataconter = 0;
		}
	}
}