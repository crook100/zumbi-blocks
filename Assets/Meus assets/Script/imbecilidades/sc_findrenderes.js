#pragma strict
var rends:Renderer[];
var cols:Collider[];
var ligt:Light[];

function Start () {
	rends = GameObject.FindObjectsOfType(Renderer);
	cols = GameObject.FindObjectsOfType(Collider);
	ligt = GameObject.FindObjectsOfType(Light);
}