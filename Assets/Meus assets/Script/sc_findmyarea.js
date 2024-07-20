#pragma strict
var myarea:GameObject;
var realarea:GameObject;
function Start () {
	if(!Network.isServer)
	{enabled = false;}
}

function Update () {

	var hit:RaycastHit;
	var lmask:LayerMask;
	
	lmask = 1 << 25;
	if(Physics.Raycast(transform.position,Vector3.down,hit,1.4,lmask))
	{
		if(hit.collider.GetComponent(IA_area) != null)
		{
			myarea = hit.collider.gameObject;
			realarea = hit.collider.gameObject;
		}
		else if(hit.collider.GetComponent(sc_fakearea) != null) 
		{
			myarea = hit.collider.GetComponent(sc_fakearea).real;
			realarea = hit.collider.GetComponent(sc_fakearea).real;
		}
		else
		{
			realarea = null;
		}
	}
	else
	{
		realarea = null;
	}
}