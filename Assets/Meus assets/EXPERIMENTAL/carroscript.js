#pragma strict
var carname:String;
var tmpobj:Transform;
var rodas:Transform[];
var eixo:Transform[];
var eixo_inv:Transform[];
var roda_f:float[];
var f_multiplier:float;
var dragcoef:float;
var carrotriger:Transform;
var def_drag:float;
var def_rot_drag:float;
var dragmin:float;

var reset_cont:float = 0;
var touched:boolean;
var dirs:Transform[];

var rotcoef:float = 0;
var rotcoef2:float = 0;
var maxvel:float = 50;
var rotforce:float = 100;

var controled:boolean = false;

var last_forward:Vector3;

var Air_rot:float = 10;
var cam_add_pos:Vector3;
var thecam:Transform;

var magnet_maxpos:float;
var magnet_force:float;

var cam_type:int = 0;

var myorigin:Transform;
var CP_num:int = 0;
var ID:int = 0;
var laps:int = 1;
var lapsmax:int = 3;

var velmag:float = 0;
var cpmax:float = 30;

var hangtime:float = 0;
var lastCP:Transform;
var resetCP_cont:float = 0;
var wrongway:boolean = false;

var timed:boolean = false;
var timer:float = 0;
var last_timer:float = -1;

var locked:boolean;
var locker:Transform;

var marcha:int;
var marchas:float[];
var marcha_multi:float[];

function Start () 
{
}

function Update () {
	if(timed){timer += Time.deltaTime;}
	
	if(CP_num >= cpmax)
	{
		CP_num = 0;
		laps++;
		last_timer = timer;
		timer = 0;
	}
	velmag = rigidbody.velocity.magnitude;
	var lmask:LayerMask;
	var hit:RaycastHit;
	
	cam_add_pos = Vector3.Lerp(cam_add_pos,rigidbody.velocity,Time.deltaTime);
	
	var cont:int = 0;
	var tmpvec3_2:Vector3;
	
	rigidbody.drag = 0;
	rigidbody.angularDrag = 0;
	
	var tmpvec3:Vector3;
	tmpvec3 = transform.InverseTransformPoint(transform.position+rigidbody.velocity);
	tmpvec3 = tmpvec3.normalized;
	dragcoef = 1-(Mathf.Abs(tmpvec3.x)*dragmin);
	
	if(Input.GetKey(KeyCode.Space))if(controled)
	{
		dragcoef = 1-dragcoef;
	}
	
	marcha = marchas.Length-1;
	cont = marchas.Length-2;
	while(cont >= 0)
	{
		if( GetComponent(velocity_car).velocity < marchas[cont])
		{marcha = cont;}
		cont--;
	}
	
	rotcoef2 = velmag/maxvel;
	if(rotcoef2 > 1){rotcoef2 = 1;}
	
	touched = false;
	cont = 0;
	while(cont < rodas.Length)
	{
		/*
		lmask = 1 << 0;
		if(Physics.Raycast(rodas[cont].position,rodas[cont].forward,hit,2.3+magnet_maxpos,lmask))
		{
			var tmpfloat:float = magnet_maxpos/(hit.distance-2.3);
			if(tmpfloat < 0){tmpfloat = 0;}
			if(tmpfloat > 1){tmpfloat = 1;}
			
			rigidbody.AddForceAtPosition(rodas[cont].forward*tmpfloat*magnet_force/rodas.Length,rodas[cont].position,ForceMode.Impulse);
		}*/
		
		if(rodas[cont].GetComponent(sc_suspension).touching)
		{
			if(controled)
			{
				if(Input.GetAxis("Vertical") > 0)
				{   rigidbody.AddForce(rodas[cont].right*roda_f[cont]*Time.deltaTime*Input.GetAxis("Vertical")*f_multiplier    *marcha_multi[marcha],ForceMode.Impulse);   }
				else
				{   rigidbody.AddForce(rodas[cont].right*roda_f[cont]*Time.deltaTime*Input.GetAxis("Vertical")*0.5*f_multiplier*marcha_multi[marcha],ForceMode.Impulse);}
			}
			
			rigidbody.drag += def_drag/rodas.Length*dragcoef;
			rigidbody.angularDrag += def_rot_drag/rodas.Length*dragcoef;
			touched = true;
		}
		if(rodas[cont].GetComponent(sc_suspension).rotavel)
		{
			if(controled)
			{
				if(Input.GetAxis("Horizontal") > 0.9)
				{
					eixo[cont].rotation = Quaternion.Lerp(eixo[cont].rotation,dirs[0].rotation,25*Time.deltaTime);
				}
				if(Input.GetAxis("Horizontal") < -0.9)
				{
					eixo[cont].rotation = Quaternion.Lerp(eixo[cont].rotation,dirs[1].rotation,25*Time.deltaTime);
				}
				if((Input.GetAxis("Horizontal") > -0.9)&&(Input.GetAxis("Horizontal") < 0.9))
				{
					eixo[cont].rotation = Quaternion.Lerp(eixo[cont].rotation,dirs[2].rotation,25*Time.deltaTime);
				}
			}
			if(rodas[cont].GetComponent(sc_suspension).touching)
			{
				tmpvec3_2 = transform.InverseTransformPoint(transform.position+eixo[cont].up);
				tmpvec3_2 = tmpvec3_2.normalized;
				rotcoef = -tmpvec3_2.x;
				
				//rigidbody.AddTorque(Vector3.up*rotcoef*rotcoef2*rotforce*Time.deltaTime*-1.5,ForceMode.Impulse);
				var multi_r:float = 1;
				if(Input.GetKey(KeyCode.Space)){multi_r = 2;}
				if(tmpvec3.x > 0)
				{
					rigidbody.AddForceAtPosition(transform.forward*rotforce*multi_r*Time.deltaTime*rotcoef*rotcoef2,eixo[cont].position,ForceMode.Impulse);
					rigidbody.AddForceAtPosition(-transform.forward*rotforce*multi_r*Time.deltaTime*rotcoef*rotcoef2,eixo_inv[cont].position,ForceMode.Impulse);
				}
				else
				{
					rigidbody.AddForceAtPosition(-transform.forward*rotforce*multi_r*Time.deltaTime*rotcoef*rotcoef2,eixo[cont].position,ForceMode.Impulse);
					rigidbody.AddForceAtPosition(transform.forward*rotforce*multi_r*Time.deltaTime*rotcoef*rotcoef2,eixo_inv[cont].position,ForceMode.Impulse);
				}
			}
		}
		cont++;
	}
	
	if(carrotriger.GetComponent(sc_suspension).touching)
	{
		rigidbody.drag = def_drag*dragcoef;
		rigidbody.angularDrag = def_rot_drag*dragcoef;
		touched = true;
	}
	
	//rigidbody.AddTorque(-transform.right*Air_rot*Time.deltaTime*Input.GetAxis("Stunt_Horizontal")*4,ForceMode.Impulse);
	if(!touched)
	{
		if(controled)
		{
			rigidbody.AddTorque(Vector3.up*Air_rot*Time.deltaTime*Input.GetAxis("Horizontal"),ForceMode.Impulse);
			//rigidbody.AddTorque(Vector3.right*Air_rot*Time.deltaTime*Input.GetAxis("Stunt_Horizontal")*2,ForceMode.Impulse);
			//rigidbody.AddTorque(Vector3.forward*Air_rot*Time.deltaTime*Input.GetAxis("Stunt_Vertical")*5,ForceMode.Impulse);
		}
		hangtime += Time.deltaTime*20;
	}
	else
	{
		hangtime = 0;
	}
	
	if(touched)if(transform.up.y > 0.4)
	{
		last_forward = transform.forward;
	}
	if(touched)if(reset_cont < 3)if(transform.up.y < 0.2)
	{
		reset_cont += Time.deltaTime;
	}
	if(reset_cont >= 3)
	{
		
		if(Input.GetKeyDown(KeyCode.R))if(controled)
		{
			reset_cont = 0;
			resetCP_cont = 0;
			transform.position.y += 6;
			transform.rotation = Quaternion.LookRotation(Vector3(last_forward.x,0,last_forward.z),Vector3.up);
			
			rigidbody.velocity*=0.1;
			rigidbody.angularVelocity*=0.1;
		}
	}
	
	if(resetCP_cont < 2)
	{
		resetCP_cont += Time.deltaTime;
	}
	if(resetCP_cont >= 2)
	{
		
		if(Input.GetKeyDown(KeyCode.T))if(controled)
		{
			reset_cont = 0;
			resetCP_cont = 0;
			transform.position = lastCP.position;
			transform.rotation = lastCP.rotation;
			wrongway = false;
			lmask = 1 << 0;
			if(Physics.Raycast(lastCP.position,Vector3.down,hit,1000,lmask))
			{
				transform.position = hit.point;
				transform.position.y += 10;
				transform.rotation = lastCP.rotation;
			}
			else
			{
				transform.position = lastCP.position;
				transform.rotation = lastCP.rotation;
			}
			rigidbody.velocity*=0.1;
			rigidbody.angularVelocity*=0.1;
		}
	}
	if(locked)
	{
		transform.position.x = locker.position.x;
		transform.position.z = locker.position.z;
		
		rigidbody.velocity.x = 0;
		rigidbody.velocity.z = 0;
		
		transform.rotation = locker.rotation;
		
		timer = 0;
	}
}

function LateUpdate()
{
	if(thecam != null)
	{
		if(controled)if(Input.GetKeyDown(KeyCode.C))
		{
			cam_type++;
			if(cam_type > 3)
			{
				cam_type = 0;
			}
		}
		var tmpvec3:Vector3;
		
		if(cam_type == 0)
		{
			tmpvec3 = transform.right*15;
			tmpvec3.y *= 0.7;
			thecam.position = transform.position-tmpvec3+(Vector3.up*4)-(cam_add_pos*0.1);
			thecam.LookAt(transform.position);
		}
		if(cam_type == 1)
		{
			tmpvec3 = transform.right*15;
			thecam.position = transform.position-tmpvec3+(Vector3.up*4)-(cam_add_pos*0.1);
			
			thecam.rotation = transform.rotation;
			thecam.Rotate(Vector3.up*90);
		}
		if(cam_type == 2)
		{
			tmpvec3 = transform.right*30;
			thecam.position = transform.position-tmpvec3+(Vector3.up*7)-(cam_add_pos*0.2);
			
			thecam.rotation = transform.rotation;
			thecam.Rotate(Vector3.up*90);
		}
		
		if(cam_type == 3)
		{
			thecam.position = transform.position-tmpvec3+(transform.right*3);
			thecam.rotation = transform.rotation;
			thecam.Rotate(Vector3.up*90);
		}
		
	}
}

function OnGUI()
{
	GUI.color = Color.white;
	var tmpint:int = GetComponent(velocity_car).velocity;
	GUI.Label(Rect(10,Screen.height-30,200,20),tmpint.ToString()+" Km/h");
	
	tmpint = 100*(CP_num/ cpmax);
	GUI.Label(Rect(10,Screen.height-55,200,20),"Progresso = "+tmpint.ToString()+"%");
	
	GUI.Label(Rect(10,Screen.height-80,200,20),"LAP "+laps+"/"+lapsmax);
	
	if(hangtime > 5)
	{
		tmpint = hangtime;
		GUI.Label(Rect(10,Screen.height-105,200,20),"HangTime = "+tmpint);
	}
	GUI.Label(Rect(10,Screen.height-105,200,20),"LapTime = "+timer.ToString("F2"));
	
	if(wrongway)
	{
		GUI.color = Color.red;
		GUI.Label(Rect((Screen.width/2)-70,20,200,20),"Checkpoint errado!!!");
	}
}