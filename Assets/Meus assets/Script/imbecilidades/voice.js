#pragma strict
var state:int = 0;
var conter:float = 0;
var x:int = 323;
var y:int = 232;
var rate:int = 0;
function Start () {
	Microphone.GetDeviceCaps(Microphone.devices[0],x,y);
}

function Update () {
	if(state == 0)
	{
		audio.clip = Microphone.Start(Microphone.devices[0],true, 15, rate);
		state = 1;
	}
	if(state == 1)
	{
		conter += Time.deltaTime;
		if(conter > 10)
		{
			Microphone.End(Microphone.devices[0]);
			audio.Play();
			state = 2;
		}
	}
}

function OnGUI()
{
	var cont:int = 0;
	while(cont < Microphone.devices.Length)
	{
		GUI.Label(Rect(5,5+(30*cont),800,200),Microphone.devices[cont]); 
		cont++;
	}
	
	if(Microphone.IsRecording(Microphone.devices[0]))
	{
		GUI.Label(Rect(5,Screen.height-35,800,200),""+audio.clip.frequency);
	}
}