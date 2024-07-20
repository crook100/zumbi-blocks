#pragma strict

var coef:float = 1;
var localpos:Vector3;
var mat:Material;
var dust:ParticleSystem;
var rain:ParticleSystem;
var skycol:Color;
var skycol2:Color;
function Start () {

}

function Update () {
	transform.rotation = Quaternion.identity;
	transform.localPosition = localpos;
	RenderSettings.skybox = mat;
	RenderSettings.fog = true;
	RenderSettings.fogColor = Color.Lerp(skycol2, skycol,coef);
	
	RenderSettings.fogDensity = 0.03*coef;
	mat.SetFloat("_Blend", 1-coef);
	
	rain.emissionRate = 2000*coef;
	if(coef > 0.5)
	{
		dust.emissionRate = 100*(coef-0.5);
	}
	else{
		dust.emissionRate = 0;
	}
}