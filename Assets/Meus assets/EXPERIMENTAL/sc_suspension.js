#pragma strict
var touching:boolean = false;
var trassao:boolean = true;
var rotavel:boolean = false;
var rootcar:GameObject;
var part:ParticleSystem;

function OnTriggerStay (other : Collider)
{
	touching = true;
}
function OnTriggerExit (other : Collider)
{
	touching = false;
}
function Start()
{
}
function Update ()
{
	if(part != null)
	{
		part.startSize = 60;
		if(touching)
		{
			var tmpfloat:float = 0;
			
			tmpfloat = rootcar.GetComponent(velocity_car).velocity/40f;
			if(tmpfloat > 1){tmpfloat = 1;}
			
			part.emissionRate = tmpfloat*20;
		}
		else
		{
			part.emissionRate = 0;
		}
	}
}