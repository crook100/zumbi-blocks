#pragma strict

var quantia:float;

function Start () {
}
@RPC
function hurtme(dmg:float)
{	
	if(GetComponent(sc_player) != null)
	{
		GetComponent(sc_player).sec_life -= dmg/2;
	}
	if(GetComponent(sc_zumbi) != null)
	{
		if(GetComponent(sc_zumbi).state != -1)
		{quantia -= dmg;}
		if(GetComponent(sc_zumbi).alvo == null)
		{
			quantia -= dmg*3;
		}
	}
	else{quantia -= dmg;}
}