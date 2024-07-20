#pragma strict
var rends:Renderer[];
var willnotcan:boolean = false;
var can:boolean = false;
var willcan:float = -1;
var mats:Material[];

function OnTriggerStay(other : Collider)
{
	can = false;
	willcan = 0;
}

function Start () {}

function Update () {

	willcan += 1*Time.deltaTime;
	if(willcan > 0.05)
	{
		can = true;
	}

	if(can)
	{
		var cont:int = 0;
		while(cont < rends.Length)
		{
			rends[cont].material = mats[0];
			cont++;
		}
	}
	else
	{
		cont = 0;
		while(cont < rends.Length)
		{
			rends[cont].material = mats[1];
			cont++;
		}
	}
}