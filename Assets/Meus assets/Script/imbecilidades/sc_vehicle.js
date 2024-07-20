#pragma strict

var freecontrols:boolean = true;

var vert:float = 0;
var sides:float = 0;
var a:boolean = false;
var d:boolean = false;

var wheels:Transform[];

function Start () {

}

function Update () {

	var cont:int = 0;
	
	if(freecontrols)
	{
		vert = Input.GetAxis("Vertical");
		sides = Input.GetAxis("Horizontal");
	}
	
	cont = 0;
	while(cont < wheels.Length)
	{
		if(wheels[cont].GetComponent(sc_wheel).motorized)
		{
			if(wheels[cont].GetComponent(sc_wheel).thewheel.GetComponent(sc_roda).touching)
			{
				rigidbody.AddForceAtPosition(wheels[cont].right*wheels[cont].GetComponent(sc_wheel).motorforce*vert*Time.deltaTime,wheels[cont].position);
			}
			wheels[cont].localEulerAngles.y = sides*45;
		}
		cont++;
	}
}