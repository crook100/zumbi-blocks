#pragma strict
var timeconter:float = 0;
var timecoef:float = 0.5;
var timepasser:float = 0.2;
var sol45:Light;
var solalt:Light;
//var sol225:Light;
var dir:float = 1;
var skymaterial:Material;
var asktime:float = 0;
var speed_sync:float = 0;

var ALday:Color;
var ALnight:Color;

@RPC function asktimer()
{	
	if(Network.isServer)
	{
		networkView.RPC("set_realtime",RPCMode.All,timeconter);
	}
}

@RPC function set_realtime(time:float)
{
	timeconter = time;
}

function Update () {

	if(asktime < 1)
	{
		asktime += 1*Time.deltaTime;
		if(asktime > 1)
		{
			networkView.RPC("asktimer",RPCMode.All);
		}
	}
	timeconter += timepasser*Time.deltaTime;
	if(timeconter > 240)
	{
		timeconter -= 240;
		if(Network.isServer)
		{
			networkView.RPC("set_realtime",RPCMode.All,timeconter);
		}
	}
	if(Network.isServer)
	{
		speed_sync += Time.deltaTime;
		if(speed_sync > 2)
		{
			networkView.RPC("set_realtime",RPCMode.All,timeconter);
			speed_sync = 0;
		}
	}
	if((timeconter >= 0) && (timeconter < 50) )    {timecoef = 0;}
	if((timeconter >= 50)&& (timeconter < 80) )    {timecoef = (timeconter-50)/30*0.7;}
	if((timeconter >= 80)&& (timeconter < 130) )   {timecoef = 0.7+((timeconter-80)/50*0.3);}
	if((timeconter >= 130)&&(timeconter < 180)  )  {timecoef = 1;}
	if((timeconter >= 185)&&(timeconter < 205) )   {timecoef = 1-((timeconter-185)/20);}
	if((timeconter >= 205) && (timeconter <= 240) ){timecoef = 0;}

	if(timecoef < 0){timecoef = 0;}
	if(timecoef > 1){timecoef = 1;}
	sol45.intensity = 0.02+(0.45*timecoef);
	solalt.intensity = 0.15*timecoef;
	RenderSettings.ambientLight = Color.Lerp(ALnight,ALday,timecoef);
	skymaterial.SetFloat("_Blend", timecoef);
}