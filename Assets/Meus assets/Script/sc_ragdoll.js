#pragma strict

var conter:float = 0;
var lifetime:int = 1000;
var parts:Transform[];
var bodycount:int = 10;
var bodes:GameObject[];

var peles:Transform[];
var skincolor:Material[];
var skin:int = 0;

var camisas:Transform[];
var camisacolor:Material[];
var camisanum:int = 0;
var headmesh:Transform[];
var headpos:Transform;
var bloodfont:ParticleSystem;

var moredelete:boolean = false;
function Start () {
	conter = 0;
	bodes = GameObject.FindGameObjectsWithTag("bode");
	if(bodes.Length > bodycount)
	{
		var rndint:int = Random.Range(0,bodes.Length);
		if(bodes[rndint] == gameObject)
		{
			rndint++;
			if(rndint > bodes.Length-1){rndint = 0;}
		}
		Destroy(bodes[rndint]);
	}
	
	var cont:int = 0;
	while(cont < peles.Length)
	{
		peles[cont].renderer.material = skincolor[skin];
		cont++;
	}
	
	cont = 0;
	while(cont < camisas.Length)
	{
		camisas[cont].renderer.material = camisacolor[camisanum];
		cont++;
	}
}

function Update () {
	conter += 100*Time.deltaTime;
	if(conter > 500)
	{
		bloodfont.emissionRate = 0;
		if(!moredelete)
		{
			bodes = GameObject.FindGameObjectsWithTag("bode");
			if(bodes.Length > bodycount)
			{
				var rndint:int = Random.Range(0,bodes.Length);
				if(bodes[rndint] == gameObject)
				{
					rndint++;
					if(rndint > bodes.Length-1){rndint = 0;}
				}
				Destroy(bodes[rndint]);
			}
		}
	}
	if(conter > lifetime)
	{
		Destroy(gameObject);
	}
}