#pragma strict

var observator:Transform;
var playerspawn:Transform;
var timecontroler:sc_timecontrol;
var terrain_obj:Terrain;
var terrain_text:int = 50;
var terrain_quality:int = 2;

function Start () {
}
function Update () {
	terrain_obj.basemapDistance = terrain_text;
	terrain_obj.heightmapPixelError = terrain_quality;
}