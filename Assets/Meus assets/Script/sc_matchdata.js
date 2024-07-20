#pragma strict

var wave:int = 0;
var minutes:int = 0;
var seconds:int = 0;
var zombieskilled:int = 0;
var isstarted:boolean = false;
var isended:boolean = false;
var sendrate:float = 2;
var dataconter:float = 0;
var guiskin:GUISkin;
var guiskin2:GUISkin;
var chatskin:GUISkin;
var senddata:boolean = false;
var gamecontrol:Transform;

var chatcolors:Color[];

var themessagecor:int[];
var themessage:String[];
var messages:int = 0;
var mess_cont:float = 0;

var playernames:String[];
var playerpings:int[];
var playerkills:int[];
var playermoneys:int[];
var playeralive:boolean[];
var playersingame:int;

var showhud:boolean = true;

function Start () {
	gamecontrol = GameObject.Find("gamecontroler").transform;
	networkView.RPC("askthewave",RPCMode.Server);
	//gamecontrol.GetComponent(sc_gamecontrol).matchdata = transform;
}

@RPC function askthewave()
{
	networkView.RPC("syncwave",RPCMode.All,wave);
} 
function addmessage(mes:String,cor:int)
{
	mess_cont = 0;
	var cont:int = 0;
	if(messages == themessage.Length)
	{
		erasemessage(0);
		themessagecor[messages] = cor;
		themessage[messages] = mes;
		messages++;
	}
	else
	{
		themessagecor[messages] = cor;
		themessage[messages] = mes;
		messages++;
	}

}
function erasemessage(num:int)
{
	while(num < themessage.Length-1)
	{
		themessage[num] = themessage[num+1];
		themessagecor[num] = themessagecor[num+1];
		num++;
	}
	messages--;
}
function Update () {
	if(senddata)
	{
		dataconter += 1000*Time.deltaTime*sendrate;
		if(dataconter > 1000)
		{
			networkView.RPC("sendstuff",RPCMode.Others,minutes,seconds,zombieskilled,isstarted,isended);
			dataconter -= 1000;
		}
	}
	if(messages > 0)
	{
		mess_cont += 0.1*Time.deltaTime;
		if(mess_cont > 1)
		{
			erasemessage(0);
			mess_cont = 0;
		}
	}
}

function OnGUI()
{
	var tmpmin:String;
	var tmpsec:String;
	var cont:int = 0;
	
	if(showhud)
	{
		tmpmin = ""+minutes;
		
		if(seconds < 10){tmpsec = "0"+seconds;}
		else{tmpsec = ""+seconds;}
		
		GUI.skin = guiskin;
		GUI.color = Color.yellow;
		GUI.Label(Rect((Screen.width/2)-200,10,400,40),tmpmin+":"+tmpsec);
		
		GUI.skin = chatskin;
		GUI.color = Color.white;
		cont = 0;
		while(cont < messages)
		{
			GUI.color = chatcolors[themessagecor[cont]];
			if(cont == 0)
			{GUI.color.a = 1-mess_cont;}
			else{GUI.color.a = 1;}
			GUI.Label(Rect(5,25+(cont*15),500,25),themessage[cont]);
			cont++;
		}
		GUI.color = Color.white;
	}
	/*
	GUI.skin = guiskin2;
	GUI.color = Color.blue;
	GUI.Label(Rect(10,10,400,40),gamecontrol.GetComponent(sc_gamecontrol).language[gamecontrol.GetComponent(sc_gamecontrol).languageset].frase[33]+zombieskilled);
	*/
}

@RPC
function syncwave(thewave:int)
{
	wave = thewave;
}

@RPC
function syncinfo(RPCkills:int[],RPCmoneys:int[],RPCpings:int[],RPCplayers:int)
{
	var cont:int = 0;
	while(cont < RPCplayers)
	{
		playerkills[cont] = RPCkills[cont];
		playerpings[cont] = RPCpings[cont];
		playermoneys[cont] = RPCmoneys[cont];	
		cont++; 
	}
	playersingame = RPCplayers;
}

@RPC
function syncnames(RPCname:String,id:int)
{
	playernames[id] = RPCname;
}

@RPC
function addzombiedeath()
{
	zombieskilled++;
}

@RPC
function sendstuff(RPCminutes:int,RPCseconds:int,RPCzombieskilled:int,RPCisstarted:boolean,RPCisended:boolean)
{
	minutes = RPCminutes;
	seconds = RPCseconds;
	zombieskilled = RPCzombieskilled;
	isstarted = RPCisstarted;
	isended = RPCisended;
}