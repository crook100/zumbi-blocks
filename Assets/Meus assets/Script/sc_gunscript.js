#pragma strict
var hidemagonoutammo:boolean = false;
var isbazuka:boolean = false;
var crosshair:boolean = true;
var basher:boolean = false;
var meshtohide:Renderer[];
var hidemesh:boolean = false;
var timetohide:float = 0;
var clipinsound:Transform;
var clipoutsound:Transform;
var backaim:Transform;
var output:Transform;
var RFS:boolean = true;
var conter:float = 0;
var rangeofexp:float = 6; 
var force:int = 100;           /*bulletspeed*/
var add_fov:float = 20;
var add_ypos:float = 0;
var dano:float = 5;
var noisemaker:float = 100;
var pushforce:float = 5;
var rate:float = 4;
var auto:boolean = true;
var doflash:boolean = true;
var bullets:int = 1;
var spread:float = 5;
var addspread:float = 0;
var adc_fov = 20;
var gravity:float = 0;
var scope:Texture;
var V_rec:float;
var H_rec:float;
var maxammo:int = 0;
var receiverammo:int = 0;
var shotanim:String;
var shotanimspeed:float;

var zoomshotanim:String;
var zoomshotanimspeed:float;

var animatedmesh:Transform;
var reloadamount:int = 0;

var gunshotanim:String = "null";
var gunshotanimspeed:float = 1;

var reloadanimST:String;
var reloadanimSTspeed:int = 1;
var reloadanimEND:String;
var reloadanimENDspeed:int = 1;
var aimanim:String;
var idleanim:String;

var reloadgrabanim:String;
var reloadputanim:String;

var reloadendtime:int = 0;
var reloadrestarttime:int = 0;

var grabtime:int = 0;
var puttime:int = 0;

var releasemoment:int = 0;
var grabmoment:int = 0;
var putmoment:int = 0;

var backpos:Transform;
var magmesh:Transform;
var magprefab:Transform;
var bulletprefab:Transform;
var muzleprefab:Transform;

var flyerpos:Transform;
var flyngbullet_fab:Transform;

function Start () {
}

function Update () {
	if(!RFS)
	{
		conter+= 1000*Time.deltaTime;
		if(conter > (1000/rate)){RFS = true;conter =0;}
	}
}