#pragma strict

var origin:Transform;
var id:int = -1;
var framecount:byte = 0;
var framemax:int = 3;
function OnTriggerEnter(collider:Collider)
{
	origin.GetComponent(sc_gridgen).refs_b[id] = false;
	Destroy(gameObject);
}
function Update () {
	framecount++;
	if(framecount > framemax)
	{
		origin.GetComponent(sc_gridgen).refs_b[id] = true;
		Destroy(gameObject);
	}	
}