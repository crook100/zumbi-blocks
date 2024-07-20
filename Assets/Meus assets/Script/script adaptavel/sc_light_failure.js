#pragma strict
var lights:Light[];
var bulb:Renderer[];
var mat:Material[];

var on:boolean = false;
var conter:float = 0;
var rate:float = 1;
var chance:int = 500;
function Start () {

}

function Update () {
	conter += Time.deltaTime*rate;
	
	if(conter > 1)
	{
		if(Random.Range(0,1000) < chance)
		{
			on = !on;
			var cont = 0;
			while(cont < bulb.Length)
			{
				if(on)
				{bulb[cont].material = mat[1];}
				else
				{bulb[cont].material = mat[0];}
				cont++;
			}
			cont = 0;
			while(cont < lights.Length)
			{
				lights[cont].enabled = on;
				cont++;
			}
		}
		conter = 0;
	}
}