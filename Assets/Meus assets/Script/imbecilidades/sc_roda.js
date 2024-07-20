#pragma strict

var touching:boolean;

function OnCollisionEnter(collision:Collision)
{
	touching = true;
}
function OnCollisionExit(collision:Collision)
{
	touching = false;
}