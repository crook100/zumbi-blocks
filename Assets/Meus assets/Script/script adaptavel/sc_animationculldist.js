#pragma strict

var rends:sc_cull_my_anim[];
var cont:int;
var perframe:int = 50;
var VD:float = 100;

function Start () {
	rends = GameObject.FindObjectsOfType(sc_cull_my_anim);
}

function Update () {

	var c:int = 0;
	while((cont < rends.Length) && (c < perframe))
	{
		if(rends[cont] != null)
		{
			if( Vector3.SqrMagnitude( rends[cont].transform.position-transform.position )*(camera.fieldOfView/70)*(800/Screen.width) > (VD*VD))
			{
				rends[cont].an.enabled = false;
			}
			else
			{
				rends[cont].an.enabled = true;
			}
		}
		cont++;
		c++;
	}
	if(cont >= rends.Length)
	{
		rends = GameObject.FindObjectsOfType(sc_cull_my_anim);
		cont = 0;
	}
}