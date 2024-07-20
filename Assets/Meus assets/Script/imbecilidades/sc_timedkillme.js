#pragma strict
var lifetime:float = 2;
var conter:float = 0;
function Start () {
	if(!networkView.isMine)
	{enabled = false;}
}

function Update () {
	if(conter < lifetime)
	{
		conter += 1*Time.deltaTime;
		if(conter >= lifetime)
		{
			networkView.RPC("killmebuffered",RPCMode.AllBuffered);
		}
	}
}