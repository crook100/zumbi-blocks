#pragma strict

var helice:Transform;
var backpos:Transform;
var engine:float = 0;
var comp:sc_veicle_control;

var eng_force:float = 100;
function Start ()
{
	comp = GetComponent(sc_veicle_control);
}
function Update ()
{
	engine += comp.engine*Time.deltaTime;
	if(engine > 1){engine = 1;}
	if(engine < 0){engine = 0;}
	
	rigidbody.AddRelativeTorque(Vector3.up*comp.horizontal*2000*Time.deltaTime);
	rigidbody.AddRelativeTorque(Vector3.forward*-comp.vertical*800*Time.deltaTime);
	rigidbody.AddRelativeTorque(Vector3.right*-comp.roll*200*Time.deltaTime);
	
	rigidbody.AddForce(transform.up*engine*eng_force*Time.deltaTime);
}