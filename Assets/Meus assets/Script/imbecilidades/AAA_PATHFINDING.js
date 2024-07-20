#pragma strict
var destino:GameObject;
var atual:GameObject;
 
var menorcaminho:int[];
var caminhopos:Vector3[];
var menordist:float = -1;
var menordoornum:float = -1;
var caminhoatual:int[];
var caminhoatualpos:Vector3[];

var achou:boolean = false;
var tmpbool:boolean = true;
var tmpvec3:Vector3;
var tmpint:int = 0;

/*
	cont = quantidade de portas pela qual eu passei
	N = maximo de portas que eu posso passar
*/

function search(area_atual:IA_area,cont:int, N:int, thedist:float, start_pos:Vector3)
{
	var i:int;
	var tmpdist:float;
	area_atual.jahpassei = true;
	
	if(area_atual.gameObject != destino)
	{
		if(cont < N)
	    {
	    	i = 0;
	    	while( (i < area_atual.nexts) && (i < area_atual.next.Length) )
	    	{

	    		if(area_atual.next[i] != null)
	    		if(area_atual.next[i].GetComponent(IA_area)!= null)
	    		if(!area_atual.next[i].GetComponent(IA_area).jahpassei)
	    		{
	    			
	    			
	    			caminhoatual[cont] = i;
	    			tmpvec3 = area_atual.gameObject.transform.position;
	    			tmpint = area_atual.next_dir[i];
	    			
	    			//////////////////////////////////////descobre a posiçao da porta para a proxima area
	    			if(tmpint == 0)
    				{
    					tmpvec3.x += (area_atual.transform.localScale.x/2);
    				}
    				if(tmpint == 1)
    				{
    					tmpvec3.x -= (area_atual.transform.localScale.x/2);
    				}
    				
    				if(tmpint == 2)
    				{
    					tmpvec3.z += (area_atual.transform.localScale.z/2);
    				}
    				if(tmpint == 3)
    				{
    					tmpvec3.z -= (area_atual.transform.localScale.z/2);
    				}
    				
	    			if((tmpint == 0)||(tmpint == 1))
					{
						tmpvec3.z -= (area_atual.transform.localScale.z/2);
						tmpvec3.z += area_atual.next_st[i];
						tmpvec3.z += area_atual.next_siz[i]/2;
					}
					else
					{
						tmpvec3.x -= (area_atual.transform.localScale.x/2);
						tmpvec3.x += area_atual.next_st[i];
						tmpvec3.x += area_atual.next_siz[i]/2;
					}
	    			thedist += Vector3.Distance(start_pos,tmpvec3);
	    			caminhoatualpos[cont] = tmpvec3;
	    			search(area_atual.next[i].GetComponent(IA_area),cont+1,N,thedist,tmpvec3);
	    		}
	    		i++;
	    	}
	    	area_atual.jahpassei = false;
	    	return;
	    }
	    else
	    {
	    	area_atual.jahpassei = false;
	    	return;
	    }
    }
    else
    {
    	thedist = Vector3.Distance(transform.position, caminhoatualpos[0]);
    	while(i < cont-1)
    	{
    		thedist += Vector3.Distance(caminhoatualpos[i], caminhoatualpos[i+1]);
    		i++;
    	}
    	////////////////////////////real
    	achou = true;
    	var tmpfloat;
    	/*atribui*/  
    	if(thedist < menordist)
    	{ 
    		menordist = thedist;
    		menordoornum = cont;
    		i = 0;
	    	while(i < menorcaminho.Length)
	    	{
	    		menorcaminho[i] = caminhoatual[i];
	    		caminhopos[i] = caminhoatualpos[i];
	    		i++;
	    	}
    	}
    	area_atual.jahpassei = false;
    	
    	return;
    }
}
function Update()
{
}