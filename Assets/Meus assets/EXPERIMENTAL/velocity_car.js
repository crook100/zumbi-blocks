#pragma strict
var velocity:float;
var car_Object:GameObject;
var scale:float = 0.7;

function Start () {
	
}

function Update () {
	Calculate_Speed();
}
function Calculate_Speed()
{
	velocity = car_Object.rigidbody.velocity.magnitude*scale*3.6;
}
/*function Limit_Speed()
{
	if(velocity > x)
	{
		manter velocidade no limite
	}
}
*/