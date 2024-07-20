#pragma strict

var fallspeed:float = 1;
var conter:float = 0;
var timetofall:float = 400;
var bagprefab:Transform;
var height:float = 0;
function Start () 
{
	if(!networkView.isMine){enabled = false;}
}

function Update () {
	
	var insted:Transform;
	
	transform.Translate(Vector3.down*fallspeed*Time.deltaTime);
	conter += 100*Time.deltaTime;
	if(conter > timetofall)
	{
		insted = Network.Instantiate(bagprefab,transform.position,transform.rotation,1);
		insted.GetComponent(sc_sendpositionupdate).enabled = true;
		insted.GetComponent(sc_updateposition).enabled = false;
		
		Network.Destroy(networkView.viewID);	
	}
}