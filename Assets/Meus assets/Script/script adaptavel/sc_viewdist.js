#pragma strict

var rends:Renderer[];
var cont:int;
var perframe:int = 50;
var VD:float = 100;

var esp_v_dist:int[];
var esp_v_fog:float[];
var esp_v:int = -1;

var mincol:Color;
var maxcol:Color;

var coef:float;

function Start () {
	rends = GameObject.FindObjectsOfType(Renderer);
}

function Update () {
	if(esp_v >= 0)
	{
		VD = esp_v_dist[esp_v];
		RenderSettings.fog = true;
		RenderSettings.fogDensity = esp_v_fog[esp_v];
		RenderSettings.fogColor = Color.Lerp(mincol,maxcol,coef);
	}
	else
	{
		RenderSettings.fog = false;
	}
	var c:int = 0;
	while((cont < rends.Length) && (c < perframe))
	{
		if(rends[cont] != null)
		{
			if(rends[cont].gameObject.GetComponent(sc_ignoreVD) == null)
			{
				if( Vector3.SqrMagnitude( rends[cont].transform.position-transform.position ) > (VD*VD))
				{
					rends[cont].enabled = false;
				}
				else
				{
					rends[cont].enabled = true;
				}
			}
		}
		cont++;
		c++;
	}
	if(cont >= rends.Length)
	{
		rends = GameObject.FindObjectsOfType(Renderer);
		cont = 0;
	}
}