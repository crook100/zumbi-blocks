#pragma strict
var leftright:Transform[];
var wheel:Transform[];
var suspension:Transform[];
var controled:boolean = true;
var startimpulse:Vector3 = Vector3.zero;
var startimpulseglobal:Vector3 = Vector3.zero;
var speedcoef:float = 0;
var maxvel:float = 100;
var fricperwheel:float = 0.2;
var Fmaterial:PhysicMaterial;

function Start () {
	rigidbody.AddForce(transform.TransformDirection(startimpulse),ForceMode.Impulse);
	rigidbody.AddForce(startimpulseglobal,ForceMode.Impulse);
}
function Update () {
	var cont:int = 0;
	
	if(controled)
	{
		cont = 0;
		while(cont < wheel.Length)
		{
			if(wheel[cont].GetComponent(sc_suspension).touching)
			{				
				if(wheel[cont].GetComponent(sc_suspension).trassao)
				{
					rigidbody.AddForce(wheel[cont].forward*1*Input.GetAxis("Vertical"));
				}
			}
			cont++;
		}
		
		cont = 0;
		while(cont < suspension.Length)
		{
			if(Input.GetAxis("Horizontal") < 0)
			{
				suspension[cont].rotation = Quaternion.Lerp(suspension[cont].rotation,leftright[0].rotation,3*Time.deltaTime);
			}
			if(Input.GetAxis("Horizontal") > 0)
			{
				suspension[cont].rotation = Quaternion.Lerp(suspension[cont].rotation,leftright[1].rotation,3*Time.deltaTime);
			}
			if(Input.GetAxis("Horizontal") == 0)
			{
				suspension[cont].rotation = Quaternion.Lerp(suspension[cont].rotation,leftright[2].rotation,3*Time.deltaTime);
			}
			cont++;
		}
	}
}