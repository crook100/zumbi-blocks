#pragma strict
/*
Fator de metragem - 1 unidade = 0.75 metros
Fator de metragem - 1 metro = 1.3 unidades
3,5 unidades = do chao ao teto 
*/
var audiovol:float = 1;
var musicvol:float = 1;
var saveinlist:boolean = true;
var testnat:boolean = true;

var buildversion:String = "alpha 0.1.0";
var saveversion:String = "v001";
var gamestate:int = 0;
var guiskin:GUISkin;
var guisking:GUISkin;
var guiskinerr:GUISkin;
var guiSlist:GUISkin;

var newgui_square:GUISkin;
var newgui_square2:GUISkin;
var newgui_square3:GUISkin;
var newhud:Texture[];

var playernick:String;
var porttoconec:int = 25334;
var porttostring:String;
var the_password:String;
var cam:Transform;
var menulogo:Texture;
var fscreenbuton:Texture;
var SL_line:Texture;
var logoaspect:float = 1.8;
var spawnerprefab:Transform;
var matchcontrollerprefab:Transform;
var matchdataprefab:Transform;

var matchdata:Transform;
var matchcontroller:Transform;
var scenecontroller:Transform;

var errormsg:String;
var loadingobjects:Transform[];
var iamserver:boolean = false;
var hostData:HostData[];
var mousesense:float = 1;
var autoreload:boolean = false;
var autoaim:boolean = false;
var lastscore:int = 0;
var timesurvivedsecs:int = 0;
var timesurvivedmins:int = 0;
var backsprite:Texture;
var enabledsign:Texture;
var disabledsign:Texture;
var searchsign:Texture;
var ref_sign:Texture;
var languageset:int = 1;
var language:sc_linguajar[];
var itemlist:sc_item[];

var screenlastx:int = 0;
var screenlasty:int = 0;

var disconecplease:boolean = false;
var cannat:boolean = false;
var ispub:boolean = false;
var canlist:boolean = false;
var sp:boolean = false;

var ipstoconec:String[];
var trynow:int = 0;
var ipstotry = 1;

var money:int = 100;

var invent:int[];
var itemtosell:int[];
var shoparray:int[];
var solength:int = 0;
var shopadicional:int;
var shopselected:int = -1;
var shoparrayselected:int = -1;
var shoptype:int = 0;

var lockicon:Texture;
var backitem:Texture;
var selecteditem:int = -1;
var buyitem:int = 0;

var juststarted:int = 0;
var instedspawner:Transform;
var lastaccmoney:int = 0;

var skymaterial:Material;

var botaosizereload:int[];
var botaosizeaim:int[];

var listinicio:int = 0;
var listmaxroll:int = 0;

var sharedhud:int = 0;

var manequimfab:Transform;
var elmanequim:Transform;
var mane_up_cont:int = 0;

var itempivofab:Transform;
var itempivo:Transform;
var item_show:Transform;
//////////config graphics
var pretend_resolution:int = 0;
var pretend_vsync:int = 0;
var pretend_antialias:int = 0;
var pretend_texture:int = 0;
var pretend_light_qual:int = 0;

var pretend_shadow_dist:int;
var pretend_shadow_proj:ShadowProjection;
var pretend_view_distance:int;
var pretend_terrain_text:int;
var pretend_terrain_quality:int;
var pretend_fps_limit:int;

var bytearray:byte[];

var my_beard:int = -1;
var my_beardcolor:int = 0;
var my_shirtcolor:int = 0;
var my_skincolor:int = 0;

var playerprefab:Transform;

var quadribyte:byte[];
var octabit:boolean[];

var onmouse:int = -1;
var pivo_vec2:Vector2;

var S_name:String;
var usarNat:boolean = false;
var tooshort_s_name:boolean = false;
var server_select:int = 0;
var testvar:ConnectionTesterStatus;
var searching_server:String;

var E_num:int = 0;
var E_dis:int[];
var E_emb:int[];

var page:int = 1;

function list_dis(limit:int)
{
	var cont:int = 0;
	var p:int = 0;
	while(cont < 8)
	{
		var tmpint:boolean = true;
		var cont2:int = 0;
		while(cont2 < limit)
		{
			if(E_emb[cont2] == cont){tmpint = false;break;}
			cont2++;
		}
		
		if(tmpint){E_dis[p] = cont; p++;}
		cont++;
	}
}
function fatorial(n:int):int
{
	var r:int = 1;
	var cont:int = 2;
	
	while(cont <= n)
	{
		r *= cont;
		cont++;
	}
	return r;
}
function work_emb(Num:int)
{
	var N:int = Num;
	var i = 0;
	//////
	while(i < 8)
	{
		E_emb[i] = -1;
		i++;
	}
	//////
	i = 0;
	while(N > 0)
	{
		list_dis(i);
		var l:int = N/fatorial(7-i);
		E_emb[i] = E_dis[ l ];
		N = N%fatorial(7-i);
		i++;
	}
	list_dis(i);
	var j:int = 0;
	while(i < 8)
	{
		E_emb[i] = E_dis[j];
		j++;
		i++;
	}
}

function bytetobit(n:byte):boolean
{
	var cont:int = 0;
	while(cont < 8)
	{
		if( ((n >> (1*cont))%2) == 1 )
		{octabit[cont] = true;}
		else
		{octabit[cont] = false;}
		
		cont++;
	}
	return true;
}
function inttobyte(n:int):boolean
{
	var cont:int = 0;
	while(cont < 4)
	{
		quadribyte[cont] = n >> (8*cont);
		cont++;
	}
	return true;
}
function bytestoint(vetor:byte[],pos:int):int
{
	var i:int = 0;
	var cont:int = 0;
	while(cont < 4)
	{
		Debug.Log(Random.Range(0,256));
		i += vetor[pos+cont] << (8*cont);
		cont++;
	}
	return i;
}

function save_onfile():void
{
	var cont:int = 0;
	while(cont < 10)
	{
		cont++;
	}
	/*
	PlayerPrefs.SetString("ZB_"+saveversion+"_prefname",playernick);
	
	PlayerPrefs.SetInt("ZB_"+saveversion+"_my_beard",my_beard);
	PlayerPrefs.SetInt("ZB_"+saveversion+"_my_beardcolor",my_beardcolor);
	PlayerPrefs.SetInt("ZB_"+saveversion+"_my_skincolor",my_skincolor);
	PlayerPrefs.SetInt("ZB_"+saveversion+"_my_shirtcolor",my_shirtcolor);
	
	if(autoaim)
	{PlayerPrefs.SetInt("ZB_"+saveversion+"_autoaim",1);}
	else{PlayerPrefs.SetInt("ZB_"+saveversion+"_autoaim",0);}
	
	if(autoreload)
	{PlayerPrefs.SetInt("ZB_"+saveversion+"_autoreload",1);}
	else{PlayerPrefs.SetInt("ZB_"+saveversion+"_autoreload",0);}
	
	PlayerPrefs.SetInt("ZB_"+saveversion+"_money",money);
	PlayerPrefs.SetFloat("ZB_"+saveversion+"_sound",audiovol);
	PlayerPrefs.SetFloat("ZB_"+saveversion+"_sense",mousesense);
	var cont:int = 0;
	while(cont < invent.Length)
	{
		PlayerPrefs.SetInt("ZB_"+saveversion+"_invent"+cont,invent[cont]);
		cont++;
	}
	*/
}

function sortby_type_price()
{
	var auxint:int = 0;
	
	var cont:int = 0;
	while(cont < shoparray.Length)
	{
		shoparray[cont] = cont;
		cont++;
	}
	
	cont = 0;
	while(cont < shoparray.Length-1)
	{
		if(itemlist[itemtosell[ shoparray[cont+1] ] ].tipo < itemlist[itemtosell[ shoparray[cont] ] ].tipo )
		{
			auxint = shoparray[cont+1];
			shoparray[cont+1] = shoparray[cont];
			shoparray[cont] = auxint;
			
			if(cont > 0){cont--;}
		}
		else{cont++;}
	}
	var itemtype:int = 0;
	var typeinit:int = 0;
	cont = 0;
	while(cont < shoparray.Length-1)
	{
		if(itemlist[itemtosell[ shoparray[cont] ] ].tipo > itemtype)
		{
			var cont2:int = typeinit;
			while(cont2 < cont-1)
			{
				if(itemlist[itemtosell[ shoparray[cont2+1] ] ].price < itemlist[itemtosell[ shoparray[cont2] ] ].price )
				{
					auxint = shoparray[cont2+1];
					shoparray[cont2+1] = shoparray[cont2];
					shoparray[cont2] = auxint;
					
					if(cont2 > typeinit){cont2--;}
				}
				else{cont2++;}
			}
			itemtype = itemlist[itemtosell[ shoparray[cont] ] ].tipo;
			typeinit = cont;
		}
		cont++;
	}
}

function save_graphics()
{
	PlayerPrefs.SetInt("ZB_"+saveversion+"_vsync",       pretend_vsync);
	PlayerPrefs.SetInt("ZB_"+saveversion+"_antiali",     pretend_antialias);
	PlayerPrefs.SetInt("ZB_"+saveversion+"_texture",     pretend_texture);
	PlayerPrefs.SetInt("ZB_"+saveversion+"_light_qual",  pretend_light_qual);
	PlayerPrefs.SetInt("ZB_"+saveversion+"_terrain_qual",pretend_terrain_quality);
	PlayerPrefs.SetInt("ZB_"+saveversion+"_terrain_text",pretend_terrain_text);
	
	if(pretend_shadow_proj == ShadowProjection.CloseFit)
	{PlayerPrefs.SetInt("ZB_"+saveversion+"_shadow_proj",0);}
	else
	{PlayerPrefs.SetInt("ZB_"+saveversion+"_shadow_proj",1);}
	
	PlayerPrefs.SetInt("ZB_"+saveversion+"_shadow_dist",pretend_shadow_dist);
	
	PlayerPrefs.SetInt("ZB_"+saveversion+"_fps_limit",pretend_fps_limit);
	
}
function save():void
{ 
	PlayerPrefs.SetString("ZB_"+saveversion+"_prefname",playernick);
	
	PlayerPrefs.SetInt("ZB_"+saveversion+"_my_beard",my_beard);
	PlayerPrefs.SetInt("ZB_"+saveversion+"_my_beardcolor",my_beardcolor);
	PlayerPrefs.SetInt("ZB_"+saveversion+"_my_skincolor",my_skincolor);
	PlayerPrefs.SetInt("ZB_"+saveversion+"_my_shirtcolor",my_shirtcolor);
	
	if(autoaim)
	{PlayerPrefs.SetInt("ZB_"+saveversion+"_autoaim",1);}
	else{PlayerPrefs.SetInt("ZB_"+saveversion+"_autoaim",0);}
	
	if(autoreload)
	{PlayerPrefs.SetInt("ZB_"+saveversion+"_autoreload",1);}
	else{PlayerPrefs.SetInt("ZB_"+saveversion+"_autoreload",0);}
	
	PlayerPrefs.SetInt("ZB_"+saveversion+"_money",money);
	PlayerPrefs.SetFloat("ZB_"+saveversion+"_sound",audiovol);
	PlayerPrefs.SetFloat("ZB_"+saveversion+"_sense",mousesense);
	var cont:int = 0;
	while(cont < invent.Length)
	{
		PlayerPrefs.SetInt("ZB_"+saveversion+"_invent"+cont,invent[cont]);
		cont++;
	}
}
function load_graphics():void
{
	pretend_vsync = PlayerPrefs.GetInt("ZB_"+saveversion+"_vsync",0);
	pretend_antialias = PlayerPrefs.GetInt("ZB_"+saveversion+"_antiali",0);
	pretend_texture = PlayerPrefs.GetInt("ZB_"+saveversion+"_texture",0);
	pretend_light_qual = PlayerPrefs.GetInt("ZB_"+saveversion+"_light_qual",0);
	pretend_terrain_quality = PlayerPrefs.GetInt("ZB_"+saveversion+"_terrain_qual",25);
	pretend_terrain_text = PlayerPrefs.GetInt("ZB_"+saveversion+"_terrain_text",50);
	
	var tmpint:int = PlayerPrefs.GetInt("ZB_"+saveversion+"_shadow_proj",0);
	
	if(tmpint == 0)
	{pretend_shadow_proj = ShadowProjection.CloseFit;}
	else
	{pretend_shadow_proj = ShadowProjection.StableFit;}
	
	pretend_shadow_dist = PlayerPrefs.GetInt("ZB_"+saveversion+"_shadow_dist",20);
	pretend_fps_limit = PlayerPrefs.GetInt("ZB_"+saveversion+"_fps_limit",90);
}
function load():void
{
	playernick = PlayerPrefs.GetString("ZB_"+saveversion+"_prefname","player");
	
	my_beard = PlayerPrefs.GetInt("ZB_"+saveversion+"_my_beard",-1);
	my_beardcolor = PlayerPrefs.GetInt("ZB_"+saveversion+"_my_beardcolor",0);
	my_skincolor = PlayerPrefs.GetInt("ZB_"+saveversion+"_my_skincolor",0);
	my_shirtcolor = PlayerPrefs.GetInt("ZB_"+saveversion+"_my_shirtcolor",0);
	
	if(PlayerPrefs.GetInt("ZB_"+saveversion+"_autoaim",0) == 0)
	{autoaim = false;}
	else{autoaim = true;}
	
	if(PlayerPrefs.GetInt("ZB_"+saveversion+"_autoreload",0) == 0)
	{autoreload = false;}
	else{autoreload = true;}
	
	money = PlayerPrefs.GetInt("ZB_"+saveversion+"_money",0);
	
	mousesense = PlayerPrefs.GetFloat("ZB_"+saveversion+"_sense",1);
	audiovol = PlayerPrefs.GetFloat("ZB_"+saveversion+"_sound",1);
	
	var cont:int = 0;
	while(cont < invent.Length)
	{
		invent[cont] = PlayerPrefs.GetInt("ZB_"+saveversion+"_invent"+cont,-1);
		cont++;
	}
}

function cript(number:float):float
{
	return (number/5)+75;
}
function decript(number:float):float
{
	return (number-75)*5;
}

function Start () {
	//work_emb(fatorial(8)-1234);
	//quadribyte = System.IO.File.ReadAllBytes("save2.txt");
	//inttobyte(54544242);
	//System.IO.File.WriteAllBytes("save2.txt",quadribyte);
	//listmaxroll = bytestoint(quadribyte,0);
	//System.Array.Resize()
	
	//System.IO.File.WriteAllBytes("jacaranda.txt",quadribyte);
		
	//Application.targetFrameRate = 120;
	
	Application.runInBackground = true;
	DontDestroyOnLoad(gameObject); 
	DontDestroyOnLoad(cam.gameObject); 
	
	load_graphics();
	aplly_graphic_quality();
	
	screenlastx = Screen.width;
	screenlasty = Screen.height;
	porttostring = ""+porttoconec;
	
	juststarted = PlayerPrefs.GetInt("ZB_"+saveversion+"_start",0);
	if(juststarted == 0)
	{
		PlayerPrefs.SetInt("ZB_"+saveversion+"_start",1);
		save();
	}
	load();
	
	update_manequim();
	shopselected = -1;
	update_gunshow();
	
}
function Update () {
	

	if(mane_up_cont > 0)
	{
		mane_up_cont++;
		if(mane_up_cont > 5)
		{
			update_manequim();update_gunshow();
			mane_up_cont = 0;
		}
	}
	if(GameObject.Find("matchdata(Clone)") != null)
	{
		matchdata = GameObject.Find("matchdata(Clone)").transform;
	}
	if(instedspawner != null)
	{
		instedspawner.GetComponent(sc_spawner).matchdata = matchdata;
	}
	if(item_show != null)
	{
		itempivo.Rotate(Vector3.up*Time.deltaTime*50);
	}
}

function strstr(source:String, find:String):boolean
{	
	if(find.Length > source.Length){return false;}
	if(find.Length == 0){return true;}
	
	source = source.ToLower();
	find = find.ToLower();
	var cont:int = 0;
	while(cont < source.Length-find.Length+1)
	{
		var cont2:int = 0;
		while((source.Chars[cont+cont2] == find.Chars[cont2]) && (cont2 < find.Length))
		{
			if(cont2 == find.Length-1){return true;}
			cont2++;
		}
		
		cont++;
	}
	return false;
}

function update_gunshow()
{
	if(itempivo != null)
	{Destroy(itempivo.gameObject);}
	
	itempivo = Instantiate(itempivofab,transform.position,transform.rotation);
	
	var thecast:Ray = cam.camera.ScreenPointToRay(Vector3(120,Screen.height-230,1));
	var tmpfloat123:float =  Vector2.Distance(Vector2(0,0),Vector2(Screen.height,Screen.width));
	tmpfloat123/=1000;
	
	itempivo.position += thecast.direction*(tmpfloat123*6f);
	
	if(item_show != null){Destroy(item_show.gameObject);}
	if(shopselected >= 0)
	{
		item_show = Instantiate(itemlist[shopselected].prefab,transform.position,transform.rotation);
		item_show.parent = itempivo;
		item_show.localPosition = Vector3.zero;
		if(item_show.GetComponent(mostrador_ajuste) != null)
		{
			item_show.localPosition += item_show.GetComponent(mostrador_ajuste).posissao;
			item_show.localEulerAngles = item_show.GetComponent(mostrador_ajuste).rotassao;
		}
		else{item_show.localEulerAngles = Vector3.zero;}
	}
}

function update_manequim()
{
	if(elmanequim != null){Destroy(elmanequim.gameObject);}
	
	elmanequim = Instantiate(manequimfab,transform.position,transform.rotation);
	
	var thecast:Ray = cam.camera.ScreenPointToRay(Vector3(120,Screen.height-340,1));
	var tmpfloat123:float =  Vector2.Distance(Vector2(0,0),Vector2(Screen.height,Screen.width));
	tmpfloat123/=1000;
	
	elmanequim.position += thecast.direction*(tmpfloat123*5f);
	
	var cont:int = 0;
	while(cont < elmanequim.GetComponent(sc_manequim).skinpart.Length)
	{
		elmanequim.GetComponent(sc_manequim).skinpart[cont].renderer.material = playerprefab.GetComponent(sc_player).skincolors[my_skincolor];
		cont++;
	}
	cont = 0;
	while(cont < elmanequim.GetComponent(sc_manequim).shirtpart.Length)
	{
		elmanequim.GetComponent(sc_manequim).shirtpart[cont].renderer.material = playerprefab.GetComponent(sc_player).camisacolors[my_shirtcolor];
		cont++;
	}
	
	if(my_beard >= 0)
	{
		var insted:Transform = Instantiate(playerprefab.GetComponent(sc_player).beardprefabs[my_beard]);
		insted.parent = elmanequim.GetComponent(sc_manequim).bearpos;
		insted.position = insted.parent.position;
		insted.localEulerAngles = Vector3.zero;
		
		insted.GetComponent(sc_reference).refer.renderer.material = playerprefab.GetComponent(sc_player).haircolors[my_beardcolor];
	}
}
function OnLevelWasLoaded () {
	
	save();
	var insted:Transform;
	var cont:int = 0;
	if(disconecplease)
	{
		Network.Disconnect(200);
		disconecplease = false;
	}
	if(gamestate == 3) /*souserver*/
	{

		scenecontroller = GameObject.Find("scenecontrol").transform;
		
		//cam.GetComponent(Skybox).enabled = true;
		scenecontroller.GetComponent(sc_scenecontroller).terrain_text = pretend_terrain_text;
		scenecontroller.GetComponent(sc_scenecontroller).terrain_quality = pretend_terrain_quality;
		
		scenecontroller.GetComponent(sc_scenecontroller).observator.eulerAngles = Vector3.zero;
		if(pretend_light_qual == 0){scenecontroller.GetComponent(sc_scenecontroller).timecontroler.solalt.enabled = false;}
		cam.parent = scenecontroller.GetComponent(sc_scenecontroller).observator;
		cam.localPosition = Vector3.zero;
		cam.localEulerAngles = Vector3.zero;
		
		insted = Network.Instantiate(spawnerprefab,spawnerprefab.position,spawnerprefab.rotation,0);
		instedspawner = insted;
		insted.GetComponent(sc_spawner).enabled = true;
		insted.GetComponent(sc_spawner).mousesense = mousesense;
		insted.GetComponent(sc_spawner).autoreload = autoreload;
		insted.GetComponent(sc_spawner).autoaim = autoaim;
		
		insted.GetComponent(sc_spawner).my_beard = my_beard;
		insted.GetComponent(sc_spawner).my_shirtcolor = my_shirtcolor;
		insted.GetComponent(sc_spawner).my_skincolor = my_skincolor;
		insted.GetComponent(sc_spawner).my_beardcolor = my_beardcolor;
		
		cont = 0;
		while(cont < invent.Length)
		{
			insted.GetComponent(sc_spawner).inve[cont] = invent[cont];
			cont++;
		}
		
		insted.GetComponent(sc_spawner).gamecontrol = transform;
		insted.GetComponent(sc_spawner).canspawn = true;
		insted.GetComponent(sc_spawner).playername = playernick;
		
		matchcontroller = Instantiate(matchcontrollerprefab);
		matchdata = Network.Instantiate(matchdataprefab,matchdataprefab.position,matchdataprefab.rotation,0);
		matchdata.GetComponent(sc_matchdata).senddata = true;
		
		matchcontroller.GetComponent(sc_matchcontroller).matchdata = matchdata;
		matchcontroller.GetComponent(sc_matchcontroller).myspawner = instedspawner;
		matchcontroller.GetComponent(sc_matchcontroller).gamecontrol = transform;
		matchcontroller.GetComponent(sc_matchcontroller).addspawner(insted.gameObject);
	}
	
	if(gamestate == 5)
	{
		scenecontroller = GameObject.Find("scenecontrol").transform;
		
		//cam.GetComponent(Skybox).enabled = true;
		scenecontroller.GetComponent(sc_scenecontroller).terrain_text = pretend_terrain_text;
		scenecontroller.GetComponent(sc_scenecontroller).terrain_quality = pretend_terrain_quality;
		
		scenecontroller.GetComponent(sc_scenecontroller).observator.eulerAngles = Vector3.zero;
		if(pretend_light_qual == 0){scenecontroller.GetComponent(sc_scenecontroller).timecontroler.solalt.enabled = false;}
		cam.parent = scenecontroller.GetComponent(sc_scenecontroller).observator;
		
		Network.Connect(ipstoconec[trynow],porttoconec,the_password);
	}
	
	if((gamestate != 5) && (gamestate != 3))
	{
		update_manequim();
	}
}

function OnDisconnectedFromServer(info : NetworkDisconnection) 
{
	Screen.showCursor = true;
	Screen.lockCursor = false;
	if(gamestate == 3)
	{
		// eu tenho q tomar providencias (2 coelhos com uma cajadada)
	}
	if(gamestate == 6)
	{
		lastaccmoney = 0;
		errormsg = "Either you lost connection or the server shuted down";
	}
	if(gamestate != 12)
	{
		gamestate = 8;
	}
	cam.parent = null;
	cam.localPosition = Vector3.zero;
	cam.localEulerAngles = Vector3.zero;
	Application.LoadLevel(2);
	//////////////////////////////////////////
}

function OnConnectedToServer()
{
	var insted:Transform;
	var cont:int = 0;
	
	if(gamestate == 5)
	{	
		insted = Network.Instantiate(spawnerprefab,spawnerprefab.position,spawnerprefab.rotation,0);
		instedspawner = insted;
		insted.GetComponent(sc_spawner).enabled = true;
		insted.GetComponent(sc_spawner).mousesense = mousesense;
		insted.GetComponent(sc_spawner).autoreload = autoreload;
		insted.GetComponent(sc_spawner).autoaim = autoaim;
		insted.GetComponent(sc_spawner).matchdata = matchdata;
		
		insted.GetComponent(sc_spawner).my_beard = my_beard;
		insted.GetComponent(sc_spawner).my_shirtcolor = my_shirtcolor;
		insted.GetComponent(sc_spawner).my_skincolor = my_skincolor;
		insted.GetComponent(sc_spawner).my_beardcolor = my_beardcolor;
		
		cont = 0;
		while(cont < invent.Length)
		{
			insted.GetComponent(sc_spawner).inve[cont] = invent[cont];
			cont++;
		}
		insted.GetComponent(sc_spawner).gamecontrol = transform;
		insted.GetComponent(sc_spawner).playername = playernick;
		
		cam.parent = scenecontroller.GetComponent(sc_scenecontroller).observator;
		cam.localPosition = Vector3.zero;
		cam.localEulerAngles = Vector3.zero;
		gamestate = 6;		
	}
}
/*function fib(n:int):int
{
	var s1:int;
	var s2:int;
	if(n <= 1)
	{
		return 1;
	}
	else
	{
		s1 = fib(n-1);
		s2 = fib(n-2);
		return s1+s2;
	}
}*/

function aplly_graphic_quality()
{
	QualitySettings.antiAliasing = pretend_antialias;
	QualitySettings.masterTextureLimit = pretend_texture;
	QualitySettings.vSyncCount = pretend_vsync;
	QualitySettings.shadowProjection = pretend_shadow_proj;
	QualitySettings.shadowDistance = pretend_shadow_dist;
	
	Application.targetFrameRate = pretend_fps_limit;
	
}
function OnFailedToConnect(error : NetworkConnectionError)
{
	cam.parent = null;
	cam.localPosition = Vector3.zero;
	cam.localEulerAngles = Vector3.zero;
	
	Application.LoadLevel(2);
	if(gamestate == 3)
	{
		Screen.lockCursor = false;
		Screen.showCursor = true;
		gamestate = 0;
	}
	if(gamestate == 5)
	{
		if(trynow == ipstotry-1)
		{
			gamestate = 27;
			
			errormsg = "";
			if(error == NetworkConnectionError.RSAPublicKeyMismatch)
			{errormsg = "Worng RSA public key";}
			if(error == NetworkConnectionError.InvalidPassword)
			{errormsg = "Wrong password";}
			if(error == NetworkConnectionError.ConnectionFailed)
			{errormsg = "Internal problem";}
			if(error == NetworkConnectionError.TooManyConnectedPlayers)
			{errormsg = "Server is full";}
			if(error == NetworkConnectionError.ConnectionBanned)
			{errormsg = "You are banned";}
			if(error == NetworkConnectionError.AlreadyConnectedToServer)
			{errormsg = "Already connected";}
			if(error == NetworkConnectionError.AlreadyConnectedToAnotherServer)
			{errormsg = "Already connected to other";}
			if(error == NetworkConnectionError.CreateSocketOrThreadFailure)
			{errormsg = "Failed to create socket";}
			if(error == NetworkConnectionError.IncorrectParameters)
			{errormsg = "Incorrect function parameters, report that if possible";}
			if(error == NetworkConnectionError.EmptyConnectTarget)
			{errormsg = "Empty connection target";}
			
			if(error == NetworkConnectionError.InternalDirectConnectFailed)
			{errormsg = "Empty connection target";}
			if(error == NetworkConnectionError.NATTargetNotConnected)
			{errormsg = "NAT Target Not Connected";}
			if(error == NetworkConnectionError.NATTargetConnectionLost)
			{errormsg = "NAT Target Connection Lost";}
			if(error == NetworkConnectionError.NATPunchthroughFailed)
			{errormsg = "NAT Punchthrough Failed";}
			
			if(errormsg == ""){errormsg = "Could not connect: Unknown Connection problem";}
		}
		else
		{
			trynow++;
			Network.Connect(ipstoconec[trynow],porttoconec,the_password);
		}
	}
}

function OnPlayerDisconnected(player : NetworkPlayer) {
    //Debug.Log("Clean up after player " +  player);
    Network.RemoveRPCs(player);
    Network.DestroyPlayerObjects(player);
}

function OnGUI()
{
	GUI.skin = guiskin;
	var insted:Transform;
	var cont:int = 0;
	var cont2:int = 0;
	var tmpvec3:Vector3;
	var tmpfloat:float;
	var tmpfloat2:float;
	
	var tmpint:int = 0;
	var waitaframe:int = 0;
	AudioListener.volume = audiovol;
	if((gamestate != 3)||(gamestate!= 6))
	{
	   skymaterial.SetFloat("_Blend", 0);
	}
	
	sharedhud = 0;
	var middlepos:int = (menulogo.width*0.3)+20+((Screen.width-((menulogo.width*0.3)+20))/2);
	
	if(gamestate == -1)     /*menu loading*/
	{
		gamestate = 0;
	}
	if(gamestate == 29)
	{
		sharedhud = 1;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-25,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+25,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-20,400,32),language[languageset].frase[110]) )
		{
			cont = 2;
			while(cont < 10)
			{
				invent[cont] = -1;
				cont++;
			}
			money = 0;
			invent[0] = 0;
			invent[1] = 8;
			
			my_beard = -1;
			my_beardcolor = 2;
			my_shirtcolor = 0;
			my_skincolor = 0;
			
			save();
			update_manequim();
			gamestate = 0;
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+30,400,32),language[languageset].frase[3] ) )
		{
			gamestate = 19;
		}
		
		GUI.color = Color.yellow;
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-70,400,32),"RESET" );
	}
	if(gamestate == 19)
	{
		sharedhud = 1;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		
		//GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-200,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-150,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-0,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-145,400,32),language[languageset].frase[77] ) )
		{
			gamestate = 21;
			sortby_type_price();
			shopselected = itemtosell[shoparray[0]];
			shoptype = 0;
			shoparrayselected = 0;
			update_gunshow();
		}
		/*if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-45,400,32),language[languageset].frase[78] ) )
		{
		}*/
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-45,400,32),language[languageset].frase[79] ) )
		{
			gamestate = 22;
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+5,400,32),language[languageset].frase[80] ) )
		{
			gamestate = 23;
			onmouse = -1;
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+55,400,32),"RESET" ) )
		{
			gamestate = 29;
		}
		
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+105,400,32),language[languageset].frase[3] ) )
		{
			gamestate = 0;
		}
		
		GUI.color = Color.grey;
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-95,400,32),language[languageset].frase[78] ) ;
	}
	if(gamestate == 23)
	{
		sharedhud = 1;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		////////////////////////////////
		GUI.color = Color.yellow;
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-170,400,32),language[languageset].frase[60]);
		
		cont = 0;
		while(cont < 5)
		{
			GUI.color = Color.white;
			
			tmpvec3 = Input.mousePosition;
			tmpvec3.y = Screen.height-Input.mousePosition.y;
			if(Rect( middlepos-110,(Screen.height/2)-120+(35*cont),96,33).Contains(tmpvec3))
			{
				GUI.color.a = 0.2;
				if(Input.GetKeyDown(KeyCode.Mouse0))
				{
					onmouse = cont;
				}
				if(onmouse >= 0)if(Input.GetKeyUp(KeyCode.Mouse0))if(onmouse != cont)
				{
					tmpint = invent[onmouse];
					invent[onmouse] = invent[cont];
					invent[cont] = tmpint;
				}
				if(onmouse < 0)if(invent[cont] >= 0)
				{
					GUI.color = Color.yellow;
					GUI.Label(Rect(middlepos-200,(Screen.height/2)+65,400,32),itemlist[invent[cont]].nome);
				}
				GUI.color = Color.white;
				GUI.color.a = 0.2;
			}
			else{GUI.color.a = 0.05;}
			
			GUI.DrawTexture(Rect( middlepos-110,(Screen.height/2)-120+(35*cont),96,33),SL_line,ScaleMode.StretchToFill, true, 0);
			if(invent[cont] >= 0)if(onmouse != cont)
			{
				GUI.color = Color.white;
				GUI.color.a = 1;
				GUI.DrawTexture(Rect( middlepos-110,(Screen.height/2)-120+(35*cont),itemlist[invent[cont]].sprite.width,itemlist[invent[cont]].sprite.height),itemlist[invent[cont]].sprite,ScaleMode.StretchToFill, true, 0);
			}
			cont++;
		}
		while(cont < 10)
		{
			GUI.color = Color.white;
			
			tmpvec3 = Input.mousePosition;
			tmpvec3.y = Screen.height-Input.mousePosition.y;
			if(Rect( middlepos+5,(Screen.height/2)-120+(35*(cont-5)),96,33).Contains(tmpvec3))
			{
				GUI.color.a = 0.2;
				if(Input.GetKeyDown(KeyCode.Mouse0))
				{
					onmouse = cont;
				}
				if(onmouse >= 0)if(Input.GetKeyUp(KeyCode.Mouse0))if(onmouse != cont)
				{
					tmpint = invent[onmouse];
					invent[onmouse] = invent[cont];
					invent[cont] = tmpint;
				}
				if(onmouse < 0)if(invent[cont] >= 0)
				{
					GUI.color = Color.yellow;
					GUI.Label(Rect(middlepos-200,(Screen.height/2)+65,400,32),itemlist[invent[cont]].nome);
				}
				GUI.color = Color.white;
				GUI.color.a = 0.2;
			}
			else{GUI.color.a = 0.05;}
			
			GUI.DrawTexture(Rect( middlepos+5,(Screen.height/2)-120+(35*(cont-5)),96,33),SL_line,ScaleMode.StretchToFill, true, 0);
			if(invent[cont] >= 0)if(onmouse != cont)
			{
				GUI.color = Color.white;
				GUI.color.a = 1;
				GUI.DrawTexture(Rect( middlepos+5,(Screen.height/2)-120+(35*(cont-5)),itemlist[invent[cont]].sprite.width,itemlist[invent[cont]].sprite.height),itemlist[invent[cont]].sprite,ScaleMode.StretchToFill, true, 0);
			}
			cont++;
		}
		if(Input.GetKeyUp(KeyCode.Mouse0))if(onmouse != cont)
		{onmouse = -1;}
		//////////////////////////////////////////
		GUI.color = Color.white;
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+105,400,32),language[languageset].frase[3] ) )
		{
			save();
			gamestate = 19;
		}
		
		tmpvec3 = Input.mousePosition;
		tmpvec3.y = Screen.height-Input.mousePosition.y;
		
		if(onmouse >= 0)if(invent[onmouse] >= 0)
		{
			GUI.DrawTexture(Rect( tmpvec3.x-48,tmpvec3.y-16,itemlist[invent[onmouse]].sprite.width,itemlist[invent[onmouse]].sprite.height),itemlist[invent[onmouse]].sprite,ScaleMode.StretchToFill, true, 0);
		}
	}
	if(gamestate == 22)
	{
		sharedhud = 1;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-0,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		playernick = GUI.TextField(Rect(middlepos-50,(Screen.height/2)-142,200,30),playernick,10);
		GUI.Label(Rect(middlepos-190,(Screen.height/2)-145,175,32),language[languageset].frase[96]);
		
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-95,400,32),language[languageset].frase[94]+" #"+(my_skincolor+1));
		if(GUI.Button(Rect(middlepos+160,(Screen.height/2)-95,30,32),">") )
		{
			my_skincolor++;
			if(my_skincolor > playerprefab.GetComponent(sc_player).skincolors.Length-1)
			{my_skincolor = 0;}
			update_manequim();
		}
		if(GUI.Button(Rect(middlepos-190,(Screen.height/2)-95,30,32),"<") )
		{
			my_skincolor--;
			if(my_skincolor < 0)
			{my_skincolor = playerprefab.GetComponent(sc_player).skincolors.Length-1;}
			update_manequim();
		}
		/////////////////////////////////////
		
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-45,400,32),language[languageset].frase[90]+" #"+(my_beard+2));
		if(GUI.Button(Rect(middlepos+160,(Screen.height/2)-45,30,32),">" ) )
		{
			my_beard++;
			if(my_beard > playerprefab.GetComponent(sc_player).beardprefabs.Length-1)
			{my_beard = -1;}
			update_manequim();
		}
		if(GUI.Button(Rect(middlepos-190,(Screen.height/2)-45,30,32),"<" ) )
		{
			my_beard--;
			if(my_beard < -1)
			{my_beard = playerprefab.GetComponent(sc_player).beardprefabs.Length-1;}
			update_manequim();
		}
		////////////////////////////////////
		GUI.Label(Rect(middlepos-200,(Screen.height/2)+5,400,32),language[languageset].frase[91]+" #"+(my_beardcolor+1) );
		if(GUI.Button(Rect(middlepos+160,(Screen.height/2)+5,30,32),">" ) )
		{
			my_beardcolor++;
			if(my_beardcolor > playerprefab.GetComponent(sc_player).haircolors.Length-1)
			{my_beardcolor = 0;}
			update_manequim();
		}
		if(GUI.Button(Rect(middlepos-190,(Screen.height/2)+5,30,32),"<" ) )
		{
			my_beardcolor--;
			if(my_beardcolor < 0)
			{my_beardcolor = playerprefab.GetComponent(sc_player).haircolors.Length-1;}
			update_manequim();
		}
		//////////////////////////////////////////////////
		GUI.Label(Rect(middlepos-200,(Screen.height/2)+55,400,32),language[languageset].frase[92]+" #"+(my_shirtcolor+1) );
		if(GUI.Button(Rect(middlepos+160,(Screen.height/2)+55,30,32),">" ) )
		{
			my_shirtcolor++;
			if(my_shirtcolor > playerprefab.GetComponent(sc_player).camisacolors.Length-1)
			{my_shirtcolor = 0;}
			update_manequim();
		}
		if(GUI.Button(Rect(middlepos-190,(Screen.height/2)+55,30,32),"<" ) )
		{
			my_shirtcolor--;
			if(my_shirtcolor < 0)
			{my_shirtcolor = playerprefab.GetComponent(sc_player).camisacolors.Length-1;}
			update_manequim();
		}
		/////////
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+105,400,32),language[languageset].frase[3] ) )
		{
			save();
			gamestate = 19;
		}
	}
	if(gamestate == 21)
	{
		sharedhud = 2;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		GUI.Box(Rect(225,5,Screen.width-230,Screen.height-250),"");
		
		GUI.DrawTexture(Rect(middlepos+20,Screen.height-200,newhud[2].width,newhud[2].height),newhud[2],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos+20,Screen.height-100,newhud[2].width,newhud[2].height),newhud[2],ScaleMode.StretchToFill, true, 0);
		
		GUI.color = Color.gray;
		GUI.DrawTexture(Rect(middlepos+20,Screen.height-150,newhud[2].width,newhud[2].height),newhud[2],ScaleMode.StretchToFill, true, 0);
		GUI.Label(Rect(middlepos+22,Screen.height-145,200,32),language[languageset].frase[89]);
		
		GUI.color = Color.white;
		if(GUI.Button(Rect(middlepos+22,Screen.height-95,200,32),language[languageset].frase[3] ) )
		{
			gamestate = 19;
		}
		
		if(shopselected >= 0)if(shoparrayselected >= 0)
		{
			if(shoptype == 0)
			{
				if(GUI.Button(Rect(middlepos+22,Screen.height-195,200,32),language[languageset].frase[65] ) )
				{
					if(money >= itemlist[shopselected].price)
					{
						cont = 0;
						while(cont < invent.Length)
						{
							if(invent[cont] < 0)
							{
								break;
							}
							cont++;
						}
						if(cont < invent.Length)
						{
							money -= itemlist[shopselected].price;
							invent[cont] = shopselected;
							save();
							update_gunshow();
						}
					}
				}
			}
			if(shoptype == 1)
			{
				if(GUI.Button(Rect(middlepos+22,Screen.height-195,200,32),language[languageset].frase[64] ) )
				{
					money += itemlist[shopselected].sellprice;
					invent[shoparrayselected] = -1;
					save();
					
					shopselected = -1;
					update_gunshow();
					shoptype = -1;
				}
			}
		}
		
		GUI.skin = newgui_square2;
		GUI.color = Color.red;
		GUI.Box(Rect(225,5,Screen.width-230,30),"");
		GUI.Box(Rect(Screen.width-25,5,20,Screen.height-249),"");
		GUI.Box(Rect(Screen.width-25,5,20,30),"");
		
		/////////////////
		GUI.color = Color.white;
		GUI.color.a = 0.02;
		GUI.DrawTexture(Rect(middlepos-260,Screen.height-240,250,230),SL_line,ScaleMode.StretchToFill, true, 0);		
		GUI.skin = guiskinerr;
		GUI.color.a = 1;
		GUI.Label(Rect(middlepos-255,Screen.height-240,250,30), language[languageset].frase[60] );
		/////////////
		tmpint = 0;
		cont = 0;
		while((cont+shopadicional < shoparray.Length) && (79+(40*cont) < Screen.height-240))
		{
			tmpint++;
			cont++;
		}
		tmpint = shoparray.Length-tmpint;
		if(shopadicional > tmpint){shopadicional = tmpint;}
		GUI.color = Color.yellow;
		shopadicional = GUI.VerticalSlider(Rect(Screen.width-22,37,20,Screen.height-249-40),shopadicional,0,tmpint);
		
		tmpvec3 = Input.mousePosition;
		tmpvec3.y = Screen.height-Input.mousePosition.y;
		if(Rect(225,5,Screen.width-230,Screen.height-250).Contains(tmpvec3))
		{
			shopadicional -= Input.GetAxis("MouseWheel");
			if(shopadicional > tmpint){shopadicional = tmpint;}
			if(shopadicional < 0){shopadicional = 0;}
		}
		/////////////
		GUI.color = Color.white;
		GUI.Label(Rect(225,5,300,30), language[languageset].frase[77] );
		
		cont = 0;
		while((cont+shopadicional < shoparray.Length) && (79+(40*cont) < Screen.height-240))
		{
			GUI.color.a = 0.2;
			GUI.DrawTexture(Rect(350,33+(40*cont),2,37),SL_line,ScaleMode.StretchToFill, true, 0);
			GUI.DrawTexture(Rect(550,33+(40*cont),2,37),SL_line,ScaleMode.StretchToFill, true, 0);
			GUI.DrawTexture(Rect(730,33+(40*cont),2,37),SL_line,ScaleMode.StretchToFill, true, 0);
			
			if(Rect(225,34+(40*cont),Screen.width-260,35).Contains(tmpvec3))
			{
				GUI.DrawTexture(Rect(228,34+(40*cont),Screen.width-265,35),SL_line,ScaleMode.StretchToFill, true, 0);
				if(Input.GetKeyDown(KeyCode.Mouse0))
				{
					shopselected = itemtosell[shoparray[cont+shopadicional]];
					update_gunshow();
					shoptype = 0;
					shoparrayselected = cont+shopadicional;
				}
			}
			if(cont+shopadicional == shoparrayselected)if(shoptype == 0)
			{
				GUI.color = Color.yellow;
				GUI.color.a = 0.2;
				GUI.DrawTexture(Rect(228,34+(40*cont),Screen.width-265,35),SL_line,ScaleMode.StretchToFill, true, 0);
				GUI.color = Color.white;
			}
			
			GUI.color.a = 0.3;
			GUI.DrawTexture(Rect(230,70+(40*cont),Screen.width-300,2),SL_line,ScaleMode.StretchToFill, true, 0);
			
			GUI.color.a = 1;
			GUI.DrawTexture(Rect(240,34+(40*cont),itemlist[itemtosell[shoparray[cont+shopadicional]]].sprite.width,itemlist[itemtosell[shoparray[cont+shopadicional]]].sprite.height),itemlist[itemtosell[shoparray[cont+shopadicional]]].sprite,ScaleMode.StretchToFill, true, 0);
			
			GUI.Label(Rect(350,35+(40*cont),200,30), itemlist[itemtosell[shoparray[cont+shopadicional]]].nome );
			GUI.Label(Rect(580,35+(40*cont),100,30), itemlist[itemtosell[shoparray[cont+shopadicional]]].price+" $" );
			
			cont++;
		}
		/////////////	
		cont = 0;
		while(cont < 5)
		{
			GUI.color = Color.white;
			
			tmpvec3 = Input.mousePosition;
			tmpvec3.y = Screen.height-Input.mousePosition.y;
			if(Rect( middlepos-250,Screen.height-200+(35*cont),96,33).Contains(tmpvec3))
			{
				GUI.color.a = 0.2;
				if(Input.GetKeyDown(KeyCode.Mouse0))
				{
					shopselected = invent[cont];
					shoparrayselected = cont;
					update_gunshow();
					shoptype = 1;
				}
			}
			else{GUI.color.a = 0.05;}
			
			if(shoptype == 1)if(shoparrayselected == cont){GUI.color = Color.yellow;GUI.color.a = 0.2;}
			GUI.DrawTexture(Rect( middlepos-250,Screen.height-200+(35*cont),96,33),SL_line,ScaleMode.StretchToFill, true, 0);
			if(invent[cont] >= 0)
			{
				GUI.color = Color.white;
				GUI.color.a = 1;
				GUI.DrawTexture(Rect( middlepos-250,Screen.height-200+(35*cont),itemlist[invent[cont]].sprite.width,itemlist[invent[cont]].sprite.height),itemlist[invent[cont]].sprite,ScaleMode.StretchToFill, true, 0);
			}
			cont++;
		}
		while(cont < 10)
		{
			GUI.color = Color.white;
			
			tmpvec3 = Input.mousePosition;
			tmpvec3.y = Screen.height-Input.mousePosition.y;
			if(Rect( middlepos-125,Screen.height-200+(35*(cont-5)),96,33).Contains(tmpvec3))
			{
				GUI.color.a = 0.2;
				if(Input.GetKeyDown(KeyCode.Mouse0))
				{
					shopselected = invent[cont];
					shoparrayselected = cont;
					update_gunshow();
					shoptype = 1;
				}
			}
			else{GUI.color.a = 0.05;}
			
			if(shoptype == 1)if(shoparrayselected == cont){GUI.color = Color.yellow;GUI.color.a = 0.2;}
			GUI.DrawTexture(Rect( middlepos-125,Screen.height-200+(35*(cont-5)),96,33),SL_line,ScaleMode.StretchToFill, true, 0);
			if(invent[cont] >= 0)
			{
				GUI.color = Color.white;
				GUI.color.a = 1;
				GUI.DrawTexture(Rect( middlepos-125,Screen.height-200+(35*(cont-5)),itemlist[invent[cont]].sprite.width,itemlist[invent[cont]].sprite.height),itemlist[invent[cont]].sprite,ScaleMode.StretchToFill, true, 0);
			}
			cont++;
		}
		
	}
	if(gamestate == 20)
	{
		sharedhud = 1;
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		var tmpstr:String;
		if(page == 1)
		{
			//////res
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)   -295,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			GUI.DrawTexture(Rect(middlepos-(newhud[1].width/2)-30,(Screen.height/2)-255,newhud[1].width+60,newhud[1].height),newhud[1],ScaleMode.StretchToFill, true, 0);
			//////vsync
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-215,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			//////antialias
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-165,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			//////texture
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-115,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			////////light-double
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-65,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			////////Terrain Quality
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-15,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			GUI.DrawTexture(Rect(middlepos-(newhud[1].width/2)-30,(Screen.height/2)+25,newhud[1].width+60,newhud[1].height),newhud[1],ScaleMode.StretchToFill, true, 0);
			////////Terrain Texture
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+55,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			GUI.DrawTexture(Rect(middlepos-(newhud[1].width/2)-30,(Screen.height/2)+95,newhud[1].width+60,newhud[1].height),newhud[1],ScaleMode.StretchToFill, true, 0);
			
			////////Page
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+180,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			////////aplly
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+230,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			
			///////////////////////////////////////////////RESOLUÇAO//////////////////////////////////////////////////////////////////////
			GUI.Label(Rect(middlepos-200,(Screen.height/2)-290,400,32),language[languageset].frase[83]+' '+Screen.resolutions[pretend_resolution].width+"x"+Screen.resolutions[pretend_resolution].height+' '+Screen.resolutions[pretend_resolution].refreshRate+" Hz");
			pretend_resolution = GUI.HorizontalSlider(Rect(middlepos-230,(Screen.height/2)-245,460,10),pretend_resolution,0,Screen.resolutions.Length-1);
			///////////////////////////////////////////////VSYNC/////////////////////////////////////////////////////////////////////////
			if(pretend_vsync == 0){tmpstr = language[languageset].frase[85];}
			else{tmpstr = "x"+pretend_vsync.ToString();}
			if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-210,400,32),"V-Sync "+tmpstr ) )
			{
				pretend_vsync++;
				if(pretend_vsync > 2){pretend_vsync = 0;}
			}
			////////////////////////////////////////////Anti-alias///////////////////////////////////////////////////////////////////////
			if(pretend_antialias == 0){tmpstr = language[languageset].frase[85];}
			else{tmpstr = "x"+pretend_antialias.ToString();}
			if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-160,400,32),"Anti-Alias "+tmpstr ) )
			{
				if(pretend_antialias == 0){pretend_antialias = 2;}
				else{pretend_antialias *= 2;}
				
				if(pretend_antialias > 8){pretend_antialias = 0;}
			}
			////////////////////////////////////////Texture/////////////////////////////////////////////////////////////////////////////////
			if(pretend_texture == 0){tmpint = 86;}
			if(pretend_texture == 1){tmpint = 87;}
			if(pretend_texture == 2){tmpint = 88;}
			if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-110,400,32),language[languageset].frase[82]+" = "+language[languageset].frase[tmpint] ) )
			{
				pretend_texture++;
				if(pretend_texture > 2){pretend_texture = 0;}
			}
			////////////////////////////////////////Iluminassao/////////////////////////////////////////////////////////////////////////////////
			
			if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-60,400,32),language[languageset].frase[113+pretend_light_qual]) )
			{
				if( pretend_light_qual == 0){ pretend_light_qual = 1;}
				else{ pretend_light_qual = 0;}
			}
			
			/////////////////////////////////////////Terreno 1/////////////////////////////////////////////////////////////////////////////////
			GUI.Label(Rect(middlepos-200,(Screen.height/2)-10,400,32),language[languageset].frase[115]+" = "+(26-pretend_terrain_quality));
			pretend_terrain_quality = GUI.HorizontalSlider(Rect(middlepos-230,(Screen.height/2)+33,460,10),pretend_terrain_quality,25,1);
			
			////////////////////////////////////////Terreno 2/////////////////////////////////////////////////////////////////////////////////
			GUI.Label(Rect(middlepos-200,(Screen.height/2)+60,400,32),language[languageset].frase[116]+" = "+pretend_terrain_text);
			pretend_terrain_text = GUI.HorizontalSlider(Rect(middlepos-230,(Screen.height/2)+103,460,10),pretend_terrain_text,30,300);
			
			////////////////////////////////////////Page2/////////////////////////////////////////////////////////////////////////////////
			if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+185,400,32),language[languageset].frase[117]+"2") )
			{
				page = 2;
			}
		}
		if(page == 2)
		{
			//////shadow type
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)   -295,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			//////shadow dist
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)   -245,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			GUI.DrawTexture(Rect(middlepos-(newhud[1].width/2)-30,(Screen.height/2)-205,newhud[1].width+60,newhud[1].height),newhud[1],ScaleMode.StretchToFill, true, 0);
			
			//////fps limit
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)   -175,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			GUI.DrawTexture(Rect(middlepos-(newhud[1].width/2)-30,(Screen.height/2)-135,newhud[1].width+60,newhud[1].height),newhud[1],ScaleMode.StretchToFill, true, 0);
			
			////////////////////////////////////////Shadow projection/////////////////////////////////////////////////////////////////////////////////
			if(pretend_shadow_proj == ShadowProjection.CloseFit){ tmpstr = language[languageset].frase[118]; }
			if(pretend_shadow_proj == ShadowProjection.StableFit){ tmpstr = language[languageset].frase[119]; }
			if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-290,400,32),tmpstr) )
			{
				if( pretend_shadow_proj == ShadowProjection.CloseFit){ pretend_shadow_proj = ShadowProjection.StableFit;}
				else{pretend_shadow_proj = ShadowProjection.CloseFit;}
			}
			////////////////////////////////////////Shadow projection//////////////////////////////////////////////////////////////////
			GUI.Label(Rect(middlepos-200,(Screen.height/2)-240,400,32),language[languageset].frase[120]+" = "+pretend_shadow_dist);
			pretend_shadow_dist = GUI.HorizontalSlider(Rect(middlepos-230,(Screen.height/2)-197,460,10),pretend_shadow_dist,15,200);
			
			////////////////////////////////////////Shadow projection//////////////////////////////////////////////////////////////////
			GUI.Label(Rect(middlepos-200,(Screen.height/2)-170,400,32),language[languageset].frase[121]+" = "+pretend_fps_limit);
			pretend_fps_limit = GUI.HorizontalSlider(Rect(middlepos-230,(Screen.height/2)-127,460,10),pretend_fps_limit,15,360);
			////////Page
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+180,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			////////aplly
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+230,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			
			if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+185,400,32),language[languageset].frase[117]+"1") )
			{
				page = 1;
			}
		}
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+235,400,32),language[languageset].frase[84] ) )
		{
			save_graphics();
			aplly_graphic_quality();
			
			Screen.SetResolution(Screen.resolutions[pretend_resolution].width,Screen.resolutions[pretend_resolution].height,Screen.fullScreen,Screen.resolutions[pretend_resolution].refreshRate);
		
			mane_up_cont = 1;
			
			gamestate = 9;
		}
		/*if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+235,400,32),language[languageset].frase[3] ) )
		{
			gamestate = 9;
		}*/
		
	}
	if(gamestate == 24)     /*menu 1*/
	{
		
		sharedhud = 1;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-0,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-95,400,32),language[languageset].frase[99] ) )
		{
			iamserver = true;
			Network.InitializeSecurity();
			Network.InitializeServer(1, 50123, false);
			
			gamestate = 3;
			Application.LoadLevel(1);
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-45,400,32),language[languageset].frase[97] ) )
		{
			gamestate = 25;
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+5,400,32),language[languageset].frase[98] ) )
		{
			MasterServer.ClearHostList();
			MasterServer.RequestHostList("Zumbiblocks "+buildversion);
			server_select = -1;
			gamestate = 26;
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+55,400,32),language[languageset].frase[107] ) )
		{
			gamestate = 27;
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+105,400,32),language[languageset].frase[3] ) )
		{
			gamestate = 0;
		}
	}
	if(gamestate == 28)
	{
		sharedhud = 1;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-85,400,32),language[languageset].frase[109]);
		
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-50,newhud[2].width,newhud[2].height),newhud[2],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)   ,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		GUI.Label(Rect(middlepos-170,(Screen.height/2)-45,100,32),"Password");
		
		the_password =  GUI.TextField(Rect(middlepos,(Screen.height/2)-45,200,30),the_password,10);
		
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+5,400,32),language[languageset].frase[108] ) )
		{
			gamestate = 5;
			iamserver = false;
			Application.LoadLevel(1);
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+55,400,32),language[languageset].frase[3] ) )
		{
			MasterServer.ClearHostList();
			MasterServer.RequestHostList("Zumbiblocks "+buildversion);
			server_select = -1;
			gamestate = 26;
		}
	}
	if(gamestate == 26)
	{
		sharedhud = 1;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		GUI.Box(Rect(225,5,Screen.width-230,Screen.height-250),"");
		
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),Screen.height-80,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),Screen.height-130,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		if(server_select < 0)
		{
			GUI.color = Color.gray;
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),Screen.height-180,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			GUI.Label(Rect(middlepos-100,Screen.height-175,200,32),language[languageset].frase[108]);
		}
		else
		{
			GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),Screen.height-180,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
			GUI.color = Color.white;
			if(GUI.Button(Rect(middlepos-100,Screen.height-175,200,32),language[languageset].frase[108] ) )
			{
				ipstoconec = hostData[server_select].ip;
				trynow = 0;
				ipstotry = hostData[server_select].ip.Length;
				
				porttoconec = hostData[server_select].port;
				porttostring = ""+porttoconec;
				
				if(hostData[server_select].passwordProtected)
				{
					gamestate = 28;
				}
				else
				{
					gamestate = 5;
					iamserver = false;
					Application.LoadLevel(1);
				}
			}
		}
		
		GUI.color = Color.white;
		searching_server =  GUI.TextField(Rect(middlepos-195,Screen.height-225,250,30),searching_server,10);
		GUI.DrawTexture(Rect(middlepos+70,Screen.height-230,searchsign.width,searchsign.height),searchsign,ScaleMode.StretchToFill, true, 0);
		
		GUI.color = Color.yellow;
		tmpvec3 = Input.mousePosition;
		tmpvec3.y = Screen.height-Input.mousePosition.y;
		if(Rect(middlepos+140,Screen.height-230,ref_sign.width,ref_sign.height).Contains(tmpvec3))
		{
			GUI.color = Color.green;
			if(Input.GetKeyDown(KeyCode.Mouse0))
			{
				MasterServer.ClearHostList();
				MasterServer.RequestHostList("Zumbiblocks "+buildversion);
				server_select = -1;
			}
		}			
		
		GUI.DrawTexture(Rect(middlepos+140,Screen.height-230,ref_sign.width,ref_sign.height),ref_sign,ScaleMode.StretchToFill, true, 0);
				
		GUI.skin = newgui_square2;
		GUI.color = Color.red;
		GUI.Box(Rect(225,5,Screen.width-230,30),"");
		GUI.Box(Rect(Screen.width-25,5,20,Screen.height-249),"");
		GUI.Box(Rect(Screen.width-25,5,20,30),"");
		
		GUI.skin = newgui_square2;
		GUI.color = Color.white;
		GUI.color.a = 0.2;
		
		GUI.DrawTexture(Rect(270,10,1,20),SL_line,ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(Screen.width-110,10,1,20),SL_line,ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(Screen.width-48,10,1,20),SL_line,ScaleMode.StretchToFill, true, 0);
		
		GUI.skin = newgui_square3;
		GUI.color = Color.white;
		GUI.Label(Rect(275,10,90,19),language[languageset].frase[100]);
		GUI.Label(Rect(225,10,50,19),"#");
			
		if(MasterServer.PollHostList().Length != 0)
		{
        	hostData = MasterServer.PollHostList();
        	tmpint = hostData.Length;
        	cont = 0;
        	while(35+(20*cont)+20 < Screen.height-250)
        	{cont++;}
        	listmaxroll = MasterServer.PollHostList().Length-cont;
        	
        	if(listmaxroll < 0){listmaxroll = 0;}
        	GUI.skin =  newgui_square;
        	if(listmaxroll > 0)
        	{listinicio = GUI.VerticalSlider(Rect(Screen.width-22,37,20,Screen.height-249-40),listinicio,0,listmaxroll);}
		
        	cont2 = listinicio;
        	cont = 0;
        	while(cont2 < tmpint)
        	{	
        		if(35+(20*cont)+30 < Screen.height-250)
        		{
        			if(strstr(hostData[cont2].gameName,searching_server))
        			{
	        			GUI.skin = newgui_square2;
	        			if(server_select == cont2)
	        			{
		        			GUI.color = Color.yellow;
		        			GUI.color.a = 0.2;
	        			
	        				GUI.DrawTexture(Rect(228,37+(20*cont),Screen.width-255,17),SL_line,ScaleMode.StretchToFill, true, 0);
	        			}
	        			GUI.color = Color.white;
	        			GUI.color.a = 0.2;
	        			GUI.DrawTexture(Rect(228,55+(20*cont),Screen.width-255,1),SL_line,ScaleMode.StretchToFill, true, 0);
	        			GUI.DrawTexture(Rect(270,35+(20*cont),1,20),SL_line,ScaleMode.StretchToFill, true, 0);
	        			GUI.DrawTexture(Rect(Screen.width-110,35+(20*cont),1,20),SL_line,ScaleMode.StretchToFill, true, 0);
	        			GUI.DrawTexture(Rect(Screen.width-48,35+(20*cont),1,20),SL_line,ScaleMode.StretchToFill, true, 0);
	        			
	        			GUI.color.a = 1;
	        			if(hostData[cont2].passwordProtected){GUI.DrawTexture(Rect(Screen.width-43,37+(20*cont),13,16),lockicon,ScaleMode.StretchToFill, true, 0);}
	        			
		        		GUI.color = Color.white;
		        		tmpvec3 = Input.mousePosition;
						tmpvec3.y = Screen.height-Input.mousePosition.y;
						
						GUI.skin = newgui_square3;
						GUI.Label(Rect(230,35+(20*cont),40,19),cont2.ToString());
						GUI.Label(Rect(Screen.width-123,35+(20*cont),90,19),hostData[cont2].connectedPlayers.ToString()+"/16");
						
						GUI.skin = newgui_square2;
						if(GUI.Button(Rect(275,35+(20*cont),400,19), hostData[cont2].gameName) )
		        		{
		        			server_select = cont2;
		        			/**/
		        		}
		        		cont++;
	        		}
				}
				cont2++;
        	}
        }
		//////////////////////////////////////////////////////////////////////////////////////////////////////////
		GUI.skin = newgui_square;
		GUI.color = Color.white;
		if(GUI.Button(Rect(middlepos-100,Screen.height-125,200,32),language[languageset].frase[107] ) )
		{
			gamestate = 27;
		}
		if(GUI.Button(Rect(middlepos-100,Screen.height-75,200,32),language[languageset].frase[3] ) )
		{
			gamestate = 24;
		}
	}
	if(gamestate == 27)     /*menu 1*/
	{
		sharedhud = 1;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-100,newhud[2].width,newhud[2].height),newhud[2],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-50, newhud[2].width,newhud[2].height),newhud[2],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2),    newhud[2].width,newhud[2].height),newhud[2],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+50, newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		GUI.Label(Rect(middlepos-170,(Screen.height/2)-95,100,32),"Ip");
		GUI.Label(Rect(middlepos-170,(Screen.height/2)-45,100,32),"Port");
		GUI.Label(Rect(middlepos-170,(Screen.height/2)+5,100,32),"Password");
		
		ipstoconec[0] =  GUI.TextField(Rect(middlepos,(Screen.height/2)-95,200,30),ipstoconec[0],35);
		
		porttostring =  GUI.TextField(Rect(middlepos,(Screen.height/2)-45,200,30),porttostring,5);
		if(int.TryParse(porttostring,porttoconec))
		{porttoconec = int.Parse(porttostring);}
		if(porttoconec == 0){porttoconec = 25678;}
		
		the_password =  GUI.TextField(Rect(middlepos,(Screen.height/2)+5,200,30),the_password,10);
		
		GUI.color = Color.white;
		
		if(GUI.Button(Rect(middlepos-100,(Screen.height/2)+55,200,32),language[languageset].frase[108] ) )
		{
			gamestate = 5;
			iamserver = false;
			trynow = 0;
	        ipstotry = 1;
			Application.LoadLevel(1);
		}
		if(GUI.Button(Rect(middlepos-100,(Screen.height/2)+105,200,32),language[languageset].frase[3] ) )
		{
			gamestate = 24;
		}
		
	}
	if(gamestate == 25)     /*menu 1*/
	{
		sharedhud = 1;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-200,newhud[2].width,newhud[2].height),newhud[2],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-150,newhud[2].width,newhud[2].height),newhud[2],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-100,newhud[2].width,newhud[2].height),newhud[2],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-0,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+150,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		GUI.Label(Rect(middlepos-(newhud[0].width/2)+5,(Screen.height/2)-195,200,32),language[languageset].frase[100] );
		S_name = GUI.TextField(Rect(middlepos,(Screen.height/2)-190,200,30),S_name,30);
		
		GUI.Label(Rect(middlepos-(newhud[0].width/2)+5,(Screen.height/2)-145,200,32),"Port" );
		porttostring =  GUI.TextField(Rect(middlepos,(Screen.height/2)-140,200,30),porttostring,5);
		if(int.TryParse(porttostring,porttoconec))
		{porttoconec = int.Parse(porttostring);}
		if(porttoconec == 0){porttoconec = 25678;}
		
		GUI.Label(Rect(middlepos-(newhud[0].width/2)+5,(Screen.height/2)-95,200,32),"Password" );
		Network.incomingPassword = GUI.TextField(Rect(middlepos,(Screen.height/2)-95,200,30),Network.incomingPassword,10);
		
		if(saveinlist)if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-45,400,32),language[languageset].frase[101] ) )
		{
			saveinlist = false;
		}
		if(!saveinlist)if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-45,400,32),language[languageset].frase[102] ) )
		{
			saveinlist = true;
		}
		
		if(usarNat)if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+5,400,32),language[languageset].frase[103] ) )
		{
			usarNat = false;
		}
		if(!usarNat)if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+5,400,32),language[languageset].frase[104] ) )
		{
			usarNat = true;
		}
		
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+105,400,32),language[languageset].frase[105] ) )
		{
			if(S_name.Length < 4)
			{
				tooshort_s_name = true;
			}
			else
			{
				tooshort_s_name = false;
				iamserver = true;
				Network.InitializeSecurity();
				Network.InitializeServer(16, porttoconec, usarNat);
				if(saveinlist)
				{
					MasterServer.RegisterHost("Zumbiblocks "+buildversion, S_name, "Standart game");
				}
				gamestate = 3;
				Application.LoadLevel(1);
			}
		}
		if(tooshort_s_name){GUI.Label(Rect(middlepos-200,(Screen.height/2)+220,400,32),language[languageset].frase[106] );}
		
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+155,400,32),language[languageset].frase[3] ) )
		{
			gamestate = 24;
		}
	}
	if(gamestate == 0)     /*menu 1*/
	{
		sharedhud = 1;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-0,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		GUI.color = Color.white;
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-95,400,32),language[languageset].frase[1] ) )
		{
			gamestate = 24;
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-45,400,32),language[languageset].frase[76] ) )
		{
			gamestate = 19;
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+5,400,32),language[languageset].frase[2] ) )
		{
			gamestate = 9;
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+105,400,32),language[languageset].frase[4] ) )
		{
			Application.Quit();
			Application.ExternalEval("window.close()");
		}
		
		GUI.color = Color.gray;
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.Label(Rect(middlepos-200,(Screen.height/2)+55,400,32),language[languageset].frase[75] );
	}
		
	if(gamestate == 3)    /*em jogo sou server*/
	{
	}
	
	if(gamestate == 5)    /*conectando*/
	{
		GUI.skin = guiskin;
		GUI.Label(Rect((Screen.width/2)-300,(Screen.height/2)-20,600,40), language[languageset].frase[11] );
		
		if(GUI.Button(Rect((Screen.width/2)-200,(Screen.height/2)+35,400,40),language[languageset].frase[12] ) )
		{
			Network.Disconnect(0);
			Application.LoadLevel(2);
			gamestate = 27;
		}
		GUI.skin = guiskinerr;
		GUI.Label(Rect((Screen.width/2)-400,(Screen.height/2)+75,800,20), language[languageset].frase[13]);
		GUI.Label(Rect((Screen.width/2)-400,(Screen.height/2)+100,800,20),language[languageset].frase[14]);
		GUI.skin = guiskin;
	}
	
	if(gamestate == 6)    /*em jogo sou cliente*/
	{
	}
	if(gamestate == 7)    /*saindo do jogo*/
	{
	}
	if(gamestate == 8)    /*saiu do jogo*/
	{
		sharedhud = 1;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+10,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		GUI.color = Color.yellow;
		GUI.Label(Rect(middlepos-300,(Screen.height/2)-75,600,40), language[languageset].frase[15] );
		GUI.Label(Rect(middlepos-300,(Screen.height/2)-50,600,40), language[languageset].frase[68]+" "+lastaccmoney+" $" );
		
		GUI.color = Color.white;
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+15,400,32),language[languageset].frase[3] ) )
		{
			gamestate = 0;
		}
	}
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	if(gamestate == 9)    /*Options*/
	{
		sharedhud = 1;
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-0,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		GUI.color = Color.white;
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-95,400,32),language[languageset].frase[16] ) )
		{
			gamestate = 10;
			errormsg = language[languageset].frase[9];
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-45,400,32),language[languageset].frase[17] ) )
		{
			gamestate = 16;
			errormsg = language[languageset].frase[9];
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+5,400,32),language[languageset].frase[18] ) )
		{
			gamestate = 20;
			pretend_antialias = QualitySettings.antiAliasing;
			pretend_texture = QualitySettings.masterTextureLimit;
			pretend_vsync = QualitySettings.vSyncCount;
			
			pretend_resolution = 0;
			cont = 0;
			while(cont < Screen.resolutions.Length)
			{
				if((Screen.height ==  Screen.resolutions[cont].height)&&(Screen.width ==  Screen.resolutions[cont].width))
				{
					pretend_resolution = cont;
					cont = Screen.resolutions.Length;
					Debug.Log("encontrei minha resoluçao");
				}
				cont++;
			}
		}
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+55,400,32),language[languageset].frase[3] ) )
		{
			gamestate = 0;
			errormsg = language[languageset].frase[9];
			save();
		}
	}
	if(gamestate == 16)    /*sound Options*/
	{
		sharedhud = 1;
		GUI.skin = newgui_square;
		
		GUI.color = Color.red;
		GUI.DrawTexture(Rect(middlepos-(newhud[1].width/2)-30,(Screen.height/2)-40,newhud[1].width+60,newhud[1].height),newhud[1],ScaleMode.StretchToFill, true, 0);

		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-0,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-80,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		GUI.Label(Rect(middlepos-300,(Screen.height/2)-75,600,32),language[languageset].frase[55]+" = "+audiovol.ToString("F2") );
		audiovol = GUI.HorizontalSlider(Rect(middlepos-240,(Screen.height/2)-33,480,15), audiovol, 0f, 1f);

		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+5,400,32),language[languageset].frase[3]) )
		{
			gamestate = 9;
			errormsg = language[languageset].frase[9];
		}
		
	}
	if(gamestate == 10)    /*control Options*/
	{
		sharedhud = 1;
		GUI.skin = newgui_square;
		
		GUI.color = Color.red;
		GUI.DrawTexture(Rect(middlepos-(newhud[1].width/2)-30,(Screen.height/2)-40,newhud[1].width+60,newhud[1].height),newhud[1],ScaleMode.StretchToFill, true, 0);

		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-130,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-80,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)-0,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+50,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+100,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		
		GUI.Label(Rect(middlepos-300,(Screen.height/2)-75,600,32),language[languageset].frase[20]+mousesense.ToString("F2") );
		mousesense = GUI.HorizontalSlider(Rect(middlepos-240,(Screen.height/2)-32,480,15), mousesense, 0.2, 3);
		
		GUI.color = Color.white;
		
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)-125,400,32),language[languageset].frase[19] ) )
		{
			gamestate = 11;
		}
		
		if(GUI.Button(Rect(middlepos-230,(Screen.height/2)+5,400,32),language[languageset].frase[30] ) )
		{
			autoreload = !autoreload;
		}
		if(autoreload)
		{GUI.DrawTexture(Rect(middlepos+botaosizereload[languageset]-50,(Screen.height/2)+10,32,22),enabledsign,ScaleMode.StretchToFill, true, 0);}
		if(!autoreload)
		{GUI.DrawTexture(Rect(middlepos+botaosizereload[languageset]-50,(Screen.height/2)+10,30,25),disabledsign,ScaleMode.StretchToFill, true, 0);}
		
		if(GUI.Button(Rect(middlepos-230,(Screen.height/2)+55,400,32),language[languageset].frase[70] ) )
		{
			autoaim = !autoaim;
		}
		if(autoaim)
		{GUI.DrawTexture(Rect(middlepos+botaosizeaim[languageset]-50,(Screen.height/2)+60,32,22),enabledsign,ScaleMode.StretchToFill, true, 0);}
		if(!autoaim)
		{GUI.DrawTexture(Rect(middlepos+botaosizeaim[languageset]-50,(Screen.height/2)+60,30,25),disabledsign,ScaleMode.StretchToFill, true, 0);}
		
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+105,400,32),language[languageset].frase[3]) )
		{
			gamestate = 9;
			errormsg = language[languageset].frase[9];
			save();
		}
	}
	if(gamestate == 11)    /*view control Options*/
	{
		sharedhud = 1;
		
		GUI.skin = guiskinerr;
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-100,400,32),language[languageset].frase[21]);
		
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-80,400,32),language[languageset].frase[22]);
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-65,400,32),language[languageset].frase[23]);
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-50,400,32),language[languageset].frase[24]);
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-35,400,32),language[languageset].frase[47]);
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-20,400,32),language[languageset].frase[25]);
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-5,400,32),language[languageset].frase[31]);
		GUI.Label(Rect(middlepos-200,(Screen.height/2)+10,400,32),language[languageset].frase[46]);
		GUI.Label(Rect(middlepos-200,(Screen.height/2)+25,400,32),language[languageset].frase[81]);
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+70,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		GUI.color = Color.white;
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+75,400,32),language[languageset].frase[3] ) )
		{
			gamestate = 10;
			errormsg = language[languageset].frase[9];
		}
	}
	
	if(gamestate == 12)    /*End game*/
	{
		sharedhud = 1;
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		GUI.DrawTexture(Rect(middlepos-(newhud[0].width/2),(Screen.height/2)+10,newhud[0].width,newhud[0].height),newhud[0],ScaleMode.StretchToFill, true, 0);
		
		GUI.skin = guiskinerr;
		GUI.color = Color.yellow;
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-105,400,32),language[languageset].frase[26] );
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-85,400,32),language[languageset].frase[27]);
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-65,400,32),language[languageset].frase[28]+lastscore+language[languageset].frase[29]);
		
		var tmpmin:String;
		var tmpsec:String;
		
		tmpmin = ""+timesurvivedmins;
		
		if(timesurvivedsecs < 10){tmpsec = "0"+timesurvivedsecs;}
		else{tmpsec = ""+timesurvivedsecs;}
		
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-45,400,32),language[languageset].frase[57]+tmpmin+":"+tmpsec);
		GUI.Label(Rect(middlepos-200,(Screen.height/2)-25,400,32),language[languageset].frase[68]+lastaccmoney+"$");
		
		GUI.skin = newgui_square;
		GUI.color = Color.white;
		if(GUI.Button(Rect(middlepos-200,(Screen.height/2)+15,400,32),language[languageset].frase[3] ) )
		{
			gamestate = 0;
		}
		
	}
	if(sharedhud == 2)
	{
		if(elmanequim != null)if(elmanequim.gameObject.activeSelf) 
		{
			elmanequim.gameObject.SetActive(false);
		}
		if(item_show != null)if(!item_show.gameObject.activeSelf)
		{
			item_show.gameObject.SetActive(true);
		}
		GUI.color = Color.white;
		GUI.DrawTexture(Rect(10,10,menulogo.width*0.3,menulogo.height*0.3),menulogo,ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect((menulogo.width*0.3)+20,5,1,Screen.height-10),SL_line,ScaleMode.StretchToFill, true, 0);
		
		GUI.DrawTexture(Rect(5,270,200,1),SL_line,ScaleMode.StretchToFill, true, 0);
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		GUI.Box(Rect(10,(menulogo.height*0.3)+44,200,32),"");
		GUI.Box(Rect(10,(menulogo.height*0.3)+350,200,28),"");
		GUI.Box(Rect(10,(menulogo.height*0.3)+380,200,28),"");
		
		GUI.skin.label.fontStyle = FontStyle.Normal;
		GUI.color = Color.yellow;
		GUI.Label(Rect(21,(menulogo.height*0.3)+381,175,25), money+" $" );
		if(shopselected >= 0)
		{
			GUI.Label(Rect(21,(menulogo.height*0.3)+48,175,25), itemlist[shopselected].nome );
			if(shoptype == 0)
			{
				GUI.color = Color.red;
				GUI.Label(Rect(21,(menulogo.height*0.3)+351,175,25), "-"+itemlist[shopselected].price+" $" );
			}
			if(shoptype == 1)
			{
				GUI.color = Color.green;
				GUI.Label(Rect(21,(menulogo.height*0.3)+351,175,25), "+"+itemlist[shopselected].sellprice+" $" );
			}
		}
		GUI.skin.label.fontStyle = FontStyle.Bold;
		
		GUI.color = Color.white;
		GUI.skin = guiskinerr;
		GUI.Label(Rect(25,(menulogo.height*0.3)+12,150,25), buildversion );
		GUI.skin = guiskin;
		/////
		
		if(shopselected >= 0)
		{
			GUI.color = Color.white;
			GUI.skin = newgui_square2;
			if(itemlist[shopselected].tipo == 0)
			{
				GUI.color = Color.yellow;
				GUI.Label(Rect(5,225+50,400,20),  "DMG" );
				GUI.Label(Rect(5,225+70,400,20),  "RAT" );
				
				if(!itemlist[shopselected].prefab.GetComponent(sc_gunscript).isbazuka)
				{GUI.Label(Rect(5,225+90,400,20),  "ACC" );}
				else{GUI.Label(Rect(5,225+90,400,20),"RNG" );}
				
				GUI.Label(Rect(5,225+110,400,20), "MAG" );
				
				GUI.color = Color.green;
				if(itemlist[shopselected].prefab.GetComponent(sc_gunscript).dano > 250)
				{
					tmpfloat = itemlist[shopselected].prefab.GetComponent(sc_gunscript).dano-250;
					GUI.color = Color.Lerp(Color.yellow,Color.red,tmpfloat/750);
				}
				cont =0;
				while(( cont*10 < (itemlist[shopselected].prefab.GetComponent(sc_gunscript).dano*itemlist[shopselected].prefab.GetComponent(sc_gunscript).bullets)) && ((cont*6) < 150))
				{
					GUI.color.a = 0.5;
					if((itemlist[shopselected].prefab.GetComponent(sc_gunscript).dano*itemlist[shopselected].prefab.GetComponent(sc_gunscript).bullets) - (cont*10) > 10)
					{GUI.DrawTexture(Rect(50+(cont*6),225+55,5,10),SL_line,ScaleMode.StretchToFill, true, 0);}
					else
					{
						tmpfloat = (itemlist[shopselected].prefab.GetComponent(sc_gunscript).dano*itemlist[shopselected].prefab.GetComponent(sc_gunscript).bullets)-(cont*10);
						GUI.DrawTexture(Rect(50+(cont*6),225+55,tmpfloat/2,10),SL_line,ScaleMode.StretchToFill, true, 0);
					}
					
					cont++;
				}
				GUI.color = Color.green;
				cont =0;
				while(( cont*5 < itemlist[shopselected].prefab.GetComponent(sc_gunscript).rate) && ((cont*6) < 150))
				{
					GUI.color.a = 0.5;
					if(itemlist[shopselected].prefab.GetComponent(sc_gunscript).dano - (cont*5) > 5)
					{GUI.DrawTexture(Rect(50+(cont*6),225+75,5,10),SL_line,ScaleMode.StretchToFill, true, 0);}
					else
					{
						tmpfloat = itemlist[shopselected].prefab.GetComponent(sc_gunscript).dano-(cont*5);
						GUI.DrawTexture(Rect(50+(cont*6),225+75,tmpfloat/2,10),SL_line,ScaleMode.StretchToFill, true, 0);
					}
					
					cont++;
				}
				
				if(!itemlist[shopselected].prefab.GetComponent(sc_gunscript).isbazuka)
				{
					cont =0;
					while(( cont*10 < ((4-itemlist[shopselected].prefab.GetComponent(sc_gunscript).spread)*50)) && ((cont*6) < 150))
					{
						GUI.color.a = 0.5;
						if(((4-itemlist[shopselected].prefab.GetComponent(sc_gunscript).spread)*50)-(cont*10) > 10)
						{GUI.DrawTexture(Rect(50+(cont*6),225+95,5,10),SL_line,ScaleMode.StretchToFill, true, 0);}
						else
						{
							tmpfloat = ((4-itemlist[shopselected].prefab.GetComponent(sc_gunscript).spread)*50)-(cont*10);
							GUI.DrawTexture(Rect(50+(cont*6),225+95,tmpfloat/2,10),SL_line,ScaleMode.StretchToFill, true, 0);
						}
						
						cont++;
					}
				}
				else
				{
					cont =0;
					while(( cont*3 < itemlist[shopselected].prefab.GetComponent(sc_gunscript).rangeofexp) && ((cont*6) < 150))
					{
						GUI.color.a = 0.5;
						if(itemlist[shopselected].prefab.GetComponent(sc_gunscript).rangeofexp - (cont*3) > 3)
						{GUI.DrawTexture(Rect(50+(cont*6),225+95,5,10),SL_line,ScaleMode.StretchToFill, true, 0);}
						else
						{
							tmpfloat = itemlist[shopselected].prefab.GetComponent(sc_gunscript).rangeofexp-(cont*3);
							GUI.DrawTexture(Rect(50+(cont*6),225+95,tmpfloat/2,10),SL_line,ScaleMode.StretchToFill, true, 0);
						}
						
						cont++;
					}
				}
				
				cont =0;
				while(( cont*10 < itemlist[shopselected].prefab.GetComponent(sc_gunscript).maxammo) && ((cont*6) < 150))
				{
					GUI.color.a = 0.5;
					if(itemlist[shopselected].prefab.GetComponent(sc_gunscript).maxammo - (cont*10) > 0.5)
					{GUI.DrawTexture(Rect(50+(cont*6),225+115,5,10),SL_line,ScaleMode.StretchToFill, true, 0);}
					else
					{
						tmpfloat = itemlist[shopselected].prefab.GetComponent(sc_gunscript).maxammo-(cont*10);
						GUI.DrawTexture(Rect(50+(cont*6),225+115,tmpfloat/2,10),SL_line,ScaleMode.StretchToFill, true, 0);
					}
					
					cont++;
				}
				
				
				
			}
			if(itemlist[shopselected].tipo == 2)
			{
				GUI.color = Color.yellow;
				GUI.Label(Rect(5,225+50,400,20),  "DMG" );
				GUI.Label(Rect(5,225+70,400,20),  "RAT" );
				GUI.Label(Rect(5,225+90,400,20),  "RNG" );
				if(itemlist[shopselected].prefab.GetComponent(sc_meelegun).blunt)
				{GUI.Label(Rect(5,225+110,400,20),  language[languageset].frase[73]);}
				else{GUI.Label(Rect(5,225+110,400,20),  language[languageset].frase[74]);}
									
				GUI.color = Color.green;
				
				cont =0;
				while( ( cont*10 < itemlist[shopselected].prefab.GetComponent(sc_meelegun).dmg) && ((cont*6) < 150) )
				{
					GUI.color.a = 0.5;
					if(itemlist[shopselected].prefab.GetComponent(sc_meelegun).dmg-(cont*10) > 10)
					{GUI.DrawTexture(Rect(50+(cont*6),225+55,5,10),SL_line,ScaleMode.StretchToFill, true, 0);}
					else
					{
						tmpfloat = itemlist[shopselected].prefab.GetComponent(sc_meelegun).dmg-(cont*10);
						GUI.DrawTexture(Rect(50+(cont*6),225+55,tmpfloat/2,10),SL_line,ScaleMode.StretchToFill, true, 0);
					}
					cont++;
				}
				cont =0;
				while( ( cont*10 < (100-itemlist[shopselected].prefab.GetComponent(sc_meelegun).endtime[0])) && ((cont*6) < 150) )
				{
					GUI.color.a = 0.5;
					if((100-itemlist[shopselected].prefab.GetComponent(sc_meelegun).endtime[0])-(cont*10) > 10)
					{GUI.DrawTexture(Rect(50+(cont*6),225+75,5,10),SL_line,ScaleMode.StretchToFill, true, 0);}
					else
					{
						tmpfloat = (100-itemlist[shopselected].prefab.GetComponent(sc_meelegun).endtime[0])-(cont*10);
						GUI.DrawTexture(Rect(50+(cont*6),225+75,tmpfloat/2,10),SL_line,ScaleMode.StretchToFill, true, 0);
					}
					cont++;
				}
				cont = 0;
				tmpfloat2 = 0;
				while( ( tmpfloat2*0.2 < itemlist[shopselected].prefab.GetComponent(sc_meelegun).range) && ((cont*6) < 150) )
				{
					GUI.color.a = 0.5;
					if(itemlist[shopselected].prefab.GetComponent(sc_meelegun).range-(tmpfloat2*0.2) > 0.2)
					{GUI.DrawTexture(Rect(50+(cont*6),225+95,5,10),SL_line,ScaleMode.StretchToFill, true, 0);}
					else
					{
						tmpfloat = itemlist[shopselected].prefab.GetComponent(sc_meelegun).range-(tmpfloat2*0.2);
						GUI.DrawTexture(Rect(50+(cont*6),225+95,tmpfloat/2,10),SL_line,ScaleMode.StretchToFill, true, 0);
					}
					cont++;
					tmpfloat2 = cont;
				}			
			}
			if(itemlist[shopselected].tipo == 4)if( itemlist[shopselected].prefab.GetComponent(sc_throwable).isgrenade)
			{
				if(itemlist[shopselected].prefab.GetComponent(sc_throwable).throw_prefab.GetComponent(sc_granada) != null)
				{
					GUI.color = Color.yellow;
					GUI.Label(Rect(5,225+50,400,20),  "DMG" );
					GUI.Label(Rect(5,225+70,400,20),  "RNG" );
										
					GUI.color = Color.green;
				
					var tmpgranada:sc_granada = itemlist[shopselected].prefab.GetComponent(sc_throwable).throw_prefab.GetComponent(sc_granada);
					cont = 0;
					tmpfloat2 = 0;
					while( ( tmpfloat2*35 < tmpgranada.dano ) && ((cont*6) < 150) )
					{
						GUI.color.a = 0.5;
						if(tmpgranada.dano-(tmpfloat2*35) > 35)
						{GUI.DrawTexture(Rect(50+(cont*6),225+55,5,10),SL_line,ScaleMode.StretchToFill, true, 0);}
						else
						{
							tmpfloat = tmpgranada.dano-(tmpfloat2*35);
							GUI.DrawTexture(Rect(50+(cont*6),225+55,tmpfloat2/2,10),SL_line,ScaleMode.StretchToFill, true, 0);
						}
						cont++;
						tmpfloat2 = cont;
					}
					
					cont = 0;
					tmpfloat2 = 0;
					while( ( tmpfloat2*4 < tmpgranada.exp_range ) && ((cont*6) < 150) )
					{
						GUI.color.a = 0.5;
						if(tmpgranada.dano-(tmpfloat2*4) > 4)
						{GUI.DrawTexture(Rect(50+(cont*6),225+75,5,10),SL_line,ScaleMode.StretchToFill, true, 0);}
						else
						{
							tmpfloat = tmpgranada.dano-(tmpfloat2*4);
							GUI.DrawTexture(Rect(50+(cont*6),225+75,tmpfloat2/2,10),SL_line,ScaleMode.StretchToFill, true, 0);
						}
						cont++;
						tmpfloat2 = cont;
					}
				}
			}
		}
		
		GUI.color = Color.white;
		///////////////////////////////////////////////////////////////////////
		/*menu de linguas*/
		cont = 0;
		while(cont < language.Length)
		{
			tmpvec3 = Input.mousePosition;
			tmpvec3.y = Screen.height-Input.mousePosition.y;
			if( Rect(10+(40*cont),Screen.height-40,32,32).Contains(tmpvec3) )
			{
				GUI.skin = guiskinerr;
				GUI.Label(Rect(0,Screen.height-70,140,25), language[cont].frase[0] );
				GUI.skin = guiskin;
			}
			GUI.DrawTexture(Rect(10+(40*cont),Screen.height-40,32,32),language[cont].flag,ScaleMode.StretchToFill, true, 0);
			if( GUI.Button(Rect(10+(40*cont),Screen.height-40,32,32),"") )
			{
				languageset = cont;
			}
			cont++;
		}
		
		/////////////////////////////////////////////fullscreen button
		GUI.color.a = 0.5;
		tmpvec3 = Input.mousePosition;
		tmpvec3.y = Screen.height-Input.mousePosition.y;
		if(Rect(160,Screen.height-fscreenbuton.height-8,fscreenbuton.width,fscreenbuton.height).Contains(tmpvec3))
		{
			GUI.color.a = 1;
			GUI.skin = guiSlist;
			GUI.Label(Rect(130,Screen.height-fscreenbuton.height-35,100,25),"Fullscreen");
			GUI.skin = guiskin;
		}
		
		GUI.DrawTexture(Rect(160,Screen.height-fscreenbuton.height-8,fscreenbuton.width,fscreenbuton.height),fscreenbuton,ScaleMode.StretchToFill, true, 0);
		
		GUI.color.a = 1;
		
		if(GUI.Button(Rect(160,Screen.height-fscreenbuton.height-8,fscreenbuton.width,fscreenbuton.height),"") )
		{
			if(!Screen.fullScreen)
			{
				screenlastx = Screen.width;
				screenlasty = Screen.height;
				Screen.SetResolution (Screen.resolutions[Screen.resolutions.Length-1].width, Screen.resolutions[Screen.resolutions.Length-1].height, true);
			}
			else
			{
				Screen.SetResolution (screenlastx, screenlasty, false);
			}
			mane_up_cont = 1;
		}
	}
	
	if(sharedhud == 1)
	{
		if(elmanequim != null)if(!elmanequim.gameObject.activeSelf)
		{
			elmanequim.gameObject.SetActive(true);
		}
		if(item_show != null)if(item_show.gameObject.activeSelf)
		{
			item_show.gameObject.SetActive(false);
		}
		
		GUI.color = Color.white;
		GUI.DrawTexture(Rect(10,10,menulogo.width*0.3,menulogo.height*0.3),menulogo,ScaleMode.StretchToFill, true, 0);
		GUI.DrawTexture(Rect((menulogo.width*0.3)+20,5,1,Screen.height-10),SL_line,ScaleMode.StretchToFill, true, 0);
		
		GUI.skin = newgui_square;
		GUI.color = Color.red;
		GUI.Box(Rect(10,(menulogo.height*0.3)+45,200,28),"");
		GUI.Box(Rect(10,(menulogo.height*0.3)+380,200,28),"");
		
		GUI.skin.label.fontStyle = FontStyle.Normal;
		GUI.color = Color.yellow;
		GUI.Label(Rect(21,(menulogo.height*0.3)+46,175,25), playernick );
		GUI.Label(Rect(21,(menulogo.height*0.3)+381,175,25), money+" $" );
		GUI.skin.label.fontStyle = FontStyle.Bold;
		
		GUI.color = Color.white;
		GUI.skin = guiskinerr;
		GUI.Label(Rect(25,(menulogo.height*0.3)+12,150,25), buildversion );
		GUI.Label(Rect(middlepos-400,Screen.height-25,800,20), errormsg );
		GUI.skin = guiskin;
		
		/*menu de linguas*/
		cont = 0;
		while(cont < language.Length)
		{
			tmpvec3 = Input.mousePosition;
			tmpvec3.y = Screen.height-Input.mousePosition.y;
			if( Rect(10+(40*cont),Screen.height-40,32,32).Contains(tmpvec3) )
			{
				GUI.skin = guiskinerr;
				GUI.Label(Rect(0,Screen.height-70,140,25), language[cont].frase[0] );
				GUI.skin = guiskin;
			}
			GUI.DrawTexture(Rect(10+(40*cont),Screen.height-40,32,32),language[cont].flag,ScaleMode.StretchToFill, true, 0);
			if( GUI.Button(Rect(10+(40*cont),Screen.height-40,32,32),"") )
			{
				languageset = cont;
			}
			cont++;
		}
		
		/////////////////////////////////////////////fullscreen button
		GUI.color.a = 0.5;
		tmpvec3 = Input.mousePosition;
		tmpvec3.y = Screen.height-Input.mousePosition.y;
		if(Rect(160,Screen.height-fscreenbuton.height-8,fscreenbuton.width,fscreenbuton.height).Contains(tmpvec3))
		{
			GUI.color.a = 1;
			GUI.skin = guiSlist;
			GUI.Label(Rect(130,Screen.height-fscreenbuton.height-35,100,25),"Fullscreen");
			GUI.skin = guiskin;
		}
		
		GUI.DrawTexture(Rect(160,Screen.height-fscreenbuton.height-8,fscreenbuton.width,fscreenbuton.height),fscreenbuton,ScaleMode.StretchToFill, true, 0);
		
		GUI.color.a = 1;
		
		if(GUI.Button(Rect(160,Screen.height-fscreenbuton.height-8,fscreenbuton.width,fscreenbuton.height),"") )
		{
			if(!Screen.fullScreen)
			{
				screenlastx = Screen.width;
				screenlasty = Screen.height;
				Screen.SetResolution (Screen.resolutions[Screen.resolutions.Length-1].width, Screen.resolutions[Screen.resolutions.Length-1].height, true);
			}
			else
			{
				Screen.SetResolution (screenlastx, screenlasty, false);
			}
			mane_up_cont = 1;
		}
	}
}

function cleanbodies(notdelete:Transform)
{
}



/*

menu de opssao

-antialias
-vsync
-bodycount
-occlusion

-music
-sound

*/