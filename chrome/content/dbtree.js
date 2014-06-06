/*var dbfile = "D:\\_data\\proyectos\\SINESTESIA\\MOLDEO\\Servicios\\Moldeo Interactive\\Trabajo\\eme project\\pruebas xul\\test.xml";*/

var DBTree = {
    verbose: false
};

var _dbstring;
var _helptree;

var _formularios = [];
var _formulario_actual;
var _formulario_total;
var _dbTreeSelection = [];
var printimages = [];

var max_iterations = 20;
var cat_identifier = 0;
var sec_identifier = 0;
var field_identifier = 0;
var camp_id = 0;



function addTreeBranch( xmlNode, father_herence, herence, id ) {

		if (!_dbTreeBranches[herence]) {
		
			_dbTreeBranches[herence] = {
							'node': xmlNode,
							'id' : id, //incremental identifier
							'isleaf': (xmlNode.nodeName.toLowerCase()=="campo"),
							'father_herence': father_herence,
							'leaves': {},
							'branches': {}
						};
						
		} else {
			error("addTreeBranch( ) > branch ["+herence+"]> already created!");
		}
		
		if (_dbTreeBranches[father_herence]) {		
			_dbTreeBranches[father_herence]["branches"][herence] = _dbTreeBranches[herence];
		}
//		else log("addTreeBranch( ) > no father branch ["+father_herence+"]> already created!");
}

/**
* there is no difference
*/
function addTreeLeaf( xmlNode, father_herence, herence, id ) {

	if (!_dbTreeLeaves[herence]) {
	
		_dbTreeLeaves[herence] = {
						'node': xmlNode,
						'id' : id,
						'isleaf': (xmlNode.nodeName.toLowerCase()=="campo"),
						'father_herence': father_herence,
						'leaves': {}
					};
					
	} else {
		error("addTreeLeaf( ) > branch ["+herence+"]> already created!");
	}
	
	if (_dbTreeLeaves[father_herence]) {
		
		_dbTreeLeaves[father_herence]["leaves"][herence] = _dbTreeLeaves[herence];
		
	} else if (_dbTreeBranches[father_herence]) {
	
		_dbTreeBranches[father_herence]["leaves"][herence] = {
							'node': xmlNode,
							'id' : id,
							'isleaf': (xmlNode.nodeName.toLowerCase()=="campo"),
							'father_herence': father_herence,
							'leaves': {},
		};
		
	}
}

function addForm( xmlNode, index_formulario ) {

        var tienecampos = evaluateXPath( xmlNode, "campo" );
        
        //each section is a form prototype if and only if it has fields in it!!!! 
        // Each form must have fields to show and edit.
        if (tienecampos.length>0) {
            var index_formulario = _formularios.length;
            //log("nuevo posible formulario:" + it_herence + " index_formulario:" + index_formulario );
            _formularios[index_formulario] = "new form";
        }

        return index_formulario;
}

/**
*   Form creation
*   
*   each field create or add to the last form:
*   issue: if a field is a sibling node of a section and behind it, then the form's sections could be messed up.
*   Fields (<campo>need to be contiguous and sections must be
*
*   GOOD!!!
*
*   <campo/>
*   <campo/>
*   ...
*   <seccion/>
*   <seccion/>
*   
*   BAD (dont do this)!!!
*
*   <campo/>
*   ...
*   <seccion/>
*   <seccion/>
*   ....
*   <campo/>
*/

function loadTreeIterative( xmlNode, iteration, herence, enditeration, index_formulario ) {

    var it_herence = herence;
    var __dbstring = "";

    if (DBTree.verbose) log("loadTreeIterative: "+ xmlNode.nodeName + " herence: "+ herence + " iteration: "+iteration+"/" + enditeration )

    if ( iteration == 0) {
        if (DBTree.verbose) log("loadTreeIterative: INIT ITERATION: " + iteration + " herence:" + herence);
        cat_identifier = 0;
        sec_identifier = 0;
        field_identifier = 0;

	    nformularios = 0;
	    _formulario_actual = 0;
	    _formularios = [];
	    _dbForms = [];
		_dbTreeBranches = [];
		_dbTreeLeaves = [];
	    _dbFields = [];
        _dbRecords = [];
        _dbobjects = [];
        __dbstring = "";
		
		var htmlPages = document.getElementById("dbmultipage");
		for(var p in dbPages) {
			var dbp = dbPages[p];
			htmlPages.removeChild(dbp.node);
		}
		dbPages = [];
		
		//
        //htmlPages.innerHTML = '<html:div id="dbformularios" class="formularios">	</html:div>';
        var htmlFormularios = document.getElementById("dbformularios");
        if (htmlFormularios) htmlFormularios.innerHTML = '';
		addNewPage();
    }

    if (iteration >= enditeration) {
        //break the iterator
        return "";
    } else iteration++;
 

    var id_identifier = 0;
    var nombre = "";

    if (DBTree.verbose) log("loadTreeIterative: childNode: "+ xmlNode.nodeName);

	//avoid iterte text nodes
    if ( xmlNode.nodeName == "#text" ) {
        return "";
    } else {
		nombre = xmlNode.nodeName;//by default
		//iterate continues on categories, sections, and fields, and arbol
    	if ( 	xmlNode.nodeName == "categoria" 
				|| xmlNode.nodeName == "seccion" 
				|| xmlNode.nodeName == "campo"  ) {
				
			nombre = getFieldName( xmlNode );
			
        } else if ( xmlNode.nodeName !="arbol") {
			//anything else iteration stops...
			return "";
		}       
    }

	var father_herence = it_herence;
    if (herence!="") it_herence = herence + ":" + nombre;
    else it_herence = nombre;

	/*categorias*/
	if ( xmlNode.nodeName == "categoria" ) {
        cat_identifier++;
        id_identifier = cat_identifier;
        index_formulario = addForm( xmlNode, index_formulario );
        //NEXT ITERATION FOLLOWS ( seccion || campo )

    /*secciones*/
    } else if ( xmlNode.nodeName == "seccion" ) {
        sec_identifier++;
        id_identifier = sec_identifier;        
        index_formulario = addForm( xmlNode, index_formulario );
        //NEXT ITERATION FOLLOWS ( seccion || campo )

    /*campo*/
    } else if ( xmlNode.nodeName == "campo" ) {

        field_identifier++;
        id_identifier = field_identifier;

        var template_campo = getFieldTemplate( xmlNode, it_herence, id_identifier );  
		if (template_campo==undefined) error("loadTreeIterative() error no template for : [" + it_herence + "]");
		template_campo = completeFieldTemplate( template_campo, xmlNode, it_herence, trim(nombre), id_identifier );
		
		if (it_herence=="arbol:Presentación:Título:Título")  {
            //document.getElementById('project_persona').innerHTML = document.getElementById('creador').value;
            //document.getElementById('project_title').innerHTML = GetValues( xmlNode );
        }

        if (template_campo) {
		
		    hay_campos_s =true;
			
            addFieldToForm( herence, it_herence, index_formulario, template_campo, xmlNode, id_identifier );
		
        } else error("loadTreeIterative(): Error: herence:" + herence + " nodeName:" + xmlNode.nodeName+" no tiene plantilla de campo");

		addTreeLeaf( xmlNode, father_herence, it_herence, id_identifier );
		
        //NEXT ITERATION STOP! 
        //fields who have multiple (relational) fields, are not processed
        return "";
            
    } else if ( xmlNode.nodeName == "ficha" ) {
        return "";
    } else if ( xmlNode.nodeName == "entrada" ) {
        return "";
    } else if ( xmlNode.nodeName == "entrada" ) {
        return "";
    } else if ( xmlNode.nodeName == "valor" ) {
        return "";
    }

	var clase = GetAttribute(  xmlNode, "clase");
	
				//this is only for <categoria/> and <seccion/> ( tree branches ))
				// <campo/> and others are leaves...
				//onclick="javascript:openclose(\'categoria_{ID}_cuerpo\');"
	var clinkopen = ' onclick="javascript:openclose(\'categoria_{ID}_cuerpo\',\'' + it_herence + '\');" ';
	var slinkopen = ' href="#" onclick="javascript:openclose(\'seccion_{ID}_cuerpo\',\'' + it_herence + '\');" ';	
    var clinkopenform = ' href="#" onclick="javascript:loadFields(\'' + it_herence + '\');openclose(\'categoria_{ID}_cuerpo\',\'' + it_herence + '\');" ';
	var slinkopenform = ' href="#" onclick="javascript:loadFields(\'' + it_herence + '\');openclose(\'seccion_{ID}_cuerpo\',\'' + it_herence + '\');" ';
	var linkform = ' href="#" onclick="javascript:loadFields(\'' + it_herence + '\');" ';	
    
	var title = tree_template[ xmlNode.nodeName ].replace( new RegExp("\\{ID\\}","gi"), id_identifier );
	
    title = title.replace( new RegExp("\\{NOMBRE\\}","gi"), nombre );
	title = title.replace( new RegExp("\\{CLASE\\}","gi"), clase );
    title = title.replace( new RegExp("\\{CLINKOPEN\\}","gi"), clinkopen );
	title = title.replace( new RegExp("\\{CLINKOPENFORM\\}","gi"), clinkopenform );
	title = title.replace( new RegExp("\\{SLINKOPEN\\}","gi"), slinkopen );
	title = title.replace( new RegExp("\\{SLINKOPENFORM\\}","gi"), slinkopenform );	
	title = title.replace( new RegExp("\\{LINKFORM\\}","gi"), linkform );
    title = title.replace( new RegExp("\\{LEVEL\\}","gi"), iteration );
	title = title.replace( new RegExp("\\{ID\\}","gi"), id_identifier );//again
    /*
	var marker = xmlNode.getAttribute("marker");    
    if (marker) title = title.replace( new RegExp("\\{MARKER\\}","gi"), "calc-marker-"+marker );
	*/
    var branchs_open = tree_template[ xmlNode.nodeName + 'open'];
    branchs_open = branchs_open.replace( new RegExp("\\{NOMBRE\\}","gi"), nombre );
    branchs_open = branchs_open.replace( new RegExp("\\{ID\\}","gi"), id_identifier );
    branchs_open = branchs_open.replace( new RegExp("\\{LEVEL\\}","gi"), iteration );
    var branchs_close = tree_template[ xmlNode.nodeName + 'close'];
    branchs_close = branchs_close.replace( new RegExp("\\{NOMBRE\\}","gi"), nombre );
    branchs_close = branchs_close.replace( new RegExp("\\{ID\\}","gi"), id_identifier );
    branchs_close = branchs_close.replace( new RegExp("\\{LEVEL\\}","gi"), iteration );

    addTreeBranch( xmlNode, father_herence, it_herence, id_identifier );
	
	title = title.replace( new RegExp("\\{MARKED\\}","gi"), "" );
	
	__dbstring+= title;
    __dbstring+= branchs_open;
    // ITERATE : note that we could change dynamically the enditeration
    //log( "Procesando hijos de:  " + it_herence );
    //alert( "Procesando hijos de:  " + it_herence + " nodeName:" + xmlNode.nodeName + " nodeValue:" + xmlNode.nodeValue );
    for( var i=0; i<xmlNode.childNodes.length; i++) {
        var childNode = xmlNode.childNodes[i];
        __dbstring+= loadTreeIterative( childNode, iteration, it_herence, enditeration, index_formulario );
        //if (_dbForms[it_herence]) log("_dbForms["+it_herence + "]:" + _dbForms[it_herence]['campos']);
    }
    __dbstring+= branchs_close;
	
	/*if (sectionIsEmpty(it_herence))*/
	//loadFields(it_herence);
    return __dbstring;
}

function loadTree2( docElement ) {

    var doc_HtmlInterface = loadTreeIterative( docElement, 0, "", 10, 0 );
	
    var htmlTree = document.getElementById("dbtree");    
	htmlTree.innerHTML = add_html_namespace( doc_HtmlInterface );
        
    fs.writeFile( normalizePath( fs.getHomeDir()+'/dbtree.html'), doc_HtmlInterface );

    _formulario_total = _formularios.length;
	
    PreviousForm();

	openclose('menu_app_cuerpo','menu_app_cuerpo');
	
	updateTreeMarkedSections();
}

/***
*	SELECTOR-STYLE HTML TREE CONSTRUCTOR (for reports)
*	AND SELECTOR PRINTER > iterate over the selected tree to print the desired report
*	this is done iterating over the sections (<categoria><section>) and into the leaves (<campo>) of the tree: table fields and fields...
*	
*/


function loadTreeSIterative( xmlNode, iteration, herence, enditeration, index_formulario, subfix_template ) {

    var it_herence = herence;
    var __dbstring = "";

    if ( iteration == 0) {
        cat_identifier = 0;
        sec_identifier = 0;
        field_identifier = 0;
    }

    if (iteration >= enditeration) {
        //break the iterator
        return "";
    } else iteration++;
 

    var id_identifier = 0;
    var nombre = "";
	var nsubs = 0;

    if ( xmlNode.nodeName == "#text" ) {
        nombre = "#text";
        return "";
    }
    
    //NOMBRE DEL NODO : siguiente <label> o el texto.
	if ( xmlNode.nodeName == "categoria" 
		|| xmlNode.nodeName == "seccion" 
		|| xmlNode.nodeName == "campo"  ) {
  			  			
		var subsecciones = evaluateXPath( xmlNode, "seccion");				
		nsubs = subsecciones.length;
		
		var labels = xmlNode.getElementsByTagName("label");
		(labels.length>0) ? nombre = trim(labels[0].childNodes[0].nodeValue) : nombre = trim(xmlNode.childNodes[0].nodeValue);
 		 		 		 		
   	} else {   		
        nombre = xmlNode.nodeName;            
        if (xmlNode.nodeName !="arbol" ) 
			return "";
  	}       

    if (herence!="") it_herence = herence + ":" + nombre;
    else it_herence = nombre;


	/*categorias*/
	if ( xmlNode.nodeName == "categoria" ) {
        cat_identifier++;
        id_identifier = cat_identifier;
        //NEXT ITERATION FOLLOWS ( seccion || campo )

    /*secciones*/
    } else if ( xmlNode.nodeName == "seccion" ) {
        sec_identifier++;
        id_identifier = sec_identifier;        
        //NEXT ITERATION FOLLOWS ( seccion || campo )

    /*campo*/
    } else if ( xmlNode.nodeName == "campo" ) {

        field_identifier++;
        id_identifier = field_identifier;

        //NEXT ITERATION STOP! 
        //fields who have multiple (relational) fields, are not processed here!!
	} 
        
    if ( xmlNode.nodeName != "seccion" 
    					&& xmlNode.nodeName != "categoria"
    					&& xmlNode.nodeName != "campo"
    					&& xmlNode.nodeName != "arbol" ) {
        return "";
    }
	
	var field_class = getFieldClass(xmlNode);
	//var field_type = getFieldType(xmlNode);

	//this is only for <categoria/> and <seccion/> ( tree branches ))
	// <campo/> and others are leaves...
				
    //var link = ' href="#" onclick="javascript:loadFields(\'' + it_herence + '\');" ';
    //link a la seccion deberia ser OPCIONAL, por ejemplo haciendo dobleclick
	var link = ' href="#" onclick="javascript:loadFields(\'' + it_herence + '\');" ';
	var pathsel = it_herence; 
	
    var ischecked = "";
    var TreeSelection = _dbTreeSelection[it_herence];    
	if ( TreeSelection 
		&& TreeSelection['selected']==true ) {
		ischecked = 'checked="checked"';
	}     

	if (it_herence.indexOf('Financiero')) {
		TreeSelection['selected'] = false;
		ischecked = '';
	}
	
	//this is for printing the selection, the tree traversal is different
	if ( subfix_template!="" 
		&& subfix_template!="progressbar"
		&& ischecked=="" /*WARNING CHEQUEAR ESTA CONDICION PARA LA IMPRESION: a veces no pasa*/
		&& xmlNode.nodeName!='arbol' ) {
		log("stop tree iteration of node: " + xmlNode.nodeName+' ischecked:'+ ischecked);
		return "";
	}	
	
	
	var nodetemplate = assignFirstFoundedTemplate( [ xmlNode.nodeName  ], 'sel'+subfix_template );
	if (subfix_template=='_print_html5') {
		nodetemplate = assignFirstFoundedTemplate( [ "seccion_"+getFieldClass(xmlNode), xmlNode.nodeName  ], 'sel'+subfix_template );
	}
		
	if (nodetemplate==undefined) {
		//error("xmlNode.nodeName + 'sel'+subfix_template: " + xmlNode.nodeName + 'sel'+subfix_template);
		throw new Error("tree_template[...] not found for [" + xmlNode.nodeName + 'sel'+subfix_template+"]");
		return "";
	}
    var title = assignFirstFoundedTemplate( [ xmlNode.nodeName, getFieldClass(xmlNode), getFieldType(xmlNode) ], 'sel'+subfix_template );
	
	if (subfix_template=="_print_html5") {
		title = assignFirstFoundedTemplate( [ getFieldClass(xmlNode), getFieldType(xmlNode), xmlNode.nodeName ], 'sel'+subfix_template );
	}
	
	if (xmlNode.nodeName=="seccion") title = nodetemplate;
	var branchs_open = tree_template[ xmlNode.nodeName + 'opensel'+subfix_template];
	var branchs_close = tree_template[ xmlNode.nodeName + 'close'+subfix_template];

	if (branchs_open==undefined || branchs_close==undefined || title==undefined) {
		//error("xmlNode.nodeName + 'sel'+subfix_template: " + xmlNode.nodeName + 'sel'+subfix_template);
		throw new Error("tree_template[...] not found or missing for [" + xmlNode.nodeName + 'opensel'+subfix_template+"]");
		return "";
	}
	
	
		
	
	title = title.replace( new RegExp("\\{LEVEL\\}","gi"), iteration );	
	var valor = GetFieldValues( xmlNode ) || '';
	
	var ayudarapida = '';
	if (_ayudas[it_herence]) ayudarapida = _ayudas[it_herence]['resumen'];
	var ayudacompleta = '';
	//_ayudas[it_herence]['completo']
	var marker = xmlNode.getAttribute("marker");
	
	//if (valor=="") valor=ayudacompleta;
	//if (valor=="") valor=ayudarapida;
	var clinkopen = ' onclick="javascript:openclose(\'categoria_{ID}_cuerpo'+subfix_template+'\',\'' + it_herence + '\');" ';
	var slinkopen = ' href="#" onclick="javascript:openclose(\'seccion_{ID}_cuerpo'+subfix_template+'\',\'' + it_herence + '\');" ';	
    var clinkopenform = ' href="#" onclick="javascript:loadFields(\'' + it_herence + '\');openclose(\'categoria_{ID}_cuerpo'+subfix_template+'\',\'' + it_herence + '\');" ';
	var slinkopenform = ' href="#" onclick="javascript:loadFields(\'' + it_herence + '\');openclose(\'seccion_{ID}_cuerpo'+subfix_template+'\',\'' + it_herence + '\');" ';
	var linkform = ' href="#" onclick="javascript:loadFields(\'' + it_herence + '\');" ';	
	
	var slinkopenformprogress = ' href="#" onclick="javascript:showMarkedSection(\'' + it_herence + '\');" ';
	
	title = title.replace( new RegExp("\\{CLINKOPEN\\}","gi"), clinkopen );
	title = title.replace( new RegExp("\\{CLINKOPENFORM\\}","gi"), clinkopenform );
	title = title.replace( new RegExp("\\{SLINKOPEN\\}","gi"), slinkopen );
	title = title.replace( new RegExp("\\{SLINKOPENFORM\\}","gi"), slinkopenform );	
	title = title.replace( new RegExp("\\{SLINKOPENFORMPROGRESS\\}","gi"), slinkopenformprogress );	
	title = title.replace( new RegExp("\\{LINKFORM\\}","gi"), linkform );
	
	
    title = title.replace( new RegExp("\\{LINK\\}","gi"), link );
    title = title.replace( new RegExp("\\{NOMBRE\\}","gi"), nombre );
	title = title.replace( new RegExp("\\{VALOR\\}","gi"), valor );
	title = title.replace( new RegExp("\\{AYUDARAPIDA\\}","gi"), ayudarapida );
	title = title.replace( new RegExp("\\{AYUDACOMPLETA\\}","gi"), ayudacompleta );
	title = title.replace( new RegExp("\\{PATHSEL\\}","gi"), pathsel );
    title = title.replace( new RegExp("\\{ID\\}","gi"), id_identifier );	
	title = title.replace( new RegExp("\\{CHECKED\\}","gi"), ischecked );    
    if (marker) title = title.replace( new RegExp("\\{MARKER\\}","gi"), "calc-marker-"+marker );
	title = title.replace( new RegExp("\\{NSUBS\\}","gi"), nsubs );
	title = title.replace( new RegExp("\\{FIELD_CLASS\\}","gi"), field_class );
	
    branchs_open = branchs_open.replace( new RegExp("\\{NOMBRE\\}","gi"), nombre );
    branchs_open = branchs_open.replace( new RegExp("\\{ID\\}","gi"), id_identifier );
    branchs_open = branchs_open.replace( new RegExp("\\{LEVEL\\}","gi"), iteration );
	branchs_open = branchs_open.replace( new RegExp("\\{NSUBS\\}","gi"), nsubs );
    
    
    branchs_close = branchs_close.replace( new RegExp("\\{NOMBRE\\}","gi"), nombre );
    branchs_close = branchs_close.replace( new RegExp("\\{ID\\}","gi"), id_identifier );
    branchs_close = branchs_close.replace( new RegExp("\\{LEVEL\\}","gi"), iteration );


	//addTreeBranch( xmlNode, it_herence, id_identifier );

	/**
	*
	* ITERATE FOR PRINTING
	*		in TABLES:
	*
	*/
	var branch_leaves  = "";
	
	if (
		subfix_template!=""
		&& 
		subfix_template!="progressbar" 		
		&&
		getFieldType(xmlNode)
		) {
		
		if ( getFieldType(xmlNode).indexOf("multiple")>=0 ) {
			log("LoadTreeIterativeS() > going in multiple records traversal");
			branch_leaves = LoadLeafIterativeS( xmlNode, subfix_template );
		}
		
		if ( getFieldType(xmlNode).indexOf("grafico")>=0 ) {
			
			var dbField = _dbFields[ pathsel ];
			var field_id = dbField['field_id'];
			
			branch_leaves = tree_template[ 'grafico' + 'sel' + subfix_template ];
			//branch_leaves = branch_leaves.replace( /\{SOURCE\}/gi, "grafico_canvg_{IDCAMPO}.png" );
			branch_leaves = branch_leaves.replace( /\{IDCAMPO\}/gi, field_id );
			
			
			log( "loadTreeSIterative() > printimages.length: " + printimages.length 
			+ " id:" + id_identifier 
			+ " path:" + pathsel
			+" field_id:"+field_id  );
			var dataimg;
			var fname = "";
			
			if (pathsel==dbOrganigramaPath) {
				loadFields( pathsel );
			    drawD3Organigram( field_id );
				rendersvg( document.getElementById("svgorgchart"), "grafico_canvg_"+field_id );
				dataimg = getcanvasimage("grafico_canvg_" + field_id);
				fname = "grafico_canvg_" + field_id + ".png";
			}
			if (pathsel==dbCronogramPath) {
				loadFields( pathsel );
				drawD3Cronogram( field_id );
			    rendersvg( document.getElementById("svgcronochart"), "grafico_canvg_"+field_id );
				dataimg = getcanvasimage("grafico_canvg_" + field_id);
				fname = "grafico_canvg_" + field_id + ".png";
			}
			
			if (pathsel==dbPresuEcoIngreso) {
				log("loadTreeSIterative() > pathsel is dbPresuEcoIngreso");
				loadFields( pathsel );
				drawPresuEcoIngresos( field_id );
				var html_full = PlaneaDocument.createHtmlPrintableElement( document.getElementById( "grafico_" + presu_eco_ingreso ).innerHTML, "chrome://planea/skin/presueco.css" );
				renderhtml( html_full, "grafico_canvg_"+presu_eco_ingreso );
				dataimg = gethtmlimage("grafico_canvg_" + field_id);
				fname = "grafico_canvg_" + field_id + ".jpg";
			}

			if (pathsel==dbPresuEcoCosto) {
				log("loadTreeSIterative() > pathsel is dbPresuEcoCosto");
				loadFields( pathsel );
				drawPresuEcoCostos( field_id );
				var html_full = PlaneaDocument.createHtmlPrintableElement( document.getElementById( "grafico_" + presu_eco_costos ).innerHTML, "chrome://planea/skin/presueco.css" );
				renderhtml( html_full, "grafico_canvg_"+presu_eco_costos );
				dataimg = gethtmlimage("grafico_canvg_" + field_id);
				fname = "grafico_canvg_" + field_id + ".jpg";
			}
			
			if (dataimg) {
			
				if (dataimg["src"]) {
					//dataimg["src"] = fs.getProfileDirectory() + '/' + pimg['filename'];
					//"file:///"+dataimg["src"].replace(/\\/gi, "/" );
				}
				
			
				var pimg = { 
							/*'filepath': normalizePath( home_path + "/" + "grafico_canvg_" + field_id + ".png" ),*/
							'filename': fname,
							'src': dataimg["src"],
							'abssrc': dataimg["abssrc"],
							'dataurl': dataimg["dataurl"],
							'base64': dataimg["base64"],
							'width': dataimg["width"],
							'height': dataimg["height"],
							'dimensions': dataimg["dimensions"]
							};
				printimages.push( pimg );
				log('loadTreeSIterative() > ' + JSON.stringify(pimg));
				branch_leaves = branch_leaves.replace( /\{FILENAME\}/gi, pimg['filename'] );
				
				if (pimg['dataurl']) branch_leaves = branch_leaves.replace( /\{SOURCE\}/gi, pimg['dataurl'] );
				else {
					if (subfix_template=='_print_html5')
						branch_leaves = branch_leaves.replace( /\{SOURCE\}/gi, pimg['abssrc'] );
					else
						branch_leaves = branch_leaves.replace( /\{SOURCE\}/gi, pimg['src'] );
						
				}
				
				branch_leaves = branch_leaves.replace( /\{DIMENSIONS\}/gi, pimg['dimensions'] );
				
				
				if (pimg['src']==undefined && pimg['dataurl']==undefined ) {
					branch_leaves = '';
				}
			} else {
				error("loadTreeSIterative() > dataimg: undefined > for pathsel:"+pathsel);
				error("loadTreeSIterative() > dbPresuEcoIngreso:"+dbPresuEcoIngreso);
				error("loadTreeSIterative() > dbPresuEcoCosto:"+dbPresuEcoCosto);
			}
		}
		
	}

	__dbstring+= title;
    __dbstring+= branchs_open;
	
    // ITERATE : note that we could change dynamically the enditeration
    //log( "Procesando hijos de:  " + it_herence );
    //alert( "Procesando hijos de:  " + it_herence + " nodeName:" + xmlNode.nodeName + " nodeValue:" + xmlNode.nodeValue );
	
	__dbstring+= branch_leaves;
	
    if (xmlNode.nodeName != "campo") {
		for( var i=0; i<xmlNode.childNodes.length; i++) {
			var childNode = xmlNode.childNodes[i];
			__dbstring+= loadTreeSIterative( childNode, iteration, it_herence, enditeration, index_formulario, subfix_template );
			//if (_dbForms[it_herence]) log("_dbForms["+it_herence + "]:" + _dbForms[it_herence]['campos']);
		}
	}
	  
    __dbstring+= branchs_close;
    return __dbstring;
}


function LoadLeafS( xmlNode, subfix_template ) {
	var title = assignFirstFoundedTemplate( [ xmlNode.nodeName, getFieldClass(xmlNode), getFieldType(xmlNode) ], 'sel'+subfix_template );
	
	var nombre = getFieldName(xmlNode);
	var valor = GetValues(xmlNode);
	
	//title = title.replace( new RegExp("\\{LINK\\}","gi"), link );
    title = title.replace( new RegExp("\\{NOMBRE\\}","gi"), nombre );
	title = title.replace( new RegExp("\\{VALOR\\}","gi"), valor );
	title = title.replace( new RegExp("\\{CLASS\\}","gi"), getFieldClass(xmlNode) );
	title = title.replace( new RegExp("\\{FIELD_CLASS\\}","gi"), getFieldClass(xmlNode) );
	title = title.replace( new RegExp("\\{CLASE\\}","gi"), getFieldType(xmlNode) );
	//title = title.replace( new RegExp("\\{AYUDARAPIDA\\}","gi"), ayudarapida );
	//title = title.replace( new RegExp("\\{AYUDACOMPLETA\\}","gi"), ayudacompleta );
	//title = title.replace( new RegExp("\\{PATHSEL\\}","gi"), pathsel );
   // title = title.replace( new RegExp("\\{ID\\}","gi"), id_identifier );	
	//title = title.replace( new RegExp("\\{CHECKED\\}","gi"), ischecked );    
    //if (marker) title = title.replace( new RegExp("\\{MARKER\\}","gi"), "calc-marker-"+marker );
	//title = title.replace( new RegExp("\\{NSUBS\\}","gi"), nsubs );
}

/**
*     Iterate objects as tables nested with fields and other tables....
*
*/
function LoadLeafIterativeS( xmlNode, subfix_template ) {


	var table_type = getFieldType( xmlNode );
	
	if ( !(table_type.indexOf("multiple")>=0) && subfix_template ) {
		
		return LoadLeafS(xmlNode, subfix_template);
		
		return "THIS IS NOT A LEAF TABLE";
	} 
	
	
	var table_class = getFieldClass( xmlNode );
	var table_name = getFieldName( xmlNode );
	
	log("LoadLeafIterativeS() > table_type ["+table_type+"] table_class ["+table_class+"]");
	
	var table_template = assignFirstFoundedTemplate( [ table_class, table_type, "multiple" ] , 'sel'+subfix_template );
	
	log("LoadLeafIterativeS() > table_template ["+table_template+"]");
	/*
	var table_templateopen =  assignFirstFoundedTemplate( [ table_class, table_type, xmlNode.nodeName ] , 'opensel'+subfix_template );					
	var table_templateclose = assignFirstFoundedTemplate( [ table_class, table_type, xmlNode.nodeName ] , 'close'+subfix_template );	
	*/
	
	var ev = evaluateXPath( xmlNode, "valor/registro" );
	var table_records = "";
	var table_foots = "";
	var table_heads = "";
	var table_has_sums = false;
	var table_sums = {};
	
	for(var i in ev) {
		
		var recordNode = ev[i];
		var record_id = GetAttribute( recordNode, "id" );
		
		log("LoadLeafIterativeS() > record_id ["+record_id+"]");
		
		var rec_template = assignFirstFoundedTemplate( [ 'registro_'+table_class, recordNode.nodeName] , 'sel'+subfix_template );
		var rec_head_template = assignFirstFoundedTemplate( [  'registro_'+table_class , recordNode.nodeName] , 'selhead'+subfix_template );
		var rec_foot_template = assignFirstFoundedTemplate( [ 'registro_'+table_class, recordNode.nodeName] , 'selfoot'+subfix_template );
		
		log("LoadLeafIterativeS() > rec_template ["+rec_template+"] rec_head_template["+rec_head_template+"] rec_foot_template["+rec_foot_template+"]");
		/*
		var rec_templateopen = assignFirstFoundedTemplate( [ recordNode.nodeName] , 'opensel'+subfix_template );
		var rec_templateclose = assignFirstFoundedTemplate( [ recordNode.nodeName] , 'close'+subfix_template );
		*/
		var fieldNodes = evaluateXPath( recordNode, "campo" );
		
		var record_heads = "";
		var record_foots = "";
		var record_values = "";
		var recordJSON = getRecordToJSON( recordNode );
		
		
		for( var j in fieldNodes ) {
		
			var fieldNode = fieldNodes[ j ];
			var field_name = getFieldName( fieldNode );
			var field_type = getFieldType( fieldNode );
			var field_class = getFieldClass( fieldNode );
			var field_sum = getFieldSum( fieldNode );
			var field_is_sum = false;
			
			if (	
				field_sum 
				&& field_sum.toLowerCase().indexOf("yes") >= 0 
				&& !isNaN(field_value) 
				) {
			
					table_has_sums = true;
					field_is_sum = true;
					if ( table_sums[field_class]==undefined ) table_sums[field_class] = 0;
				}
			//processSums( recordnode , { object_path: '' , target_field_class: '' }  )
			
			log("LoadLeafIterativeS() > field_name ["+field_name+"] field_type["+field_type+"] field_class["+field_class+"]");
			

			
			var rec_field_template = assignFirstFoundedTemplate( [ field_class, field_type, fieldNode.nodeName ] , 'selcell'+subfix_template );
			var rec_field_head_template = assignFirstFoundedTemplate( [ field_class, field_type, fieldNode.nodeName ] , 'selcellhead'+subfix_template );
			var rec_field_foot_template = assignFirstFoundedTemplate( [ field_class, field_type, fieldNode.nodeName ] , 'selcellfoot'+subfix_template );
			/*
			var rec_field_templateopen = assignFirstFoundedTemplate( [ field_class, field_type, fieldNode.nodeName ] , 'opensel'+subfix_template );
			var rec_field_templateclose = assignFirstFoundedTemplate( [ field_class, field_type, fieldNode.nodeName ] , 'close'+subfix_template );
			*/
			//ok so for each record we use a templates to
			// 1) *** table_header ( column names or such)
			// 2) *** table_record_header
			// 3) ***	table_record_field ! (texto,parrafo,numero,natural,porcentaje, etc, etc, etc...)
			// 4) *** table_record_footer
			// 5) *** table_footer > sums + ....
			var field_value = "-";
			var field_total = "-";
			
			if (field_type.indexOf("multiple")>=0) {
				
				log("LoadLeafIterativeS() > calling recursivelly LoadLeafIterativeS () > field_type["+field_type+"]");
				field_value = "-" + LoadLeafIterativeS( fieldNode, subfix_template );
				//field_value  = "-";
			} else if (field_type.indexOf("referencia")>=0) {
				field_value  = GetValues( fieldNode );
				field_value = recordJSON[ field_class ]["preview"];
				//recordJSON[ field_class ]['node'] => getRecordToJSON( ) =>  to populate any field... use templates!!!
			} else {
			
				field_value  = GetValues( fieldNode );
				if (field_value=='') {
					field_value = "-+-";
					if (field_type=="imagen") {
						rec_field_template = '';
					}
				}
				
				if ( field_is_sum && !isNaN(table_sums[field_class]) && !isNaN(parseFloat( field_value ) ) ) {
					table_sums[field_class]+= parseFloat( field_value );
					field_total = table_sums[field_class];
				}
			}
			
			if (field_value==undefined) field_value = "";
			
			log("LoadLeafIterativeS() > field_value ["+field_value+"]");
			
			rec_field_template = rec_field_template.replace( new RegExp("\\{VALOR\\}","gi"), field_value );
			rec_field_template = rec_field_template.replace( new RegExp("\\{FIELD_CLASS\\}","gi"), field_class );
			rec_field_template = rec_field_template.replace( new RegExp("\\{FIELD_TYPE\\}","gi"), field_type );
			record_values+= rec_field_template;
			log("LoadLeafIterativeS() > rec_field_template ["+rec_field_template+"]");
			
			rec_field_head_template = rec_field_head_template.replace( new RegExp("\\{FIELD_CLASS\\}","gi"), field_class );
			rec_field_head_template = rec_field_head_template.replace( new RegExp("\\{NOMBRE\\}","gi"), field_name ); 
			record_heads+= rec_field_head_template;
			log("LoadLeafIterativeS() > rec_field_template ["+rec_field_head_template+"]");
			
			rec_field_foot_template = rec_field_foot_template.replace( new RegExp("\\{FIELD_CLASS\\}","gi"), field_class );
			rec_field_foot_template = rec_field_foot_template.replace( new RegExp("\\{TOTAL\\}","gi"), field_total ); 
			record_foots+= rec_field_foot_template;
			log("LoadLeafIterativeS() > rec_field_foot_template ["+rec_field_foot_template+"]");
			
		}
		rec_template = rec_template.replace( new RegExp("\\{RECORD_CLASS\\}","gi"), record_id );
		rec_template = rec_template.replace( new RegExp("\\{RECORD_VALUES\\}","gi"), record_values );
		log("LoadLeafIterativeS() > rec_template ["+rec_template+"]");
		
		rec_head_template = rec_head_template.replace( new RegExp("\\{RECORD_CLASS\\}","gi"), record_id );
		rec_head_template = rec_head_template.replace( new RegExp("\\{RECORD_HEADS\\}","gi"), record_heads );
		log("LoadLeafIterativeS() > rec_head_template ["+rec_head_template+"]");
		
		rec_foot_template = rec_foot_template.replace( new RegExp("\\{RECORD_CLASS\\}","gi"), record_id );
		rec_foot_template = rec_foot_template.replace( new RegExp("\\{RECORD_FOOTS\\}","gi"), record_foots );
		log("LoadLeafIterativeS() > rec_foot_template ["+rec_foot_template+"]");
		table_records+= rec_template;
		
		if (table_has_sums) 
			table_foots = rec_foot_template;
			
		table_heads = rec_head_template;
	}
	table_template = table_template.replace( new RegExp("\\{TABLE_CLASS\\}","gi"), table_class );
	table_template = table_template.replace( new RegExp("\\{TABLE_NAME\\}","gi"), table_name );
	table_template = table_template.replace( new RegExp("\\{TABLE_HEADS\\}","gi"), table_heads );
	table_template = table_template.replace( new RegExp("\\{TABLE_FOOTS\\}","gi"), table_foots );
	table_template = table_template.replace( new RegExp("\\{TABLE_RECORDS\\}","gi"), table_records );
	log("LoadLeafIterativeS() > table_template processed ["+table_template+"]");
	
	return table_template;

}

/**
*   loadTreeS
*   Load tree structure, create the html interface, passing selected values as a list of line ending separated values (id value for each
*   ex of selected values: 
*   arbol:Presentación:Portada={true}
*	arbol:Presentación:Portada:Título={true}
*	arbol:Presentación:Portada:Marca={true}
*	arbol:Presentación:Portada:Resumen Ejecutivo={true}
* 	......
*	......
*
*	passed to a js structure array:
*   _dbTreeSelection[ key_to_field = it_herence = "arbol:"] => {
			'selected': selected (true or false),
			'title': title (arbol:Presentación:Portada), 
			'jsvalue':jsvalue ({true} or {false})
		} 
*/


function parseTreeSelectionValues( selected_values ) {

	_dbTreeSelection = [];

	var sel_valsx = selected_values.split("\n");
	
	//log( "parseTreeSelectionValues() > " + selected_values );
	
	for( var ksel in sel_valsx ) {
		
		var selected_field_data = sel_valsx[ksel];
		
		if (selected_field_data!="") {
			
			var datax = selected_field_data.split("=");
			
			if (datax.length>1) {
				var key = datax[0];
				var jsvalue = datax[1];
				var selected = ( jsvalue.indexOf( "true" ) > -1 );
				var title = key; //we take all full key, but only the string after the last ":" is really the class, not the title, the title is the first
				_dbTreeSelection[ key ] = { 'selected': selected,'title': title, 'jsvalue':jsvalue };
				//log( "parseTreeSelectionValues() > " + title );
			} else {
				error("parseTreeSelectionValues() > incomplete field selection ["+selected_field_data+"]");
			}					
		}
	}
	
	return _dbTreeSelection;			
}

function loadTreeS( docElement, selected_values ) {

	_dbTreeSelection = parseTreeSelectionValues(selected_values);

    var doc_HtmlInterface = loadTreeSIterative( docElement, 0, "", 10, 0, "" );
	        
    fs.writeFile( normalizePath( fs.getHomeDir()+'/dbtree_S.html'), doc_HtmlInterface );

	return doc_HtmlInterface;
}


function checkHtml( html_xml ) {
	var checkParser = new DOMParser();
	var result;
	try {    
		result = checkParser.parseFromString( html_xml, "text/xml");
	} catch(e) {
		error("checkHtml() > error parsing XML !: "+ html_xml);
		return false;
	}
	return ( result.nodeName != undefined );
}

function loadTreeProgress( docElement ) {

    var doc_HtmlProgressBar = loadTreeSIterative( docElement, 0, "", 10, 0, "progressbar" );
	        
	var div_progress = document.getElementById("project_progress");
	if (div_progress) {
	
		fs.writeFile( normalizePath( fs.getHomeDir()+'/dbtree_progress.html'), doc_HtmlProgressBar );
		
		if (checkHtml(doc_HtmlProgressBar))
			div_progress.innerHTML+= add_html_namespace( doc_HtmlProgressBar );
	}
			

	return doc_HtmlProgressBar;
}


function printImage(  pimg, path ) {
	
	return;
	
	log("printImage() > filepath: "+ pimg['filepath']+" path:" + path +" / filename: " + pimg['filename'] +" base64:" +  pimg['base64']);
	fs.copyFile( pimg['filepath'], path);
	
}

var doc_Html4;

function printTreeS( docElement, selected_values, print_format, print_output ) {


	_dbTreeSelection = parseTreeSelectionValues(selected_values);

    var doc_HtmlPrintedVersion = loadTreeSIterative( docElement, 0, "", 10, 0, "_print_"+print_format );
	var print_leafname, print_folder;
	var style_site = "chrome://planea/skin/site.css";
	//var style_site_pdf = "chrome://planea/skin/site_pdf.css";
	//var content_style_pdf = fs.openUri(style_site_pdf);
	
	var content_style = fs.openUri(style_site);
	
	//content_style+= fs.openUri( style_site );
	doc_Html4 = doc_HtmlPrintedVersion;
	doc_Html4 = doc_Html4.replace("{STYLE}", "");
	
	doc_HtmlPrintedVersion = doc_HtmlPrintedVersion.replace("{STYLE}",content_style);
	
    fs.writeFile( normalizePath( fs.getHomeDir()+'/doc_HtmlPrintedVersion.html'), doc_HtmlPrintedVersion );
	
	return doc_HtmlPrintedVersion;
}
