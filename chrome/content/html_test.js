function dragWindowMove( obj, event ) {
}

function dragWindowStarted( obj, event ) {
}
function dragWindowStopped( obj, event ) {
}

function changeZoom(e) {
	var tofloat = (parseInt(e.value)/100);
	var wclient = window.outerWidth;
	var ideal = wclient / 1400;
	log("zooming to:" + e.value+" % > [" + tofloat+"] in wclient ["+wclient+"] ideal is ["+ideal+"]");
	setLayoutCssPref( "devPixelsPerPx", ""+tofloat+"" );
}

function getLayoutCssPref( name ) {
/*
	var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService);
	var layout_css_branch = prefs.getBranch("layout.css.");
	var valueget = layout_css_branch.getCharPref( name );
	return valueget;
	*/
}

function setLayoutCssPref( name, value) {
/*
var prefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService);
var layout_css_branch = prefs.getBranch("layout.css.");
var valueget = layout_css_branch.getCharPref( name );
layout_css_branch.setCharPref( name, value );

*/
}

function createHtmlAppInterface() {
	log("createHtmlAppInterface dummy");
}

function HideField( field_path, field_id ) {

	var field_data = _dbFields[ field_path ];
	var section_path = field_data[ "section_path" ]
	var fieldNode = field_data.node;
	//var values = GetValues(fieldNode);
	var values = document.getElementById(field_id).value;
	var dbForm = _dbForms[section_path];
	if (values=="" || values==undefined) {
		//hide this field only ?? or hide his section???
		//we hide the full section, only if all brothers are empty too!!!
		hideSection( "dbformulario_"+dbForm["formularioN"]+"_" );
	}
}

function SaveField( field_path ) {
	log("html_test.js: SaveField() > field_path:" + field_path);
}

function log( str ) {
	console.log(str);
}

function error( str) {
	console.log("ERROR:"+str);
}


function tabsHide () {

    //var e = document.getElementById( "tabmenu" );
	if (typeof jQuery != 'undefined') {
	 
		//alert("jQuery library is loaded!");
		$("#tabmenu .deep-0").each(function(id, Ele) {
			//alert(Ele.innerHTML);
			$("#"+Ele.getAttribute("id")).hide();
			
		});
		
		$("#tabmenu .padre").each(function(id, Ele) {
			//alert(Ele.innerHTML);
			//$("#"+Ele.getAttribute("id")).hide();
			Ele.setAttribute("class","categoria item-0 first padre categoria-collapsed");
		});
	}else{
	 
		alert("jQuery library is not found!");
	 
	}
}

function openclose( id, field_path ) {
		var section = document.getElementById(id);
		if (section) {
			if (section.getAttribute("class").indexOf("deep-0")>=0) {
				tabsHide();
				showdiv(id);
				var parentNode = section.parentNode;
				parentNode.setAttribute("class","categoria item-0 first padre categoria-expanded");
			}
		}
}
function openclosesel( id ) {
	togglediv(id);
}


var formula = '{[arbol:Recursos:Ingresos:Ingresos generación propia]:ingresoestimado}' 
			+ ' + {[arbol:Recursos:Ingresos:Ingresos fuentes externas]:ingresoestimado}'
			+ ' + {[arbol:Recursos:Costos:Costos]:importedelcosto}';
//var formula = '{a} + {b} + {c}';

//"^arbol:(\s|\+|\*|\n)$"

var regex_var = new RegExp( "{[^{}]+}", "mgi" );
var regex_rec = new RegExp( "\\[[^\\[\\]]+\\]", "mgi" );
var regex_rec_path = new RegExp( "[^\\[\\]]+", "mgi" )
var regex_field = new RegExp( "[:][^\\[\\]\\{\\}]+[\\}]", "mgi" );
var regex_field_x = new RegExp( "[^:\\}]+", "mgi" );
log(formula);
var res = formula.match( regex_var );
//replace( regex, "YEP" );
log(res.length);
//log( JSON.stringify( res, null, "\t") )

for(var i in res) {
	var forvar = res[i];
	var rec_path = forvar.match( regex_rec );
	rec_path = rec_path[0].match( regex_rec_path );
	var rec_field = forvar.match( regex_field );
	rec_field = rec_field[0].match( regex_field_x )
	log (" rec_path => " + rec_path + " rec_field => " + rec_field );
}
















