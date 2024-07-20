#pragma strict

var to_fov:int = 100;
var zoomspeed = 75;
function Start () {
}

function LateUpdate () {
	var me = GetComponent(Camera);
	if(me.fieldOfView < to_fov)
	{
		me.fieldOfView += zoomspeed*Time.deltaTime;
		if(me.fieldOfView > to_fov){me.fieldOfView = to_fov;}
	}
	if(me.fieldOfView > to_fov)
	{
		me.fieldOfView -= zoomspeed*Time.deltaTime;
		if(me.fieldOfView < to_fov){me.fieldOfView = to_fov;}
	}	
}