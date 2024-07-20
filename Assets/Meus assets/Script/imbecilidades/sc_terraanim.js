#pragma strict
var conter:float = 0;
var timetokill:float = 4.5;
function Start () {
	GetComponent(Animation).animation["rise2"].speed = 0.8;
	if(!networkView.isMine){enabled = false;}
}
function Update() {
	if(networkView.isMine)
	{
		conter += 100*Time.deltaTime;
		if(conter > timetokill*100)
		{
			networkView.RPC("killmebuffered",RPCMode.AllBuffered);
		}
	}
}
