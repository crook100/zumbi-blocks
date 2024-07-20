#pragma strict
var distmax:float = 0.8;
var guiskin:GUISkin;

var tmpint:int = 0;
var dist:int = 0;
var tmpfloat:float = 0;	

@RPC
function senddeadname(name:String)
{
	GetComponent(sc_deadplayer).playername = name;
}
function Update()
{
	if(!GetComponent(sc_deadplayer).ap_synced)
	{
		networkView.RPC("dead_ask_aparence",RPCMode.All);
	}
}
function OnGUI()
{
	var namepos:Vector3;
	GUI.skin = guiskin;
	GUI.color = Color.red;
	if(GameObject.Find("Main Camera") != null)if(!GetComponent(sc_deadplayer).died)
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
			
			GUI.Label(Rect(namepos.x-300,Screen.height-namepos.y,600,40), GetComponent(sc_deadplayer).playername);
			GUI.color.a = 1;
		}
	}
}