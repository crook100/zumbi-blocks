#pragma strict
#pragma downcast

var tx:float = 1;
var tz:float = 1;
var qx:int = 10;
var qz:int = 10;
var fab:Transform;
var pivot:Transform;
var pivot2:Transform;
var pivotfab:Transform;
var member_fab:Transform;
var cx:int = 0;
var cz:int = 0;
var step:int = 0;
var stepmax:int = 10;
var refs_b = new Array(false);

var framecont:int = 0;

var gerou:boolean = false;

var areafab:Transform;
var final_area = new Array();

var dolink:boolean;
var linked:boolean;

function Start () {
	
	pivot = Instantiate(pivotfab,transform.position,transform.rotation);
	pivot.name = name+"_P";
	
	var cont = 0;
	while(cont < (qx*qz)-1)
	{
		refs_b.Push(false);
		cont++;
	}
}
function valor_t(x:int,z:int):int
{
	return (x*qx)+z;
}
function group_by_line()
{
	var stx:int; var stz:int;
	var ptx:int; var ptz:int;
	var init:int = 0;
	var endit:int = 0;
	var tvec3:Vector3;
	var insted:Transform;
	
	/*cx = 0;
	while(cx < qx)
	{
		cz = 0;
		while(cz < qz)
		{
			if(refs_b[valor_t(cx,cz)])
			{
				tvec3 = transform.position+(Vector3.right*cx*tx)+(Vector3.forward*cz*tz);
				Debug.DrawLine(tvec3-(Vector3.right*0.2)-(Vector3.forward*0.2),tvec3+(Vector3.right*0.2)-(Vector3.forward*0.2),Color.green,3,false);
				Debug.DrawLine(tvec3-(Vector3.right*0.2)+(Vector3.forward*0.2),tvec3+(Vector3.right*0.2)+(Vector3.forward*0.2),Color.green,3,false);
				Debug.DrawLine(tvec3-(Vector3.right*0.2)-(Vector3.forward*0.2),tvec3-(Vector3.right*0.2)+(Vector3.forward*0.2),Color.green,3,false);
				Debug.DrawLine(tvec3+(Vector3.right*0.2)-(Vector3.forward*0.2),tvec3+(Vector3.right*0.2)+(Vector3.forward*0.2),Color.green,3,false);
			}
			cz++;
		}
		cx++;
	}
	*/
	cx = 0;
	while(cx < qx)
	{
		cz = 0;
		while(cz < qz)
		{
			if(refs_b[valor_t(cx,cz)])
			{
				stx = 0;
				stz = 0;
				var can:boolean;
				var c_lat:int;
				var valid:int = 0;
				
				var could:int = 1;
				while(could == 1)
				{
					could = 0;
					if(cx+stx+1 < qx)
					{
						valid = 0;
						c_lat = 0;
						while(c_lat <= stz)
						{
							if(refs_b[valor_t(cx+stx+1,cz+c_lat)])
							{valid++;}
							c_lat++;
						}
						if(valid == stz+1){stx++;could = 1;}
					}
					
					if(cz+stz+1 < qz)
					{
						valid = 0;
						c_lat = 0;
						while(c_lat <= stx)
						{
							if(refs_b[valor_t(cx+c_lat,cz+stz+1)])
							{valid++;}
							c_lat++;
						}
						if(valid == stx+1){stz++;could = 1;}
					}
					if((stx >= 0)&&( stz >= 0))
					{
						if((stz + 0.2) / (stx+ 0.2) > 2){could = 0;}
						if((stx + 0.2) / (stz+ 0.2) > 2){could = 0;} 
					}		
				}
				
				tvec3 = transform.position+(Vector3.right*cx*tx)+(Vector3.forward*cz*tz);
				
				insted = Instantiate(areafab);
				final_area.Push(insted);
				insted.gameObject.name = "Final_area"+cx+"-"+cz;
				insted.parent = pivot;
				insted.position.y = transform.position.y;
				insted.position.x = transform.position.x+(cx*tx) + ((stx)*tx/2);
				insted.position.z = transform.position.z+(cz*tz) + ((stz)*tz/2);
				
				insted.localScale.x = tx*(stx+1);
				insted.localScale.z = tz*(stz+1);
				
				insted.GetComponent(IA_area).px = cx;
				insted.GetComponent(IA_area).pz = cz;
				insted.GetComponent(IA_area).stx = stx;
				insted.GetComponent(IA_area).stz = stz;
				
				
				
				//Debug.DrawLine(tvec3                            ,tvec3+(Vector3.right*stx*tx)   ,Color.yellow,600,false);
				//Debug.DrawLine(tvec3+(Vector3.forward*stz*tz)   ,tvec3+(Vector3.right*stx*tx)+(Vector3.forward*stz*tz)   ,Color.yellow,600,false);
				//Debug.DrawLine(tvec3                            ,tvec3+(Vector3.forward*stz*tz) ,Color.yellow,600,false);
				//Debug.DrawLine(tvec3+(Vector3.right*stx*tx)     ,tvec3+(Vector3.right*stx*tx)+(Vector3.forward*stz*tz) ,Color.yellow,600,false);
				
				var tmpx:int = cx;
				while(tmpx <= cx+stx)
				{
					var tmpz:int = cz;
					while(tmpz <= cz+stz)
					{
						refs_b[valor_t(tmpx,tmpz)] = false;
						tmpz++;
					}
					tmpx++;
				}
			}
			cz++;
		}
		cx++;
	}
}
function Update () {

	var cont:int = 0;
	var cont2:int = 0;
	var tr1:Transform;
	var tr2:Transform;
	
	step = 0;
	while(cx < qx)
	{
		cz = 0;
		while(cz < qz)
		{
			var insted:Transform = Instantiate(fab,Vector3(transform.position.x + (tx*cx),transform.position.y,transform.position.z + (tz*cz)),transform.rotation);
			insted.GetComponent(sc_griddetect).origin = transform;
			insted.GetComponent(sc_griddetect).id = (cx*qx)+cz;
			insted.parent = pivot;
			insted.gameObject.name = transform.name + "_det_" + cx + "_" + cz;
			insted.localScale.x = tx;
			insted.localScale.z = tz;
			cz++;
		}
		cx++;
		step++;
		if(step > stepmax){break;}
	}
	if(cx >= qx)if(!gerou)
	{
		framecont++;
		if(framecont > 15)
		{
			group_by_line(); gerou = true;
		}
	}
	
	if(gerou)
	{
		if(!linked)
		{
			if(dolink)
			{
				cont = 0;
				while(cont < final_area.length)
				{
					tr1 = final_area[cont];
					cont2 = 0;
					while(cont2 < final_area.length)
					{
						tr2 = final_area[cont2];
						if(tr1 != tr2)
						{
							if(tr1.GetComponent(IA_area).nexts < tr1.GetComponent(IA_area).next.Length)
							{
								if(tr1.GetComponent(IA_area).px+tr1.GetComponent(IA_area).stx+1 == tr2.GetComponent(IA_area).px )
								{
									if( (tr1.GetComponent(IA_area).pz <= tr2.GetComponent(IA_area).pz+tr2.GetComponent(IA_area).stz)
									&&  (tr1.GetComponent(IA_area).pz+tr1.GetComponent(IA_area).stz >= tr2.GetComponent(IA_area).pz)  )
									{
										tr1.GetComponent(IA_area).next[tr1.GetComponent(IA_area).nexts] = tr2;
										tr1.GetComponent(IA_area).next_dir[tr1.GetComponent(IA_area).nexts] = 0; ////direita
										
										////////////////Start
										tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] =  tr2.GetComponent(IA_area).pz-tr1.GetComponent(IA_area).pz;
										if(tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] < 0)
										{tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] = 0;}
										
										///////////////Tamanho
										
										tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] =  tr2.GetComponent(IA_area).pz+tr2.GetComponent(IA_area).stz-tr1.GetComponent(IA_area).pz+1-tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts];
										if(tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts]+tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] > tr1.GetComponent(IA_area).stz+1)
										{
											tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] = tr1.GetComponent(IA_area).stz+1-tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts];
										}
										
										tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] *= tz;
										tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] *= tz;
										
										//////////////////////////////////////////////////////////////////////////////////////
										
										tr1.GetComponent(IA_area).nexts++;
									}
								}
								
								if(tr1.GetComponent(IA_area).px-1 == tr2.GetComponent(IA_area).px+tr2.GetComponent(IA_area).stx )
								{
									if( (tr1.GetComponent(IA_area).pz <= tr2.GetComponent(IA_area).pz+tr2.GetComponent(IA_area).stz)
									&&  (tr1.GetComponent(IA_area).pz+tr1.GetComponent(IA_area).stz >= tr2.GetComponent(IA_area).pz)  )
									{
										tr1.GetComponent(IA_area).next[tr1.GetComponent(IA_area).nexts] = tr2;
										tr1.GetComponent(IA_area).next_dir[tr1.GetComponent(IA_area).nexts] = 1;  ///esquerda
										
										////////////////Start
										tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] =  tr2.GetComponent(IA_area).pz-tr1.GetComponent(IA_area).pz;
										if(tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] < 0)
										{tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] = 0;}
										
										///////////////Tamanho
										
										tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] =  tr2.GetComponent(IA_area).pz+tr2.GetComponent(IA_area).stz-tr1.GetComponent(IA_area).pz+1-tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts];
										if(tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts]+tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] > tr1.GetComponent(IA_area).stz+1)
										{
											tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] = tr1.GetComponent(IA_area).stz+1-tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts];
										}
										
										tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] *= tz;
										tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] *= tz;
										
										//////////////////////////////////////////////////////////////////////////////////////
										
										tr1.GetComponent(IA_area).nexts++;
									}
								}
								
								if(tr1.GetComponent(IA_area).pz+tr1.GetComponent(IA_area).stz+1 == tr2.GetComponent(IA_area).pz )
								{
									if( (tr1.GetComponent(IA_area).px <= tr2.GetComponent(IA_area).px+tr2.GetComponent(IA_area).stx)
									&&  (tr1.GetComponent(IA_area).px+tr1.GetComponent(IA_area).stx >= tr2.GetComponent(IA_area).px)  )
									{
										tr1.GetComponent(IA_area).next[tr1.GetComponent(IA_area).nexts] = tr2;
										tr1.GetComponent(IA_area).next_dir[tr1.GetComponent(IA_area).nexts] = 2;  /// cima
										
										////////////////Start
										tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] =  tr2.GetComponent(IA_area).px-tr1.GetComponent(IA_area).px;
										if(tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] < 0)
										{tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] = 0;}
										
										///////////////Tamanho
										
										tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] =  tr2.GetComponent(IA_area).px+tr2.GetComponent(IA_area).stx-tr1.GetComponent(IA_area).px+1-tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts];
										if(tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts]+tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] > tr1.GetComponent(IA_area).stx+1)
										{
											tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] = tr1.GetComponent(IA_area).stx+1-tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts];
										}
										
										tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] *= tx;
										tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] *= tx;
										
										//////////////////////////////////////////////////////////////////////////////////////
										
										tr1.GetComponent(IA_area).nexts++;
									}
								}
								
								if(tr1.GetComponent(IA_area).pz-1 == tr2.GetComponent(IA_area).pz+tr2.GetComponent(IA_area).stz )
								{
									if( (tr1.GetComponent(IA_area).px <= tr2.GetComponent(IA_area).px+tr2.GetComponent(IA_area).stx)
									&&  (tr1.GetComponent(IA_area).px+tr1.GetComponent(IA_area).stx >= tr2.GetComponent(IA_area).px)  )
									{
										tr1.GetComponent(IA_area).next[tr1.GetComponent(IA_area).nexts] = tr2;
										tr1.GetComponent(IA_area).next_dir[tr1.GetComponent(IA_area).nexts] = 3;  /// baixo
										
										////////////////Start
										tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] =  tr2.GetComponent(IA_area).px-tr1.GetComponent(IA_area).px;
										if(tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] < 0)
										{tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] = 0;}
										
										///////////////Tamanho
										
										tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] =  tr2.GetComponent(IA_area).px+tr2.GetComponent(IA_area).stx-tr1.GetComponent(IA_area).px+1-tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts];
										if(tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts]+tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] > tr1.GetComponent(IA_area).stx+1)
										{
											tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] = tr1.GetComponent(IA_area).stx+1-tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts];
										}
										
										tr1.GetComponent(IA_area).next_st[tr1.GetComponent(IA_area).nexts] *= tx;
										tr1.GetComponent(IA_area).next_siz[tr1.GetComponent(IA_area).nexts] *= tx;
										
										//////////////////////////////////////////////////////////////////////////////////////
										
										tr1.GetComponent(IA_area).nexts++;
									}
								}
							}
						}
						cont2++;
					}
					cont++;
				}
				linked = true;
			}
		}
	}
}