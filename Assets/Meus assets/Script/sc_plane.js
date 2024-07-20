#pragma strict

var antigrav:float = 1;
var needforspeed:float = 50;
var startimpulse:Vector3 = Vector3.zero;
var startimpulseglobal:Vector3 = Vector3.zero;
var jetstr:float = 1;
var lift:float = 1;
var leme:float = 1;
var mintolift:float = 0.1;
var mintoleme:float = 0.1;
var wingpos:Transform;
var lemepos:Transform;
var flap:Transform[];
var flapstr:float[];
var flapcontrol:String[];
var separador___________________:boolean = true;
var needspeedcoef:float;
var antigravcoef:float = 0;
var speedcoef:float = 1;
var liftspeed:float = 1;
var lemespeed:float = 1;
var collisionforce:float = 0;

var controlled:boolean;
var showgui:boolean = false;

var missile:Transform[];
var missilefab:GameObject[];
var missilecontrol:String;
var alternate_m = 0;

var mdano:float;
var mexp_range:float;
var mpush:float;
var mspeed:float;
		
function OnCollisionEnter(collision : Collision)
{
	if (collision.relativeVelocity.magnitude > 0.3)
    collisionforce += collision.relativeVelocity.magnitude;
    //Debug.Log("imp = "+collision.impactForceSum);
    
    //Debug.Log(""+collision.relativeVelocity.magnitude);
}
function Start () {
	rigidbody.AddForce(transform.TransformDirection(startimpulse),ForceMode.Impulse);
	rigidbody.AddForce(startimpulseglobal,ForceMode.Impulse);
}

function Update () {
	var tmpvec3:Vector3;
	var tmpcoef:float = 0;
	if(controlled){rigidbody.AddForce(transform.forward*jetstr*Input.GetAxis("Jump")*Time.deltaTime,ForceMode.Impulse);}
	//////////////////////////////////////////////////////////////////////////////////////Aerodinamica
	
	///////Alinahmento com o solo
	antigravcoef = transform.up.y;
	antigravcoef = Mathf.Abs(antigravcoef);
	
	//////////////////////////////// Posição relativa da velocidade
	tmpvec3 = transform.InverseTransformPoint(transform.position+rigidbody.velocity);
	//////////////////////////////// Atrito da asa com o ar
	liftspeed = -tmpvec3.y*lift;
	//////////////////////////////// Atrito da leme com o ar
	lemespeed = -tmpvec3.x*leme;
	
	////////////////////////////////Alinhamento da velocidade com a direção do avião
	tmpvec3.Normalize();
	speedcoef = Mathf.Abs(tmpvec3.z);
	////////////////////////////////Velocidade do avião que afeta a Sustentação
	needspeedcoef = rigidbody.velocity.magnitude/needforspeed;
	if(needspeedcoef < 0){needspeedcoef = 0;}
	if(needspeedcoef > 1){needspeedcoef = 1;}
	
	tmpcoef = speedcoef*needspeedcoef;
	//////////////////////////////////////////////////Aplicação das forças
	///////Flaps de controle
	var cont:int = 0;
	while(cont  < flap.Length)
	{
		if(controlled)
			rigidbody.AddForceAtPosition(flap[cont].up*speedcoef*needspeedcoef*flapstr[cont]* Time.deltaTime * Input.GetAxis(flapcontrol[cont]),flap[cont].position,ForceMode.Impulse);
		
		cont++;
	}
	///////Atrito
	if((liftspeed > mintolift)||(liftspeed < -mintolift))
	{rigidbody.AddForceAtPosition( wingpos.up*liftspeed*Time.deltaTime, wingpos.position,ForceMode.Impulse);}
	
	if((lemespeed > mintoleme)||(lemespeed < -mintoleme))
	{rigidbody.AddForceAtPosition( lemepos.right*lemespeed*Time.deltaTime, lemepos.position,ForceMode.Impulse);}
	///////Sustentação
	rigidbody.AddForce( wingpos.TransformDirection(-Physics.gravity) * rigidbody.mass * antigravcoef* antigrav * Time.deltaTime *  tmpcoef   , ForceMode.Impulse);



	////////////Misseis
	if(Input.GetButtonDown(missilecontrol))if(controlled)
	{
		var insted:GameObject;
		//insted = Network.Instantiate(missilefab[alternate_m],missile[alternate_m].transform.position,missile[alternate_m].transform.rotation,1);
		insted = Instantiate(missilefab[alternate_m],missile[alternate_m].transform.position,missile[alternate_m].transform.rotation);
		insted.GetComponent(SC_MISSILE).canmove = true;
		//insted.GetComponent(SC_MISSILE).shooter = myid;
		//insted.GetComponent(SC_MISSILE).shooterobj = transform;
		//insted.networkView.RPC("setcanmove",RPCMode.Others);
		insted.GetComponent(SC_MISSILE).dano = mdano;
		insted.GetComponent(SC_MISSILE).exp_range = mexp_range;
		insted.GetComponent(SC_MISSILE).push = mpush;
		insted.GetComponent(SC_MISSILE).speed = mspeed;
		insted.GetComponent(SC_MISSILE).ignore_net = true;
		alternate_m++;
		if(alternate_m > missile.Length-1)
		{
			alternate_m = 0;
		}
	}
}

function OnGUI()
{
	if(showgui)
	{
		 GUI.color = Color.red;
		 GUI.Label(Rect(10,Screen.height-60,500,20)," speed = "+rigidbody.velocity.magnitude );
		 GUI.Label(Rect(10,Screen.height-40,500,20)," Km/h = "+(rigidbody.velocity.magnitude*0.75*3.6));
		 GUI.Label(Rect(10,Screen.height-20,200,20),"speed de pouso= "+rigidbody.velocity.y);
		 GUI.Label(Rect(110,130,40,40),"0");
		 GUI.color = Color.red;
		 
		 GUI.Label(Rect(10,10,40,40),"dir");
		 GUI.Label(Rect(30,10,40,40),"vel");
		 GUI.Label(Rect(50,10,40,40),"ali");
		 GUI.Label(Rect(65,10,40,40),"sus");
		 GUI.Label(Rect(90,10,40,40),"atr");
		 GUI.VerticalSlider (Rect(10,40,20,100),speedcoef, 1, 0) ;             //Alinhamento de velocidade com direção    - Afeta a sustentação
		 GUI.VerticalSlider (Rect(30,40,20,100),needspeedcoef, 1, 0) ;         //Velocidade                               - Afeta a sustentação
		 GUI.VerticalSlider (Rect(50,40,20,100),antigravcoef, 1, 0) ;         //Alinhamento com o chão                   - Afeta a sustentação
		 GUI.VerticalSlider (Rect(70,40,20,100),/*antigravcoef**/speedcoef*needspeedcoef, 1, 0) ;//Sustentação em si
		 GUI.VerticalSlider (Rect(90,40,20,200),liftspeed, 3, -3) ;            //Atrito da asa com o ar
	}
}