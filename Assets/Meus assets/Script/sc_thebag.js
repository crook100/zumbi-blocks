#pragma strict
var matchcontroller:GameObject;
var myprobmin:int = 1;
var myprobmax:int = 8;
var myitemsrand:Transform[];
var myitensprob:int[];
@RPC 
function openbag()
{
	var tmpint2:int = 0;
	var tmpint3:int = 0;
	var insted:Transform;
	var tmptrans:Transform;
	var tmpvec3:Vector3;
	var randomcont:int = 0;
	var cont2:int;
	
	if(networkView.isMine)
	{
		if(matchcontroller == null){matchcontroller = GameObject.Find("matchcontroller(Clone)");}
		if(matchcontroller != null)
		{
			var cont:int = 0;
			while(cont < 7)
			{
				tmpvec3 = Vector3(Random.Range(-0.5f,0.5f),Random.Range(0f,0.5f),Random.Range(-0.5f,0.5f));
					
				tmpint2 = Random.Range(0,myprobmax);
				
				if( tmpint2 < myprobmin)
				{
					tmpint3 = Random.Range(0,matchcontroller.GetComponent(sc_matchcontroller).gamecontrol.GetComponent(sc_gamecontrol).itemtosell.Length);
					tmptrans = matchcontroller.GetComponent(sc_matchcontroller).grounditens[matchcontroller.GetComponent(sc_matchcontroller).gamecontrol.GetComponent(sc_gamecontrol).itemtosell[tmpint3]];
					insted = Network.Instantiate(tmptrans,transform.position+tmpvec3,tmptrans.rotation,5);
					
					insted.GetComponent(sc_updateposition).enabled = false;
					insted.GetComponent(sc_sendpositionupdate).enabled = true;
				}
				else
				{
					randomcont = 0;
					cont2 = 0;
					while(cont2 < myitemsrand.Length)
					{
						randomcont += myitensprob[cont2];
						cont2++;
					}
					tmpint3 = Random.Range(0,randomcont);
					
					randomcont = 0;
					cont2 = 0;
					while(cont2 < myitemsrand.Length)
					{
						if((tmpint3 >= randomcont) && (tmpint3 < randomcont+myitensprob[cont2]))
						{tmpint3 = cont2; break;}
						randomcont += myitensprob[cont2];
						cont2++;
					}
					
					tmpvec3.y += 0.3;
					insted = Network.Instantiate(myitemsrand[tmpint3],transform.position+tmpvec3,myitemsrand[tmpint3].rotation,5);
						
					insted.GetComponent(sc_updateposition).enabled = false;
					insted.GetComponent(sc_sendpositionupdate).enabled = true;
				}
				cont++;
			}
		}
		Network.Destroy(networkView.viewID);
	}
}
function Start () {
}
function Update () {
}