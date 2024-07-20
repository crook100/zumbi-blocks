#pragma strict
var blood_particle:Transform;
var shooter:Transform;
function blow_up(tegui:String,ranger:float,shooterid:int,dano:int,push:float,pvp:boolean,ISCMP:boolean, pos:Vector3):boolean
{
	var tmpfloat2:float;
	var tmpfloat:float;
	var lmask:LayerMask;
	var hit:RaycastHit;
	var b:boolean = false;
	var cont:int = 0;
	var masbool:boolean;
	if(ISCMP)
	{
		var alvoCMP:sc_dmg_on_explosion[] = GameObject.FindObjectsOfType(sc_dmg_on_explosion);
		cont = 0;
		while(cont < alvoCMP.Length)
		{
			tmpfloat2 = Vector3.Distance(alvoCMP[cont].transform.position,pos);

			lmask = (1 << 8);
			masbool = Physics.Raycast(pos,alvoCMP[cont].transform.position-pos,hit,tmpfloat2+0.05,lmask);
			
			if(masbool)
			{
				if(hit.collider.gameObject == alvoCMP[cont].gameObject)
				{masbool = false;}
				if(hit.collider.gameObject.GetComponent(sc_ignore_explosion_collider))
				if(hit.collider.gameObject.GetComponent(sc_ignore_explosion_collider).target == alvoCMP[cont].gameObject)
				{masbool = false;}
			}
			
			tmpfloat = ranger-tmpfloat2;
			tmpfloat /= ranger;
			
			if(tmpfloat < 0){tmpfloat = 0;}
			if(tmpfloat > 0)
			{	
				if(!masbool)
				{
					alvoCMP[cont].target.quantia -= dano*tmpfloat*alvoCMP[cont].multi;
				}
			}
			cont++;
		}
	}
	else
	{
		var alvoobj:GameObject[] = GameObject.FindGameObjectsWithTag(tegui);
		cont = 0;
		while(cont < alvoobj.Length)
		{
			tmpfloat2 = Vector3.Distance(alvoobj[cont].transform.position,pos);
			lmask = (1 << 8);
			masbool = Physics.Raycast(pos,alvoobj[cont].transform.position-pos,hit,tmpfloat2+0.05,lmask);
			if(masbool)if(hit.collider.gameObject == alvoobj[cont])
			{masbool = false;}
			
			tmpfloat = (ranger*2.5)-tmpfloat2;
			tmpfloat /= (ranger*2.5);
			if(tmpfloat < 0){tmpfloat = 0;}
			if(tmpfloat > 0)
			{
				if(alvoobj[cont].GetComponent(sc_player) != null)
				{
					alvoobj[cont].GetComponent(sc_player).stun_me(20*tmpfloat);
					alvoobj[cont].networkView.RPC("stun_me",RPCMode.Others,20*tmpfloat);
				}
			}
			
			tmpfloat = ranger-tmpfloat2;
			tmpfloat /= ranger;
			if(tmpfloat < 0){tmpfloat = 0;}
			if(tmpfloat > 0)
			{	
				if(!masbool)
				{
					b = true;
					if(alvoobj[cont].GetComponent(sc_zumbi) != null)
					{
						
						if(alvoobj[cont].GetComponent(sc_zumbi).state != -1)
						{
							alvoobj[cont].GetComponent(sc_life).quantia -= dano*tmpfloat;
							alvoobj[cont].networkView.RPC("hurtme",RPCMode.Others,dano*tmpfloat);
						
							alvoobj[cont].GetComponent(sc_zumbi).setkillerid(shooterid);
							alvoobj[cont].networkView.RPC("setkillerid",RPCMode.Server,shooterid);
							alvoobj[cont].networkView.RPC("forcar",RPCMode.All,(alvoobj[cont].transform.position-pos)*60*push*tmpfloat);
						}
					}
					if(alvoobj[cont].GetComponent(sc_player) != null)
					{
						if(pvp)
						{
							alvoobj[cont].networkView.RPC("spillblood",RPCMode.All);
							alvoobj[cont].GetComponent(sc_life).quantia -= dano*tmpfloat;
							alvoobj[cont].GetComponent(sc_player).sec_life -= dano*tmpfloat/2;
							alvoobj[cont].networkView.RPC("hurt2",RPCMode.Others,dano*tmpfloat);
							alvoobj[cont].networkView.RPC("hurtme",RPCMode.Others,dano*tmpfloat);
						}
						else
						{
							if(shooter == alvoobj[cont].transform)
							{
								alvoobj[cont].networkView.RPC("spillblood",RPCMode.All);
								alvoobj[cont].GetComponent(sc_life).quantia -= dano*tmpfloat;
								alvoobj[cont].GetComponent(sc_player).sec_life -= dano*tmpfloat/2;
								alvoobj[cont].networkView.RPC("hurt2",RPCMode.Others,dano*tmpfloat);
								alvoobj[cont].networkView.RPC("hurtme",RPCMode.Others,dano*tmpfloat);
							}
						}
					}
					
					Network.Instantiate(blood_particle,alvoobj[cont].transform.position,Quaternion.LookRotation(alvoobj[cont].transform.position-pos),3);
				}
			}
			cont++;
		}
	}
	return b;
}