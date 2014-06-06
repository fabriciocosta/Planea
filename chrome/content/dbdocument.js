/**
*	PlaneaDoc
*
*		base document Object
*		
*/

var base_db_xml_path = "chrome://planea/content/base_de_datos.xml";
var help_base_db_xml_path = "chrome://planea/content/ayuda.xml";
var restore_db_xml_path = "chrome://planea/content/base_de_datos.bk.xml";
var help_restore_db_xml_path = "chrome://planea/content/ayuda.bk.xml";
var scheme_base_db_xml_path = "http://www.moldeointeractive.com.ar/wiwe/principal/home/taxones.php?_tema_=planea&_modo_=esquema&rrr=";
var help_scheme_base_db_xml_path = "http://www.moldeointeractive.com.ar/wiwe/principal/home/taxones.php?_tema_=planea&_modo_=ayuda&rrr=";
var home_path = fs.getHomeDir();
var profile_path = fs.getProfileDirectory();
var local_scheme_path = profile_path + "\\base_de_datos.xml";
var local_help_path = profile_path + "\\ayuda.xml";
	
var PlaneaDoc = function() {
		
	var docExtension = ".pla";
	var docFilename;
	var docFilepath;
	var folder_img;
	var folder_attach;
	var PlaneaDocZ;
	var loadedDocument = false;
	var savedDocument = false;
	var self = this;
		
		
	var data = "";
	var xmlfile = "";
	var __db_file_path = "";
	var base_db_xml = "";
	
	
	var _dbXMLDatabase = {}; 

	self.newDocument = function() {
	
		self.initialize();
	
		var home_path = fs.getHomeDir();
		docFilename = "untitled"+docExtension;
		docFilepath = normalizePath( home_path + "/"+docFilename );
		
		
		/*
		PlaneaDocZ = new JSZip();
		self.folder_img = PlaneaDocZ.folder("images");
		self.folder_attach = PlaneaDocZ.folder("attachments");
		*/
		
		log( "PlaneaDoc() > PlaneaDoc.newDocument() > " + docFilepath );
		//alert( typeof( newfile_path ) );

		log("PlaneaDoc() > Creando nuevo proyecto:"+docFilepath);
		__db_file_path = docFilepath;
	
			
		_loadxml( self.base_db_xml );
				
		setActualDB( docFilepath );
		saveActualDB();
	
		HideForms();
		//loadFields( "arbol:Presentación:Título" );
		
		self.createHtmlAppInterface();
	}
	
	
	self.initialize = function() {
		
		self.initializeHelp();
		
		self.base_db_xml = OpenScheme();
		
		if (self.base_db_xml.length<2000) {
			error("PlaneaDoc() > xml database not valid!");
		}
	    //async version
		/*
		fs.openUri( base_db_xml_path, true, function(data) {
			base_db_xml = data;
		} );
		*/
	}
	
	self.initializeHelp = function() {
		_ayudas = {};
		/*
		var helpfile_path = "chrome://planea/content/ayuda.xml";
		var str = fs.openUri(helpfile_path);
		*/
		it_seccion = "";
		var str = OpenHelpScheme();
		var parser = new DOMParser();
		try {
			_helptree = parser.parseFromString( str, "text/xml");
		} catch(e) {
			alert("PlaneaDoc() > initializeHelp() > error parsing XML > " + e);
		}
		loadHelpIterative( _helptree.documentElement, 0, "", 10 );
	}
	
	self.open = function( filepath ) {
		
		self.initializeHelp();
		log( "PlaneaDoc() > Abriendo: " + filepath);
		loadDB( filepath );
		self.loadedDocument = true;
	}
	
	self.save = function() {
	
		log( "PlaneaDoc() > Guardando " + self.filepath );
		
		//var content = zip.generate({type:"blob"});
		//saveAs(content, filename );
		saveActualDB();
	}
	
	self.saveAs = function( filepath ) {
	
		log( "PlaneaDoc() > Guardando como ... " + filepath );
		
		//var content = self.PlaneaDocZ.generate({type:"blob"});
		//saveAs(content, filename );
		
		setActualDB( filepath );	
		saveActualDB();
	}
	
	self.attachFile = function( filedoc ) {
	
	}
	
	self.attachImage = function( fileimage ) {
		self.folder_img.file( fileimage, imgData, {base64: true});
	}

	self.close = function() {
	    nformularios = 0;
		_formulario_actual = 0;
		_formularios = new Array();
		_htmltree = new Array();
		_dbForms = new Array();
		_dbFields = new Array();
		_dbRecords = new Array();
		_dbobjects = new Array();
		__dbstring = "";

		var htmlFormularios = document.getElementById("dbformularios");
		htmlFormularios.innerHTML = '';

		__db_file_path = "";
	}
	
	self.getBaseNode = function() {
		return  self._dbXMLDatabase.documentElement;
	}
	
	self.getXMLDatabase = function() {
		return  self._dbXMLDatabase;
	}
	/*INTERNAL METHODS*/
	
	function OpenScheme() {
		//alert("opening updated scheme");
		var installedModTime = fs.getlastModifiedTime(base_db_xml_path);
		var xmlcontent = false;
		try {
		 xmlcontent = fs.readFile(local_scheme_path);
		} catch (e) {
		  xmlcontent = false;
		}

		if (xmlcontent) {
			var downloadedModTime = fs.getlastModifiedTime(local_scheme_path);
			if (installedModTime>downloadedModTime) {
				log("opening legacy scheme, it's newer");
				xmlcontent = fs.openUri( base_db_xml_path);
			}
			else log("opening downloaded scheme");
		} 
		else
		{
			log("opening legacy scheme");
			xmlcontent = fs.openUri( base_db_xml_path);
		}
		return xmlcontent;	
	}
	
	function OpenHelpScheme() {
		//alert("opening updated help scheme");
		var installedModTime = fs.getlastModifiedTime(help_base_db_xml_path);
		var xmlcontent = false;
		try {
		 xmlcontent = fs.readFile(local_help_path);
		} catch (e) {
		  xmlcontent = false;
		}
		
		if (xmlcontent) {
			var downloadedModTime = fs.getlastModifiedTime(local_help_path);
			if (installedModTime>downloadedModTime) {
				log("opening legacy HELP scheme, it's newer");
				xmlcontent = fs.openUri( help_base_db_xml_path);
			} else log("opening downloaded HELP scheme");
		} 
		else {
			log("opening legacy HELP scheme");
			xmlcontent = fs.openUri( help_base_db_xml_path);
		}
		return xmlcontent;	
	}
	

	function _loadxml( xmldata ) {
		
		var parser = new DOMParser();
		
		if (xmldata.length<2000) return error("PlaneaDoc() > not enough data in XML: " + xmldata );
		
		try {    
			self._dbXMLDatabase = parser.parseFromString( xmldata, "text/xml");
		} catch(e) {
			error("PlaneaDoc() > _loadxml() > error parsing XML : "+ e);
		}
					
		if (self._dbXMLDatabase.documentElement) {
			log("PlaneaDoc() > loading Database from XML...");
			loadTree2( self._dbXMLDatabase.documentElement ); //iterative
			log("PlaneaDoc() > loading sections structure...");
			loadTreeProgress( self._dbXMLDatabase.documentElement );
		} else {
			error("PlaneaDoc() > _loadxml() > NO documentElement to load database from XML.");
			return false;
		}
		
	}

	function loadDB( file_db_path ) {

		var data = fs.readFile( normalizePath(file_db_path) );
		if (data) {
			log("PlaneaDoc() > reading ok! from file_db_path ["+file_db_path+"]");
			setProjectFilePath( file_db_path );        
			_loadxml( data );	
		}
		return (data!==false);
	}

	function strReducePath( strpath, maxlen ) {
			var strpath2 = strpath.substr(	Math.max( 0, __db_file_path.length - maxlen ), 
																																												Math.min( maxlen, __db_file_path.length ) );

			if (strpath2.length<strpath.length) strpath2 = "..."+strpath2;
			return strpath2;
	}

	function setProjectFilePath( file_db_path ) {

			
	
			if ( file_db_path!=undefined ) {
					if (file_db_path.indexOf(docExtension)==false) {
						file_db_path+=docExtension;
					}
			
					__db_file_path = normalizePath(file_db_path);
			}
			self.filepath = __db_file_path;
			
			var pfp = document.getElementById('projectfilepath');
			var main = document.getElementById('main');
			if (pfp) {
		
					pfp.innerHTML = strReducePath( __db_file_path, 50 ); 
					  var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
							  .getService(Components.interfaces.nsIXULAppInfo);
							  
					if (main) main.setAttribute('title', appInfo.name + " " + appInfo.version + " - "+__db_file_path );
				
			} else error("PlaneaDoc() > no projecfilepath HTML id");
				
	}

	function setActualDB( file_db_path ) {
		setProjectFilePath( file_db_path );
	}

	function saveDB( file_db_path, _dbtree ) {

		setActualDB( file_db_path );

		log("PlaneaDoc() > saveDB:" + __db_file_path );

		var serializer = new XMLSerializer();
		var serial_xml = serializer.serializeToString(_dbtree);
					
		fs.writeFile( __db_file_path, serial_xml );

	}

	function saveActualDB() {
		saveDB( __db_file_path, self._dbXMLDatabase );
	}


	/*DEBUGGING INTERFACE > auto portable interface (future)*/
	self.createHtmlAppInterface = function() {

		var planeapath = "D:\\0_DESARROLLO\\1_MOLDEOINTERACTIVE\\0_desarrollo\\emeproject\\GITHUB\\Planea\\chrome";
		var dt = fs.getlastModifiedTime( planeapath );
		
		if (dt===false) { log("createHtmlAppInterface() > no path for html app interface.");  return; }
		
		var full_interface = document.getElementById("container");
		var header_interface = document.getElementById("workspace_header");
		var footer_interface = document.getElementById("workspace_footer");

		var AppInterHeader = header_interface.innerHTML.replace( new RegExp("html\\:","gi"), "");
		var AppInterBody = full_interface.outerHTML.replace( new RegExp("html\\:","gi"), "");
		var AppInterFooter = footer_interface.innerHTML.replace( new RegExp("html\\:","gi"), "");
		var AppInter = '<!doctype html><html lang="es"><head><meta http-equiv="Content-Type" content="text/html;charset=UTF-8"><title>AppInterface</title>';
			AppInter+= '<link href="skin/site2.css" rel="stylesheet" media="screen">';
			AppInter+= '<script type="text/javascript" src="content/js/wiwe.js"></script>';
			AppInter+= '<script type="text/javascript" src="content/dbnavigation.js"></script>';
			/*AppInter+= '<script type="text/javascript" src="content/dbfield.js"></script>';*/
			AppInter+= '<script type="text/javascript" src="content/dbhelp.js"></script>';
			AppInter+= '<script type="text/javascript" src="content/tools.js"></script>';
			AppInter+= '<script type="text/javascript" src="content/js/jquery-1.10.2.js"></script>';
			AppInter+= '<script type="text/javascript" src="content/html_test.js"></script>';
			AppInter+= '<style>{STYLE}</style>';
			
			var dbFstr = "";
			var coma = '';
			for(var nseccion in _dbForms) {
			
				var dbseccion = _dbForms[nseccion];
				dbFstr+= coma + "\n'"+nseccion+"':" + JSON.stringify( dbseccion );
				coma = ',';
			}
			
			var dbFieldsstr = "";
			var coma = '';
			for(var nfield in _dbFields) {
			
				var dbfield = _dbFields[nfield];
				dbFieldsstr+= coma + "\n'"+nfield+"':" + JSON.stringify( dbfield );
				coma = ',';
			}
			
			var dbHelpstr = "";
			var dbHelpFull = "";
			coma = '';
			for(var nseccion in _ayudas) {
			
				var ayudaseccion = _ayudas[nseccion];
				dbHelpstr+= coma + "\n'"+nseccion+"':" + JSON.stringify( ayudaseccion );
				for(var fullnseccion in ayudaseccion['full']) {
					var fullsection = ayudaseccion['full'][fullnseccion];
					dbHelpFull+= "\n"+" _ayudas['"+nseccion+"']['full']['"+fullnseccion+"'] = "+JSON.stringify( fullsection )+";";
				}
				coma = ',';
			}		
			
			var db_formularios = "";
			db_formularios = JSON.stringify(_formularios);
			
			//AppInter+= "<script> var _dbForms = {"+dbFstr+"}; </script>";
			//AppInter+= "<script> var _ayudas = {"+dbHelpstr+"}; </script>";
			//AppInter+= "<script> var _dbFields = {"+dbFieldsstr+"}; </script>";
			//AppInter+= "<script> "+dbHelpFull+"; </script>";
			//AppInter+= "<script> var _formulario_actual = "+_formulario_actual+"; var _formulario_total = "+_formulario_total+"; var _formularios = "+db_formularios+"; </script>";
			//AppInter+= "<script> var _dbFields = "+JSON.stringify( _dbFields )+"; </script>";
			//AppInter+= "<script> var _dbobjects = "+JSON.stringify( _dbobjects )+"; </script>";
			AppInter+= '</head>';
			AppInter+= '<body class="apphtml">{BODYHEADER}{BODY}{BODYFOOTER}</body></html>';	
			AppInter = AppInter.replace("{BODYHEADER}",AppInterHeader);
			AppInter = AppInter.replace("{BODY}",AppInterBody);
			AppInter = AppInter.replace("{BODYFOOTER}",AppInterFooter);
			AppInter = AppInter.replace(/\/><cleartxtarea\/>/gi,"></textarea>");
			AppInter = AppInter.replace(/<textbox/gi,"<input type=\"text\" ");
			//log ( db_formularios );
			//log ( dbFstr );
			//log ( dbHelpstr );
			//log (dbHelpFull);
			
			//log(JSON.stringify(_dbobjects, null, "\n"));
		
		fs.writeFile( normalizePath( planeapath + "\\AppInterface.html" ), AppInter  );
	}
	self.createHtmlPrintableElement = function( in_body, stylesheet ) {
		var AppInter = '<!doctype html><html lang="es"><head><meta http-equiv="Content-Type" content="text/html;charset=UTF-8"><title>Element</title>';
		var style_site = "chrome://planea/skin/site.css";
		if (stylesheet!=undefined) style_site = stylesheet;
		var content_style = fs.openUri(style_site);
		AppInter+= '<style>'+content_style+'</style>';
		AppInter+= '</head>';
		AppInter+= '<body class="apphtml">{BODYHEADER}{BODY}{BODYFOOTER}</body></html>';	
		AppInter = AppInter.replace("{BODYHEADER}","");
		AppInter = AppInter.replace("{BODY}", in_body );
		AppInter = AppInter.replace("{BODYFOOTER}","");	
		return AppInter;
	}
	
	self.createHtmlPrintable = function() {

		//var planeapath = "D:\\0_DESARROLLO\\1_MOLDEOINTERACTIVE\\0_desarrollo\\eme project\\GITHUB\\Planea\\chrome";
		//var dt = fs.getlastModifiedTime( planeapath );
		
		//if (dt===false) { log("createHtmlAppInterface() > no path for html app interface.");  return; }
		
		var full_pages = document.getElementById("dbmultipage");
		//var header_interface = document.getElementById("workspace_header");
		//var footer_interface = document.getElementById("workspace_footer");

		//var AppInterHeader = header_interface.innerHTML.replace( new RegExp("html\\:","gi"), "");
		var AppInterBody = full_pages.innerHTML.replace( new RegExp("html\\:","gi"), "");
		//var AppInterFooter = footer_interface.innerHTML.replace( new RegExp("html\\:","gi"), "");
		var AppInter = '<!doctype html><html lang="es"><head><meta http-equiv="Content-Type" content="text/html;charset=UTF-8"><title>AppInterface</title>';
			//AppInter+= '<link href="skin/site2.css" rel="stylesheet" media="screen">';
			var style_site = "chrome://planea/skin/site.css";
			var content_style = fs.openUri(style_site);
			AppInter+= '<style>'+content_style+'</style>';

			/*
			var dbFstr = "";
			var coma = '';
			for(var nseccion in _dbForms) {
			
				var dbseccion = _dbForms[nseccion];
				dbFstr+= coma + "\n'"+nseccion+"':" + JSON.stringify( dbseccion );
				coma = ',';
			}
			
			var dbFieldsstr = "";
			var coma = '';
			for(var nfield in _dbFields) {
			
				var dbfield = _dbFields[nfield];
				dbFieldsstr+= coma + "\n'"+nfield+"':" + JSON.stringify( dbfield );
				coma = ',';
			}
			
			var dbHelpstr = "";
			var dbHelpFull = "";
			coma = '';
			for(var nseccion in _ayudas) {
			
				var ayudaseccion = _ayudas[nseccion];
				dbHelpstr+= coma + "\n'"+nseccion+"':" + JSON.stringify( ayudaseccion );
				for(var fullnseccion in ayudaseccion['full']) {
					var fullsection = ayudaseccion['full'][fullnseccion];
					dbHelpFull+= "\n"+" _ayudas['"+nseccion+"']['full']['"+fullnseccion+"'] = "+JSON.stringify( fullsection )+";";
				}
				coma = ',';
			}		
			
			var db_formularios = "";
			db_formularios = JSON.stringify(_formularios);
			
			AppInter+= "<script> var _dbForms = {"+dbFstr+"}; </script>";
			AppInter+= "<script> var _ayudas = {"+dbHelpstr+"}; </script>";
			AppInter+= "<script> var _dbFields = {"+dbFieldsstr+"}; </script>";
			AppInter+= "<script> "+dbHelpFull+"; </script>";
			AppInter+= "<script> var _formulario_actual = "+_formulario_actual+"; var _formulario_total = "+_formulario_total+"; var _formularios = "+db_formularios+"; </script>";
			//AppInter+= "<script> var _dbFields = "+JSON.stringify( _dbFields )+"; </script>";
			//AppInter+= "<script> var _dbobjects = "+JSON.stringify( _dbobjects )+"; </script>";
			*/
			AppInter+= '</head>';
			AppInter+= '<body class="apphtml">{BODYHEADER}{BODY}{BODYFOOTER}</body></html>';	
			AppInter = AppInter.replace("{BODYHEADER}","");
			AppInter = AppInter.replace("{BODY}",AppInterBody);
			AppInter = AppInter.replace("{BODYFOOTER}","");
			AppInter = AppInter.replace(/\/><cleartxtarea\/>/gi,"></textarea>");
			AppInter = AppInter.replace(/<textbox/gi,"<input type=\"text\" ");
			//log ( db_formularios );
			//log ( dbFstr );
			//log ( dbHelpstr );
			//log (dbHelpFull);
			
			//log(JSON.stringify(_dbobjects, null, "\n"));
		
		//fs.writeFile( normalizePath( planeapath + "\\AppInterface.html" ), AppInter  );
			return AppInter;
	}

};




/**
*
*	DOCUMENT MANIPULATION METHODS
*
*/

var PlaneaDocument = {};

function newProject() {
	
	PlaneaDocument = new PlaneaDoc();
	PlaneaDocument.newDocument();
}

/**
* 	Open a XML import database file, then loads it
*/

function openProject() {
	var filepicker = fs.newFilePicker();
	filepicker.init(window, "Abrir un proyecto Planea existente", nsIFilePicker.modeOpen);	
	filepicker.appendFilters( nsIFilePicker.filterText | nsIFilePicker.filterAll );
	filepicker.appendFilter("Archivos Planea","*.pla;");
	//filepicker.appendFilter("Todos los archivos","*.*;");
	
	var res = filepicker.show();
	
	if (res != nsIFilePicker.returnCancel){
		
		var thefile = filepicker.file;
		
		PlaneaDocument = new PlaneaDoc();
		PlaneaDocument.open( thefile.path );
		if ( PlaneaDocument && PlaneaDocument.loadedDocument ) {
			HideForms();
			loadAllFields();
		}
	}
  }

function saveProject() {
   /*document.getElementById('project_persona').innerHTML = document.getElementById('creador').value;*/
	if (PlaneaDocument) {
		PlaneaDocument.save();
	 } else {
		alert("invalid PlaneaDocument");
   }
}  
 
function saveProjectAs() {
		var filepicker = fs.newFilePicker();
		filepicker.init(window, "Guardar un proyecto Planea como...", nsIFilePicker.modeSave);
		filepicker.appendFilter("Archivos Planea","*.pla; *.xml");
		filepicker.appendFilters( nsIFilePicker.filterAll );
		
		var res = filepicker.show();
		
		if ( res != nsIFilePicker.returnCancel) {
		  var thefile = filepicker.file;
		 		 
		  if (PlaneaDocument) {
		    var planea_file_path = fs.setExtension( thefile.path, "pla");
			PlaneaDocument.saveAs( planea_file_path );
			return planea_file_path;
		   } else {
				alert("invalid PlaneaDocument");
		   }
		   
		}
		return "";
	
}

function savePdfAs( data, format ) {
		var filepicker = fs.newFilePicker();
		filepicker.init(window, "Guardar informe Planea como PDF...", nsIFilePicker.modeSave);	
		
		filepicker.appendFilter("Archivos PDF","*.pdf");
		filepicker.appendFilters( nsIFilePicker.filterAll );
		
		var res = filepicker.show();
		
		if ( res != nsIFilePicker.returnCancel ){
		  var thefile = filepicker.file;
		  var pdf_file_path = fs.setExtension( thefile.path, "pdf");
		  if (format=="uri") {
			log("savePdfAs: saving as Uri: " + pdf_file_path);
			fs.saveUri( pdf_file_path, data  );
		  } else if (format=="binary") {
		    log("savePdfAs: saving as binary: " + pdf_file_path);
			fs.writeFileBinary( pdf_file_path, data  );
		  } else {
		  	log("savePdfAs: saving as normal string : " + pdf_file_path);
			fs.writeFile( pdf_file_path, data  );
		  }
		  return pdf_file_path;
		}
		return "";
}

function saveDocxAs( data, format ) {
		var filepicker = fs.newFilePicker();
		filepicker.init(window, "Guardar informe Planea como PDF...", nsIFilePicker.modeSave);	
		filepicker.appendFilter("Archivos DOCX","*.docx");
		filepicker.appendFilters( nsIFilePicker.filterAll );
		
		var res = filepicker.show();
		
		if ( res != nsIFilePicker.returnCancel){
		  var thefile = filepicker.file;
		  var docx_file_path = fs.setExtension( thefile.path, "docx"); 
		  if (format=="uri") {
			log("saveDocxAs: saving as uri : " + docx_file_path);
			fs.saveUri( docx_file_path, data  );
		  } else if (format=="binary") {
		    log("saveDocxAs: saving as binary: " + docx_file_path);
			fs.writeFileBinary( docx_file_path, data  );
		  } else {
		  	log("saveDocxAs: saving as normal string : " + docx_file_path);
			fs.writeFile( docx_file_path, data  );
		  }
		  return docx_file_path;
		}
		return "";
	
}

function saveHtmlAs( data, format ) {
		var filepicker = fs.newFilePicker();
		filepicker.init(window, "Guardar informe Planea como Html...", nsIFilePicker.modeSave);	
		
		filepicker.appendFilter("Archivos HTML","*.html");
		filepicker.appendFilters( nsIFilePicker.filterAll );
		
		var res = filepicker.show();
		
		if (res == nsIFilePicker.returnOK){
		  var thefile = filepicker.file;
		  var html_file_path = fs.setExtension( thefile.path, "html"); 		 
		  if (format=="uri") {
			log("saveHtmlAs: saving as uri : " + html_file_path);
			fs.saveUri( html_file_path, data  );
		  } else if (format=="binary") {
		    log("saveHtmlAs: saving as binary: " + html_file_path);
			fs.writeFileBinary( html_file_path, data  );
		  } else {
		  	log("saveHtmlAs: saving as normal string : " + html_file_path);
			fs.writeFile( html_file_path, data  );
		  }
		  return html_file_path;
		}
		return "";
	
}

function closeProject() {
    
	if (PlaneaDocument)
		PlaneaDocument.close();

    planea.quit(true);
}

function printProject() {
	//window.print();
	//windowPrint();
	if (PlaneaDocument)
		loadFields("arbol:Informes");
}

function updateScheme() {
	var randomi = Math.random()+Math.random();

	//alert("Se descargarᡬa 򬴩ma versi󮠤el esquema. Puede tardar unos segundos.");
	base_db_xml = fs.openUri( scheme_base_db_xml_path  + randomi);
	path_to_save_to = fs.chromeToPath(base_db_xml_path);
	
	help_base_db_xml = fs.openUri( help_scheme_base_db_xml_path + randomi);
	help_path_to_save_to = fs.chromeToPath(help_base_db_xml_path);
	
	if (base_db_xml && help_base_db_xml) {		
		fs.writeFile( local_scheme_path, base_db_xml );
		fs.writeFile( local_help_path, help_base_db_xml );
		alert("Descarga terminada. Cree un nuevo proyecto para ver los cambios.");
	}
}

function restoreScheme() {

	//alert("Se descargarᡬa 򬴩ma versi󮠤el esquema. Puede tardar unos segundos.");
	base_db_xml = fs.openUri( restore_db_xml_path );
	path_to_save_to = fs.chromeToPath(base_db_xml_path);
	
	help_base_db_xml = fs.openUri( help_restore_db_xml_path );
	help_path_to_save_to = fs.chromeToPath( help_base_db_xml_path);	
	if (base_db_xml && help_base_db_xml) {
		//alert( path_to_save_to );
		fs.writeFile( path_to_save_to, base_db_xml );
		fs.writeFile( help_path_to_save_to, help_base_db_xml );
		alert("Restauraci󮠴erminada. Cree un nuevo proyecto.");
	}
}


function windowPrint() {

	showdiv('windowprint');
	//var mypages = document.getElementById('dbmultipage');
	
	var theframe = document.getElementById('htmlframe');
	
	var pDocHTML = PlaneaDocument.createHtmlPrintable();
	
	//showdiv( '' );
	theframe.contentDocument.documentElement.innerHTML = remove_html_namespace( pDocHTML );
	theframe.contentWindow.print();
	setTimeout( function() { 
		hidediv('windowprint'); 
	}, 2000 );
	/*
	var doc = new jsPDF();
	log("doc:"+doc);
	var specialElementHandlers = {
		'#editor': function(element, renderer){
			return true;
		}
	};
	
	doc.fromHTML( remove_html_namespace( pDocHTML ), 15, 15, {
		'width': 170, 
		'elementHandlers': specialElementHandlers
	});
	*/
}
