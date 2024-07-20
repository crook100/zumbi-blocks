#pragma strict

var engine:float = 0;
var vertical:float = 0;
var horizontal:float = 0;
var roll:float = 0;
function Start () {
}
function Update () {
	if(Input.GetKey(KeyCode.LeftControl)){engine = -1;}
	if(Input.GetKey(KeyCode.Space)){engine = 1;}
	
	if((!Input.GetKey(KeyCode.LeftControl)) && (!Input.GetKey(KeyCode.Space))){engine = 0;}
	
	vertical = Input.GetAxis("Vertical");
	horizontal = Input.GetAxis("Horizontal");
	
	roll= Input.GetAxis("PlaneRot");
}