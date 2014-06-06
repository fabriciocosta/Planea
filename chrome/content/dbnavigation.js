

var PageScale = 1.0;
var PageTranslate=0;
var dbPages = [];
var horientations = {};

var pageWidthVertical = 700;
var pageHeightVertical = 990;

var pageWidthHorizontal = 1200;
var pageHeightHorizontal = 700;


horientations["arbol:Presentaci贸n:Titularidad:Organizaci贸n"] = true;
horientations["arbol:Presentaci贸n:Titularidad:Persona F铆sica"] = true;
horientations["arbol:Presentaci贸n:Titularidad:Responsable"] = true;

horientations["arbol:Planificaci贸n:Participantes:Integrantes"] = true;
horientations["arbol:Planificaci贸n:Participantes:Organigrama"] = true;
horientations["arbol:Planificaci贸n:Participantes:Beneficiarios Directos"] = true;
horientations["arbol:Planificaci贸n:Participantes:Beneficiarios Indirectos"] = true;

horientations["arbol:Planificaci贸n:Actividades"] = true;
horientations["arbol:Planificaci贸n:Cronograma"] = true;

horientations["arbol:Planificaci贸n:Participantes:Integrantes"] = true;

horientations["arbol:Recursos:Ingresos"] = true;
horientations["arbol:Recursos:Costos"] = true;
horientations["arbol:Recursos:Presupuesto Econ贸mico"] = true;

horientations["arbol:Sustentabilidad:Contraprestaciones"] = true;
horientations["arbol:Sustentabilidad:Evaluaci贸n:Indicadores"] = true;

horientations[""] = true;


function initializeMenu() {

	var menu_interface = tree_template['arbolopen'] + tree_template['arbolclose'];
	document.getElementById("dbtree").innerHTML = add_html_namespace(menu_interface);
}

function zoomPage( select_obj, event ) {
	
	var value = select_obj.options[select_obj.selectedIndex].value;
	
	var scale = parseFloat(value);
	scale = scale * 0.01;
	PageScale = scale;
	
	log ("zoomPage() > value ["+value+" %] to scale ["+scale+"] ");
	
	
	
	var dbforms = getLayoutNode();
	var rect = dbforms.getBoundingClientRect();
	
	
	PageTranslate = parseFloat( parseInt(rect.height)*(scale*0.5-0.5) );
	PageTranslate = parseInt(PageTranslate);
	log ("zoomPage() > dbforms: PageTranslate > rect.height:" + rect.height+ " PageTranslate Y:" + PageTranslate +"px");
	
	dbforms.setAttribute("style","transform: scale("+scale+") translate( 0px, "+PageTranslate+"px);");
	
}


/**
*	SetLocationPath( nombreseccion )
*	Complete location path in our HTML project header (navigator) #location_path
*/
function SetLocationPath(nombreseccion) {

			var htmlLocationPath = document.getElementById("location_path");

			var dbseccion = _dbForms[nombreseccion];
			var location_path = '';
			var location_path_sep = '';

            if (dbseccion==undefined) {
                error("SetLocationPath() Error: in SetLocationPath _dbForms['"+nombreseccion+"'] not defined");
                return;
            }

//SETEAR EL LOCATION PATH
			if (dbseccion['padre_seccion']!='') {
				location_path = '<li class="parent-section" onclick="javascript:loadFields(arbol:'+dbseccion['padre_seccion']+')">'+dbseccion['padre_seccion']+'</li>';
				location_path_sep = ' / ';
			}
			if (dbseccion['padre_subseccion']!='') {
				location_path = location_path+location_path_sep+'<li class="parent-section"  onclick="javascript:loadFields(arbol:'+dbseccion['padre_seccion']+':'+dbseccion['padre_subseccion']+')">'+dbseccion['padre_subseccion']+'</li>';
				location_path_sep = ' / ';
			}
			if (dbseccion['padre_subsubseccion']!='') {
				location_path = location_path+location_path_sep+'<li class="parent-section">'+dbseccion['padre_subsubseccion']+'</li>';
				location_path_sep = ' / ';
			}

            if (location_path=='') location_path = nombreseccion;
			
			if (htmlLocationPath) htmlLocationPath.innerHTML = add_html_namespace( location_path );
}

/**
*	HideForms()
*
*	Hide all forms (childrens of #dbformularios) in html document
*
*/
function HideForms() {

	var el = document.getElementById('dbformularios');
	for(var i=0; i<el.childNodes.length;i++) {
		var f = el.childNodes[i];
		if (f) f.style.display = 'none';
	}

}

/**
*	HideForms2()
*
*	Hide all form within a section
*
*/
function HideForms2() {
	var el = document.getElementById('dbformularios');
	for(var i=0; i<el.childNodes.length;i++) {
		var f = el.childNodes[i];
		if (f) f.style.display = 'none';
	}
}


/**
*	LoadActualForm()
*	Load actual indexed form by global variable: _formulario_actual 
*	Actual form is at: _formularios[ _formulario_actual ] 
*/
function LoadActualForm() {
	nombreseccion = _formularios[_formulario_actual];
	if (nombreseccion!=undefined && nombreseccion!="") {
		loadFields(nombreseccion);
	} else {
		log("LoadActualForm() : ["+nombreseccion+'] invalido');
	}
}

/**
*	NextForm()
*	Increment global variable: _formulario_actual and load the form  
*/
function NextForm() {
	_formulario_actual = _formulario_actual + 1;
	if (_formulario_actual > ( _formularios.length-1) ) _formulario_actual = ( _formularios.length-1);
	
	nombreseccion = _formularios[_formulario_actual];
	if (nombreseccion!=undefined && nombreseccion!="") {
		log("NextForm()" + _formulario_actual + " calling LoadActualForm()" );
		LoadActualForm();
	} else {
		error("nombreseccion _formularios["+_formulario_actual+"] is undefined");
		NextForm();
	}
}

/**
*	PreviousForm()
*	Decrement global variable: _formulario_actual and load the form  
*/
function PreviousForm() {
	
    log("PreviousForm() : " + _formulario_actual + " to decrement " );

	_formulario_actual = Math.max( 0, parseInt(_formulario_actual) - 1 );

	log("_formularios:" + JSON.stringify(_formularios,null,"\t") );
	return;
	nombreseccion = _formularios[_formulario_actual];

	if (nombreseccion!=undefined && nombreseccion!="") {
		log("PreviousForm() : " + _formulario_actual + " calling LoadActualForm()" );
		LoadActualForm();
	} else {
		error("PreviousForm() : nombreseccion _formularios["+_formulario_actual+"] is undefined");
		PreviousForm();
	}

}

function setSectionVisible( section_path ) {

	var dbSeccion = _dbForms[section_path];

	if (dbSeccion) {
		dbSeccion["visible"] = true;
	} else {
		log("setSectionVisible() > section_path ["+section_path+"] not has child sections. Do not showing them,");
	}

}

function showScrollIt(elID) {
	var el = document.getElementById(elID);
	el.scrollIntoView( true );
}

function showSection( sectionid ) {
	var el = document.getElementById( sectionid );
	if (el==undefined) return error("showSection() > doc element with id not found! ["+sectionid+"]");
	//el.style.height = "0px";
	el.style.opacity = "0.0";
	showdiv(sectionid);
	showScrollIt( sectionid  );
	//var rect = el.getBoundingClientRect();
	//el.style.height = parseInt(rect.height - 80) + "px";
	el.style.opacity = "1.0";
	
	setTimeout( function() {  el.style.height = "auto"; }, 1000 );	
}

function showMarkedSection( path_to_section ) {
	log("showMarkedSection() > path_to_section["+path_to_section+"]");
	//var dbLeaf = _dbTreeBranches[ ]
	loadFields( path_to_section );
	
	var branch = _dbTreeBranches[ path_to_section ];
	if (branch) {
	
		var field_form_id = "field_";
		var branch_id = branch["id"];
		
		//log("showMarkedSection() > branch_id ["+branch_id+"] "+JSON.stringify( branch, null, "\t") );
		
		for( var leaf in branch["leaves"]) {
		
			var dbLeaf = branch["leaves"][leaf];
			
			log("showMarkedSection() > browsing leaves [" + JSON.stringify(dbLeaf,null, "\t") + "]");
			var dbLeafId = dbLeaf["id"];
			var d = document.getElementById( "field_"+ dbLeafId );
			if (d) {
				
				return showSection( "field_"+ dbLeafId );
			} else {
				error("showMarkedSection() > " +"field_"+ dbLeafId+" not found" );
			}
		}
		
		for( var br in branch["branches"]) {
			showMarkedSection( br );
		}
		
		
	}
		
	/*
	var dbForm = _dbForms[ path_to_section ]; //SOLO SON AQUELLOS Q TIENE CAMPOS EN SU RAIZ!!!!! una rama con solo ramas, no tiene formularios,
	//simplemente hay formularios asociados a la seccion (que no tiene representacion HTML...)
	var formularioN = dbForm["formularioN"];
	var idf = "dbformulario_"+dbForm["formularioN"]+"_";
	*/
	

}

function hideSection( sectionid ) {
	var el = document.getElementById(sectionid);
	var rect = el.getBoundingClientRect();
	//el.style.height = "0px";
	el.style.opacity = "0.0";
	setTimeout( function() {  hidediv(sectionid); }, 1000 );
}


function loadAllFields() {
	var focused_onfirst = false;
	for(var field_path in _dbFields) {
		var dbField = _dbFields[field_path];
		if (dbField) {
			if (!focused_onfirst) loadFields(field_path);
			focused_onfirst = true;
			showFieldSection( field_path );
		}
	}

}

function showSectionFields( nombreseccion ) {

	var dbseccion = _dbForms[ nombreseccion ];
	log( "showSectionFields() > nombreseccion:"+nombreseccion+" check for objects");
	for( var field_path in dbseccion["fields"] ) {
	
		var dbField = _dbFields[field_path];
		if (dbField.field_type.indexOf("multiple")>=0) {
			//if empty!!
			//log( "showSectionFields() > objectClassRef:" + dbField.objectClassRef + " field_path:"+  field_path  );
			if (fieldIsEmpty(field_path))
				AddRecord( dbField.objectClassRef, field_path );
		}
	}
	/*
	var sectionNode = dbseccion["node"];
	if (sectionNode) {
		var section_fields = evaluateXPath( sectionNode, "campo" );
		for ( var rc in section_fields ) {
			var field_node = section_fields[rc];
			var field_type = getFieldType(field_node);
			if ( field_type.indexOf("multiple")>=0) {
				//si esta vacio > 
				var field_class = getFieldClass(field_node);
				dbObject = _dbobjects[field_class];
				//path of this object
				
			}
			
		}
	}
	*/
}






function getPage( page_id ) {
	return dbPages[page_id];
}

function getPageNode( page_id ) {
	return getPage( page_id ).node;
}

function getPageNumber( page_id ) {
	return getPage( page_id ).number;
}

function getPageNumbers() {
	var layoutNode = getLayoutNode();
	var pages = layoutNode.childNodes;
	var page_numbers = 0;
	//evaluateXPath( layoutNode, "html:div[@class='page']");
	for(var i=0; i<layoutNode.childNodes; i++) {
		var pageNode = pages.childNodes[i];
		if (	pageNode.nodeName=="html:div"
			&& pageNode.getAttribute("pageid")!=undefined) {
			page_numbers++;
		}
	}
	return page_numbers;
}

function getLayoutNode() {

	var layout = document.getElementById("dbmultipage");
	return layout;
}

function calculatePageLayout( page_id ) {

	var PageNode = getPageNode( page_id );
	var rect = PageNode.getBoundingClientRect();
	
	//log( "calculatePageLayout() > rect_width: "+rect.width + " rect_height: " + rect.height,'navigation');
	return rect;
}

function fixPageLayout( page_id ) {
	
	var rectPage = calculatePageLayout( page_id );
	var pageObj = getPage( page_id );
	if (rectPage.height > pageObj["height"] ) {
		var pageNode = getPageNode( page_id );
		log( "fixPageLayout() >   rectPage.top: " + rectPage.top + " rectPage.height:" + rectPage.height,'navigation') ;
		//recorrer todos los hijos, al llegar al que se va de los 1000...
			//poner este y los que le siguen en una nueva P谩gina
			//hacer esto recursivamente_
		
		//var forms = evaluateXPath(  pageNode, "html:div[@sectionpath]" );
		var forms = pageNode.childNodes;
		
		var page_break = false;
		var new_page_id;
		var newPageNode;
		for( var i = 0; i<forms.length; i++ ) {
			var section;
			var formNode = forms[i];
			if (formNode.nodeName=="html:div")
				section = formNode.getAttribute("sectionpath");
			if (section) {
				var rect = formNode.getBoundingClientRect();
				//if (totalheight) > 1000 > move everithing to a new page!!
				var totalheight = (rect.top-rectPage.top) + rect.height;
				log( "fixPageLayout() >   totalheight: " + totalheight + " from formNode >  rect.top:" + rect.top +" rect.height:" + rect.height,'navigation');
				if (	 rect.height<  (pageObj["height"]-100) /*the form height maybe is too hight, let it go... danger in recursion*/
						&& totalheight > pageObj["height"] ) {
					page_break = true;
					var orientation = "vertical";
					if (horientations[section]) orientation="horizontal";
					new_page_id = insertNewPageAfter( page_id, orientation );
					newPageNode = getPageNode( new_page_id );
				}
				if (page_break && new_page_id>=0) {
					newPageNode.appendChild( formNode );
					
					if (section) {
						_dbForms[section]['page_id'] = new_page_id;
						_dbForms[section]['div_page_id'] = "div_"+new_page_id;
					}
				}
			}
		}
		//recursive fix!!
		if (new_page_id>=0) 
			fixPageLayout(new_page_id);
	}
	
	
	
}


function removePage( page_id ) {
	var pageNode = getPageNode(page_id);
	
	//mover todos los hijos a dbformularios
	getLayoutNode().removeChild(pageNode);
}

function changeOrientation( page_id, orientation ) {
	var page = getPage(page_id);
	var pageN = getPageNode(page_id);
	page['orientation'] = orientation;
	if (orientation=="horizontal") {
		page['height'] = pageHeightHorizontal;
		pageN.setAttribute("class","page page-horizontal");
	} else {
		page['height'] = pageHeightVertical;
		pageN.setAttribute("class","page page-vertical");
	}
}

function addNewPage( orientation ) {

	log("addNewPage()", 'navigation' );
	if (orientation==undefined)
		orientation = "vertical";
		
	var newPageId = dbPages.length;
	var newPageNumber = getPageNumbers() + 1;
	log("addNewPage() newPageId:"+newPageId+" newPageNumber:"+newPageNumber, 'navigation' );
	
	dbPages[newPageId] = createPage( newPageId, newPageNumber );
	
	var layout = getLayoutNode();
	var newpage = document.createElement('html:div');
	
	newpage.setAttribute("id", "page_"+newPageId );
	newpage.setAttribute("pageid", newPageId );
	newpage.setAttribute("number", newPageNumber );
	newpage.setAttribute("class", "page "+" page-"+orientation );
	
	if (orientation=="horizontal") {
		dbPages[newPageId]['height'] = pageHeightHorizontal;
		dbPages[newPageId]['orientation'] = orientation;
	}
		
	layout.appendChild( newpage );
	 
	dbPages[newPageId]['node'] = newpage;

	
	return newPageId;
}

function orderPages() {
	//set the correct page number to each one.. (not the id)
	
	var pages = getLayoutNode().childNodes;
	var number = 0;
	if (pages.length) {
		for( var p=0; p<pages.length;p++ ) {
			pageNode = pages[p];
			if (pageNode.nodeName=='html:div') {
				log ("orderPages > pageid ? > [" + pageNode.getAttribute("pageid") )+"]";
				if (pageNode.getAttribute("pageid")!=undefined) {
					pageNode.setAttribute("number", number);
					var pid = pageNode.getAttribute("pageid");
					if (pid>=0 && dbPages[ pid ] ) dbPages[ pid ].number = number;
					else error("orderPages() > pageid attribute not defined for  " + pageNode.outerHTML );
					number++;
				}
			}
			
		}
	}
	else
		error("orderPages() > no pages to order ???");
}

function getFirstPageNode() {
	var pageLayout = getLayoutNode();
	var pages = [];
	if (pageLayout) pages = pageLayout.childNodes;
	else error("getFirstPageNode() > pageLayout > "+pageLayout);
	//log("pages.length:"+pages.length,'navigation');
	if (pages.length) {
		for( var p=0; p<pages.length;p++ ) {
			pageNode = pages[p];
			if (pageNode.nodeName=='html:div') {
				if (pageNode.getAttribute("number")>=0) {
					return pageNode;
				}
			}
		}
	} else return null;
}

function insertNewPageAfter( after_page_id, orientation ) {
		
	log("insertNewPageAfter()", 'navigation' );
	var AfterPage = getPage(after_page_id);
	var AfterPageNode = getPageNode(after_page_id);
	
	var newPageId = dbPages.length;
	var newPageNumber = getPageNumber( after_page_id )+1;
	
	log("insertNewPageAfter() newPageId:"+newPageId+" newPageNumber:"+newPageNumber, 'navigation' );
	
	dbPages[newPageId] = createPage( newPageId, newPageNumber );
	
	var layout = getLayoutNode();
	var newpage = document.createElement('html:div');
	
	newpage.setAttribute("id", "page_"+newPageId );
	newpage.setAttribute("pageid", newPageId );
	newpage.setAttribute("number", newPageNumber );
	newpage.setAttribute("class", "page "+" page-"+orientation );
	
	if (AfterPageNode.nextSibling)
		layout.insertBefore( newpage, AfterPageNode.nextSibling );
	else
		layout.appendChild( newpage );
	 
	dbPages[newPageId]['node'] = newpage;
	orderPages();
	return newPageId;
}

function insertNewPageBefore( before_page_id, orientation ) {
	log("insertNewPageBefore()", 'navigation' );
	var BeforePage = getPage(before_page_id);
	var BeforePageNode = getPageNode(before_page_id);
	
	var newPageId = dbPages.length;
	var newPageNumber = getPageNumber( before_page_id ) + 1;
	log("insertPageAfter() newPageId:"+newPageId+" newPageNumber:"+newPageNumber, 'navigation' );
	
	dbPages[newPageId] = createPage( newPageId, newPageNumber );
	
	var layout = getLayoutNode();
	var newpage = document.createElement('html:div');
	
	newpage.setAttribute("id", "page_"+newPageId );
	newpage.setAttribute("pageid", newPageId );
	newpage.setAttribute("number", newPageNumber );
	newpage.setAttribute("class", "page "+" page-"+orientation );
	
	layout.insertBefore( newpage, BeforePageNode );
	 
	dbPages[newPageId]['node'] = newpage;
	orderPages();
	return newPageId;
}

function createPage( page_id, page_number ) {
	return {
		'page_id':page_id,
		'div_page_id':"page_"+page_id,
		'number': page_number,
		'orientation': 'vertical', // vertical|horizontal
		'node': null,
		'height': pageHeightVertical,
		'sections': {}
	};
}

function showPage( number ) {
	//show it
}

function getSectionPageId( page_section ) {
	var dbseccion = _dbForms[ page_section ];
	if (dbseccion) {
		var pages_sections = evaluateXPath( getLayoutNode(), "html:div/html:div[@id='"+dbseccion['idformulario']+"']");
		if (pages_sections.length)
			return dbseccion['page_id'];
	}
	return -1;
}

function getPreviousSection( page_section ) {


	var dbseccion = _dbForms[page_section];
	var dbN = dbseccion[ 'formularioN'];
	var minN = 0;
	var prev_section;
	log("getPreviousSection() > page_section "+page_section+" dbN:"+dbN);
	for(var section in _dbForms) {
	
		var dbForm = _dbForms[section];
		var dbFN = dbForm['formularioN'];
		var dbPageId = dbForm['page_id'];
		//log("getPreviousSection() > section "+section+" dbFN:"+dbFN+" dbPageId:"+dbPageId );
		if ( dbFN < dbN && dbPageId>=0 ) {
			if (dbFN<dbN && minN<dbFN) {
				minN = dbFN;
				prev_section = section;
			}
		}
	}
	return prev_section;
}

function getPostSection( page_section ) {
	var dbseccion = _dbForms[page_section];
	var dbN = dbseccion[ 'formularioN'];
	var minN = 1000;
	var post_section;
	log("getPostSection() > page_section "+page_section+" dbN:"+dbN);
	for(var section in _dbForms) {
	
		var dbForm = _dbForms[section];
		var dbFN = dbForm['formularioN'];
		var dbPageId = dbForm['page_id'];
		
		if ( dbFN > dbN && dbPageId>=0 ) {
			if (dbFN>dbN && minN>dbFN) {
				minN = dbFN;
				post_section = section;
			}
		}
	}
	return post_section;
}



/** SECTION ADDING OPERATIONS*/

/*
*	TRY TO PUT A SECTION INTO A PAGE
*		AND AUTOMATICALLY CREATE A NEW PAGE IF IT DOESNT FIT....
*		HAS TO RENUMBER THE PAGES
*		AND ALSO, REORDER THE SECTIONS?!?!?!
*		===if we create a new page >> 
*/
function addSectionToPage( page_section, page_id ) {

	var dbseccion = _dbForms[ page_section ];
	if (dbseccion==undefined) {
		log("showPageSection() error: no dbseccion for: "+page_section, 'navigation' );
		return false;
	}
	
	var dbseccionNode = dbseccion['node'];
	var sectionClass = GetAttribute( dbseccionNode, "clase");
	var dbFormNode = document.getElementById(dbseccion['idformulario']);
	
	
	//put the section into the page!!
	var pageObj = getPage( page_id );
	var pageNode = getPageNode( page_id );
	
	pageNode.appendChild( dbFormNode );
	
	dbseccion['page_id'] = page_id;
	dbseccion['div_page_id'] = "page_"+page_id;
	_dbForms[ page_section ] = dbseccion;
	log("addSectionToPage() dbseccion "+page_section, 'navigation' );
	
	fixPageLayout( page_id );
}

function addSectionToNewPage( page_section ) {
	var orientation = "vertical";
	if (horientations[page_section]) orientation="horizontal";
	
	var page_id = addNewPage( orientation );
	addSectionToPage( page_section, page_id);
	log("addSectionToNewPage() dbseccion "+page_section+" page_id:"+page_id, 'navigation' );
}

function addSectionToFirstPage(page_section) {
	var orientation = "vertical";
	if (horientations[page_section]) orientation="horizontal";
	var page_id = 0;
	var pageNode = getPageNode(page_id);
	var pageD = getPage(page_id);
	if (pageD) {
		if (pageD.orientation!=orientation) {
			//removePage(page_id);
			//addNewPage(orientation);
			changeOrientation(page_id, orientation);
		}
	}
	
	
	addSectionToPage( page_section, page_id);
	log("addSectionToPage() dbseccion "+page_section+" page_id:"+page_id, 'navigation' );
}


function addSectionAfterSection( page_section , prev_section ) {
	//get the page id oth post_seciton
	log("addSectionAfterSection() >> add "+page_section+" after "+prev_section, 'navigation' );
	
	var dbPrevSection = _dbForms[prev_section];
	var dbSection = _dbForms[page_section];
	var page_id = dbPrevSection["page_id"];
	
	var pageNode = getPageNode( page_id );
	var dbPrevNode = document.getElementById(dbPrevSection['idformulario']);
	var dbSectionNode = document.getElementById(dbSection['idformulario']);
		
	if (prev_section && horientations[page_section]==horientations[prev_section]) {
	
		log("addSectionAfterSection() >> same orientations! horientations[page_section] ["+horientations[page_section]+"] horientations[prev_section] ["+horientations[prev_section]+"]" , 'navigation' );
		
		if (dbPrevNode==pageNode.lastChild)
			pageNode.appendChild( dbSectionNode );
		else 
			pageNode.insertBefore( dbSectionNode, dbPrevNode.nextSibling );
			
		dbSection['page_id'] = page_id;
		dbSection['div_page_id'] = "page_"+page_id;
		fixPageLayout(page_id);
	} else {
		var next_section;
		var nextNode = dbPrevNode.nextSibling;
		if (nextNode) next_section = nextNode.getAttribute("sectionpath");
		
		log("addSectionAfterSection() >> new orientations! next_section ["+next_section+"]" , 'navigation' );
		if (next_section && horientations[page_section]==horientations[next_section]) {
			//if the next section is in a horizontal page, just put it before it!!!
			log("addSectionAfterSection() >> next_section is same orientation ["+next_section+"]" , 'navigation' );
			addSectionBeforeSection( page_section, next_section );
		} else {
			//else create a new page with the section orientation... and put it there
			var orientation = "vertical";
			if (horientations[page_section]) orientation="horizontal";
			page_id = insertNewPageAfter( page_id, orientation	 );
			addSectionToPage( page_section, page_id );
		}
	}
	
	
	

}

function addSectionBeforeSection( page_section , post_section ) {
	//get the page id oth post_seciton
	log("addSectionBeforeSection() >> add "+page_section+" before "+post_section, 'navigation' );

	var dbPostSection = _dbForms[post_section];
	var dbSection = _dbForms[page_section];
	
	if (dbPostSection==undefined)
		return error("addSectionBeforeSection() > not defined in _dbForms " + post_section );
	
	var page_id = dbPostSection[ "page_id" ];
	
	var pageNode = getPageNode( page_id );
	var dbPostNode = document.getElementById(dbPostSection['idformulario']);
	var dbSectionNode = document.getElementById( dbSection['idformulario'] );
		
	if (post_section && horientations[page_section]==horientations[post_section]) {

		pageNode.insertBefore( dbSectionNode, dbPostNode );
		
		dbSection['page_id'] = page_id;
		dbSection['div_page_id'] = "page_"+page_id;
		fixPageLayout(page_id);
	} else {
	
		var post_section;
		var prevNode = dbPostNode.previousSibling;
		if (prevNode) post_section = prevNode.getAttribute("sectionpath");		
		
		if (post_section && horientations[page_section]==horientations[post_section]) {
			//if the next section is in a horizontal page, just put it before it!!!
			addSectionAfterSection( page_section, post_section );
		} else {
			//else create a new page with the section orientation... and put it there
			var orientation = "vertical";
			if (horientations[page_section]) orientation = "horizontal";
			page_id = insertNewPageBefore( page_id, orientation );
			addSectionToPage( page_section, page_id );
		}
	}
	
}




/*
*	show page and sections...
*/
function showPageSection( page_section ) {
	
	var dbseccion = _dbForms[ page_section ];
	 log("showPageSection() >> "+page_section, 'navigation' );
	if (dbseccion==undefined) {
        log("showPageSection() error: no dbseccion for: "+page_section, 'navigation' );
        return false;
    }
	var idformulario = dbseccion['idformulario'];
	setSectionVisible( page_section );
	
	
	var dbseccionNode = dbseccion['node'];
	var sectionClass = GetAttribute( dbseccionNode, "clase");
	var dbFormHTML = document.getElementById(idformulario);
	/*to show page section (section_number)*/
	//no pages?
	if (dbPages.length==0) {
		log("showPageSection()  > create the first page > dbseccion "+page_section, 'navigation' );
		addSectionToNewPage(page_section);		
	} else {
		log("showPageSection()  > add section in existings pages > "+page_section, 'navigation' );
		//check if form exists in multipages
		if (dbseccion['page_id']>=0) {
			//just show the section... do nothing....
			log("showPageSection()  > section exists in > page_id "+dbseccion['page_id'], 'navigation' );
			showSection( idformulario );
		} else {
			//add form to the actual page... in order!!! with the form order...
			//get the page id of the forms that are before this one!!!
			// sooooo, get them!!
			
			var prev_section = getPreviousSection( page_section );//in pages
			var post_section = getPostSection( page_section );
			
			log("addSectionAfterSection() >> prev_section ["+prev_section+"]  post_section ["+post_section+"] " , 'navigation' );
			if (prev_section) {
				log("showPageSection()  > prev_section "+prev_section, 'navigation' );
				addSectionAfterSection( page_section, prev_section );
				
			} else if (post_section) {
				log("showPageSection()  > post_section "+post_section, 'navigation' );
				addSectionBeforeSection( page_section, post_section );
			} else {
				log("showPageSection()  > addSectionToFirstPage ", 'navigation' );
				addSectionToFirstPage( page_section );
			}
			showSection( idformulario );
		
		}
	
	}
	
	//log("showPageSection()  > dbseccion " +  JSON.stringify( _dbForms[ page_section ], null, "\t" )  );
	//log("showPageSection()  > pages: " +  JSON.stringify( dbPages, null, "\t" )  );
	//log("showPageSection()  > horientations "+JSON.stringify( horientations, null, "\t" ));
}


/**
*	return the page number of the section
*/
function sectionPage( section_path ) {

}

/**
*	if page is too big, create a new one
*/
function checkPageContent( number ) {
	//recorre los subnodos calculando su tama駉, si superan el alto m醲imo de la p醙ina
	//crea una nueva pagina y mueve el contenido...
}


/**
*	
*	Load fields from a section into the central frame for editing
*	Called by LoadActualForm or by hyperlinks from tree sections.
*/

function loadFields(nombreseccion) {
	
    log(" loadFields() : " + nombreseccion);
	
	var htmlFormularios = document.getElementById("dbformularios");
	
	var dbseccion = _dbForms[ nombreseccion ];
	
    if (dbseccion==undefined) {
        log("loadFields() warning: no dbseccion for: "+nombreseccion+" trying with parent " + getParentFieldPath(nombreseccion),'navigation');
		//try parent
		nombreseccion = getParentFieldPath(nombreseccion);
		dbseccion = _dbForms[ nombreseccion ];
        if (dbseccion==undefined) {return false;}
    }

	setSectionVisible( nombreseccion );
	
	var dbseccionNode = dbseccion['node'];
	var sectionClass = GetAttribute( dbseccionNode, "clase");

	//log( "loadFields() nombreseccion:"+nombreseccion+"  " +dbseccion["html"]);
	
	var htmlFormulario;	
	var idformulario;
	
	idformulario = 'dbformulario_'+ dbseccion['formularioN']+'_';
	htmlFormulario = document.getElementById(idformulario);
	
	var htmlFormulario_content = '';
	_formulario_actual = dbseccion['formularioN'];
	//alert( "loadFields:" +nombreseccion + " _formulario_actual:" + _formulario_actual );
	
	if (dbseccion!="" && dbseccion!=undefined) {
	
		if (dbseccion["html"]!="" && dbseccion["html"]!=undefined) {

			//ESCONDER TODOS LOS FORMULARIOS
			//HideForms();
			SetLocationPath(nombreseccion);
		
			if (htmlFormulario!=undefined) {
				//MOSTAR EL FORMULARIO ELEGIDO	
				//alert('showing '+idformulario);
				//alert(htmlFormulario.innerHTML);
				//$('#'+idformulario).show();				
				//$('#'+idformulario).children().show();
                //log(htmlFormulario.innerHTML);
				/*
				showSection( idformulario );
				*/
				showPageSection( nombreseccion );
				showSectionFields( nombreseccion );
				OpenHelp(nombreseccion, true);
				PlaneaDocument.createHtmlAppInterface();		
				
				if (nombreseccion=="arbol:Recursos:Presupuesto Econ贸mico") {
					drawPresuEcoIngresos( presu_eco_ingreso );
					drawPresuEcoCostos( presu_eco_costos );
				}
				
				if (nombreseccion=="arbol:Planificaci贸n:Cronograma") {
					drawD3Cronogram( _dbFields[dbCronogramPath].field_id, dbTasks, true );
				}
				
				if (nombreseccion=="arbol:Planificaci贸n:Participantes:Organigrama") {
					drawD3Organigram( _dbFields[dbOrganigramaPath].field_id, Jerarquia, true );
				}
				
				return;
			}
			
			log("loadFields() > FIRST TIME FOR nombreseccion ["+nombreseccion+"] idformulario["+idformulario+"] sectionClass["+sectionClass+"]",'navigation' );
			//alert(dbseccion["campos"]);
			//alert(idformulario+" not loaded!");
			//if (sectionClass=="titulo") {
			htmlFormulario_content = '<html:div id="'+idformulario+'" class="formulario seccion-'+sectionClass+'" sectionpath="'+nombreseccion+'" order="'+dbseccion['formularioN']+'">';
			htmlFormulario_content+= dbseccion["html"];
			htmlFormulario_content+=  '</html:div>';
			//}
			dbseccion["idformulario"] = idformulario;
			
						
			fs.writeFile( normalizePath( fs.getHomeDir() + "/db_htmlForm.html"), htmlFormulario_content.replace( new RegExp("html\\:","gi"), "") );
			htmlFormularios.innerHTML+= htmlFormulario_content;			
			//log("loadFields() >  " + htmlFormularios.innerHTML);

			if ( nombreseccion ) {
				//id dbFIeld[nombreseccion]["grafico"] == "drawXXX...." apply function!!!!
			}
			
			fs.writeFile( normalizePath( fs.getHomeDir() + "/db_full_htmlForm.html"), htmlFormularios.innerHTML.replace( new RegExp("html\\:","gi"), "") );
			
			/*aca se ejecuta el script par activar las ayudas rapidas*/
			var idCampos = dbseccion["idcampos"];
			var tipoCampos = dbseccion["tipocampos"];
		
			var idCampos_x = idCampos.split("|");
			var tipoCampos_x = tipoCampos.split("|");
			
			for(var i=0; i<idCampos_x.length; i++) {
				var idCampo = idCampos_x[i];
				
				var AYUDA = document.getElementById('ayuda_'+idCampo+'_');
				if (AYUDA) AYUDA.setAttribute( "idcampo", idCampo );
				
				if (AYUDA) AYUDA.onclick = function() {
									var idcuerpo = "ayuda_" + this.getAttribute('idcampo') + "_cuerpo";
									//alert(idcuerpo);
									var cuerpo = document.getElementById( idcuerpo );
									if (cuerpo.style.display != 'none') {
										hidediv(idcuerpo);
									} else {
										/*cuerpo.slideDown("slow");*/
										showdiv(idcuerpo);
									}
								};
				/*
				var MARCAR = $('#marcar_'+idCampo+'_');
				MARCAR.attr( "idcampo", idCampo );
				
				MARCAR.click(function() {
					var cuerpo = $("#marcar_"+$(this).attr('idcampo')+"_options");
					if (cuerpo.is( ":visible" )) {
						cuerpo.hide();
					} else {
						cuerpo.show();
					}
				});
				
				var MARCAR_OPTIONS = $('#marcar_'+idCampo+'_options');
				MARCAR_OPTIONS.attr( "idcampo", idCampo );
				
				MARCAR_OPTIONS.click(function() {
					var cuerpo = $(this);
					if (cuerpo.is( ":visible" )) {
						cuerpo.hide();
					}
				});		
*/

				/*PARRAFOS*/
				var tipo = tipoCampos_x[i];
				/*alert(tipo);*/
				if (tipo=='parrafo') {		
					/*	
					if ( CKEDITOR!=undefined ) {					

						var obj = document.getElementById( 'parrafo_' + idCampo + '_' );											
						if (obj && CKEDITOR.replace) CKEDITOR.replace( obj );												
						else error("CKEDITOR:"+CKEDITOR+' obj:parrafo_' + idCampo + '_ :' + obj );
						
					} else {
						alert(CKEDITOR);
					}
                    */
				}
				
				
			}
			
	
		} else {
			//alert("sin campos:"+nombreseccion);
		}
	} else {
		//alert("sin seccion/campos:"+nombreseccion);
	}
	
	
	showPageSection( nombreseccion );
	showSectionFields( nombreseccion );
	OpenHelp(nombreseccion, true);
				
	if (nombreseccion=="arbol:Recursos:Presupuesto Econ贸mico") {
		drawPresuEcoIngresos( presu_eco_ingreso );
		drawPresuEcoCostos( presu_eco_costos );
	}
	
	if (nombreseccion=="arbol:Planificaci贸n:Cronograma") {
		drawD3Cronogram( _dbFields[dbCronogramPath].field_id, dbTasks, true );
	}
	
	if (nombreseccion=="arbol:Planificaci贸n:Participantes:Organigrama") {
		drawD3Organigram( _dbFields[dbOrganigramaPath].field_id, Jerarquia, true );
	}
	
	

	PlaneaDocument.createHtmlAppInterface();	
}
