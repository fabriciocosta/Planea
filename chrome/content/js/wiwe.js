/*WIWE JS version 5.0 05/06/2007*/

var textareasEditNumber = 0;
var textareasEdit = new Array();

var subcontenido_flag = false;
var subcontenido_id = 0;
var form_name = '';

function SubContenidoActivado() {
	return subcontenido_flag;
}

function ActivarSubContenido() {
	subcontenido_flag = true;
}

function DesactivarSubContenido() {
	subcontenido_flag = false;
}

function SetSubContenido( idsubcontenido ) {
	subcontenido_id = idsubcontenido;
}



var multiplexhrs = new Array();
var idxhrs = 0;


function getXhr()
{
	if(window.XMLHttpRequest) {
		multiplexhrs[idxhrs] = new XMLHttpRequest(); 
		idxhrs++;
	    return (idxhrs-1);
	} else if(window.ActiveXObject) {

	  	try{
	     	multiplexhrs[idxhrs] = new ActiveXObject('Msxml2.XMLHTTP');
	    } catch (e) 
	     {
	     	multiplexhrs[idxhrs] = new ActiveXObject('Microsoft.XMLHTTP');
	     }
	     idxhrs++;
	    return (idxhrs-1);
	} else {
	 	alert('Your browser doesn\'t support XMLHTTPRequest objects...'); 
		return (-1);
	} 
}

if (typeof window.DOMParser != "undefined") {
	LoadXMLFromStr = function(xmlStr) {
        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
    };
} else if (typeof window.ActiveXObject != "undefined" &&
       new window.ActiveXObject("Microsoft.XMLDOM")) {
	LoadXMLFromStr = function(xmlStr) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    };
} else {
    throw new Error("No XML parser found");
}


function DynamicRequestVar( variable, phprequest, params, endcallback, mimetype )
{
	if (params!='') params+='&'; 
	params+= 'rand='+Math.random ();
		
	var idxhr = getXhr();
	var XOBJ = null;
	if (idxhr>-1) {
		XOBJ = multiplexhrs[idxhr];
		XOBJ.onreadystatechange = function()
		    {		
		     if( XOBJ.readyState == 4 && (XOBJ.status == 200 || XOBJ.status == 0 ) )
		     {		     			    			     	
	    	 	eval( variable + '= XOBJ.responseText');
		     	if (endcallback!=undefined) {
                    if (typeof(endcallback)=='function') {                        
                        endcallback();
		     		} else eval(endcallback);
		     	}
	 	
		     } else if (XOBJ.readyState == 4) {
		    	 if (XOBJ.status!=200) {
		    		 alert("DynamicRequest error, status:"+XOBJ.status); 
		    	 }		    	 		    	
		     }
		    }
		XOBJ.open('GET',phprequest + '?' + params, true);
		if (!document.all && mimetype!=undefined) {
			//XOBJ.overrideMimeType("text/html; charset=ISO-8859-1");
            XOBJ.overrideMimeType(mimetype);
		}
		XOBJ.send(null);
		
	}
}

function DynamicRequest( idobject, phprequest, params, endcallback )
{
	if (params!='') params+='&'; 
	params+= 'rand='+Math.random ();
	
	showdiv(idobject+'loader');
	var idxhr = getXhr();
	var XOBJ = null;
	if (idxhr>-1) {
		XOBJ = multiplexhrs[idxhr];
		XOBJ.onreadystatechange = function()
		    {
		     if( XOBJ.readyState == 4 && XOBJ.status == 200 )
		     {
		     	document.getElementById(idobject).innerHTML = XOBJ.responseText;
		     	
		     	hidediv(idobject+'loader');
		     	hidediv(idobject);
		     	showdiv(idobject);
		     	if (endcallback!=undefined) {
		     		//alert(endcallback);
		     		eval(endcallback);
		     	}
	 	
		     }
		    }
		XOBJ.open('GET',phprequest + '?' + params, true);
		if (!document.all) {
			XOBJ.overrideMimeType("text/html; charset=ISO-8859-1");
		}
		XOBJ.send(null);
		
	}
}

/**
*
* @iddest div id
* @tipo  'secciones' o 'contenidos'
* @selectid  'id del select'
* @selectname  'id del name'
* @selectscript 'onchagne="javascript:xxxx"
*/
function select_update( iddest, selectid, selectname, selectscript, tipo, filtervalue, firstvalue, firstoption, fieldid, fieldlabel, sql, sqlcount, selectedvalue ) {

	params = 'accion=update';
	params+= '&iddest='+iddest;
	params+= '&selectid='+selectid;
	params+= '&selectname='+selectname;		
	params+= '&selectscript='+selectscript;
	params+= '&tipo='+tipo;	
	params+= '&filtervalue='+filtervalue;
	params+= '&selectid='+selectid;
	params+= '&selectname='+selectname;
	params+= '&fieldid='+fieldid;
	params+= '&selectedvalue='+selectedvalue;
	params+= '&firstvalue='+firstvalue;
	params+= '&firstoption='+firstoption;
	params+= '&fieldlabel='+fieldlabel;	
	params+= '&sql='+sql;
	params+= '&sqlcount='+sqlcount;
	DynamicRequest( iddest, dirabs + '/inc/core/select.php', params );
	
}

function relaciones_confirmadd( tipocampo, tiporelacion, id_contenido_seccion, sql, sqlcount, hide, id_sel, last_callback ) {
	callback = '';
	var el = document.getElementById('_relaciones_IDS_'+tipocampo);
	
	var id_contenido_seccion_rel;
	
	if (hide==undefined) hide='1';
	
	if (el.selectedIndex>=0) {
		id_contenido_seccion_rel = el.options[el.selectedIndex].value;
		if (id_contenido_seccion_rel) {
			id_contenido_seccion_rel = id_contenido_seccion_rel;
		} else alert("Warning "+id_contenido_seccion_rel+" undefined");
	} else {
		//alert("Warning "+'_relaciones_IDS_'+tipocampo+" not founded");
		if (id_sel>0) {
			id_contenido_seccion_rel = id_sel;
		} else alert("Warning id_sel undefined");
	}

	params = 'accion=confirmadd';
	params+= '&tiporelacion='+tiporelacion;
	params+= '&id_contenido_seccion='+id_contenido_seccion;
	params+= '&sql='+sql;	
	params+= '&sqlcount='+sqlcount;	
	params+= '&id_contenido_seccion_rel='+id_contenido_seccion_rel;	
	params+= '&tipodetalle='+tipocampo;
	params+= '&hide='+hide;		
	params+= '&last_callback='+last_callback;
	if (hide=='1') hidediv('div_select_relaciones_'+tipocampo);
	if (hide=='0') callback = 'relaciones_add( \''+tipocampo+'\', \''+tiporelacion+'\', \''+id_contenido_seccion+'\', \''+sql+'\', \''+sqlcount+'\', \''+hide+'\', \''+last_callback+'\' )'; 
	DynamicRequest( 'div_relaciones_'+tipocampo, dirabs + '/inc/core/relaciones.php', params, callback );
	
}

/*
	show the items that can be added
*/
function relaciones_add( tipocampo, tiporelacion, id_contenido_seccion, sql, sqlcount, hide, last_callback ) {
	
	//if ( sqlrel_cookie!='undefined' ) sql = sqlrel_cookie;
	//if ( sqlrel_count_cookie!='undefined' ) sqlcount = sqlrel_count_cookie;
	params = 'accion=add';
	params+= '&tiporelacion='+tiporelacion;
	params+= '&id_contenido_seccion='+id_contenido_seccion;
	params+= '&sql='+sql;
	params+= '&sqlcount='+sqlcount;
	params+= '&tipodetalle='+tipocampo;
	params+= '&hide='+hide;
	params+= '&last_callback='+last_callback;	
	DynamicRequest( 'div_select_relaciones_'+tipocampo, dirabs + '/inc/core/relaciones.php', params, last_callback );
	
}

function relaciones_add_autocomplete( event, id_input_field, type_input_field, tipodetalle, tiporelacion, id_contenido_seccion, sql, sqlcount, hide, callback ) {
	callback = '';
	
	//alert(event);
	
	if (event==40 || event==38 || event==13 ) {
		
				
		if (id_input_field) terms_field = document.getElementById(id_input_field);
		if (id_input_field) terms_field_n = document.getElementById('nresultados_'+tipodetalle).value;
		if (id_input_field) terms_field_i = document.getElementById('iresultado_'+tipodetalle);
		
		terms_field.idsel_old = terms_field.idsel;
		
		if ( terms_field.idsel!=undefined && event==40 ) {
		
			 terms_field.idsel = terms_field.idsel+1;
			 if (terms_field.idsel >= terms_field_n) {			 
			 	terms_field.idsel = terms_field_n - 1;
			 }
		
		} else if ( terms_field.idsel!=undefined  && event==38 ) {
		
			terms_field.idsel = terms_field.idsel-1;
			if (terms_field.idsel <= 0 ) {
			 	terms_field.idsel = 0;
			 }
		
		} else if ( event!=13 ) {
		
			terms_field.idsel = 0;
			terms_field.idsel_old = terms_field.idsel;
		
		}
		
		terms_field_i.value = terms_field.idsel;
		
		var DIVID_old = terms_field.idsel_old+"-record-"+id_input_field;
		var dobj = document.getElementById( DIVID_old );	
		if (dobj) {
			dobj.className = "record-link";
		}// else alert( DIVID_old + " not found" );		
		
		
		var DIVID = terms_field.idsel+"-record-"+id_input_field;
		dobj = document.getElementById( DIVID );	
		if (dobj) {
			dobj.className = "record-link record-link-hover";
		}// else alert( DIVID + " not found" );
		
		if (event==13) {
			//alert("ok");
			if (dobj) {
				dobj.onclick();
			}
		}
		
		//alert(terms_field.idsel);
		
	} else {
		if (id_input_field) terms_field = document.getElementById(id_input_field);
		//alert(terms_field.value);
		params = 'accion=addautocomplete';
		params+= '&terms='+terms_field.value;
		params+= '&id_input_field='+id_input_field;
		params+= '&type_input_field='+type_input_field;
		params+= '&tiporelacion='+tiporelacion;
		params+= '&tipodetalle='+tipodetalle;
		params+= '&id_contenido_seccion='+id_contenido_seccion;
		params+= '&sql='+sql;
		params+= '&sqlcount='+sqlcount;
		DynamicRequest( 'div_select_relaciones_'+tipodetalle, dirabs + '/inc/core/relaciones.php', params, callback );
	}
}

function relaciones_update( tipocampo, tiporelacion, id_contenido_seccion, sql, sqlcount, hide, last_callback ) {

	params = 'accion=update';
	params+= '&tiporelacion='+tiporelacion;
	params+= '&id_contenido_seccion='+id_contenido_seccion;
	params+= '&sql='+sql;
	params+= '&sqlcount='+sqlcount;		
	params+= '&tipodetalle='+tipocampo;
	params+= '&hide='+hide;
	params+= '&last_callback='+last_callback;
	DynamicRequest( 'div_relaciones_'+tipocampo, dirabs + '/inc/core/relaciones.php', params, last_callback );
	
}

function relaciones_clear( tipocampo, tiporelacion, id_contenido_seccion, sql, sqlcount, hide, last_callback ) {
	params = 'accion=clear';
	params+= '&tiporelacion='+tiporelacion;
	params+= '&id_contenido_seccion='+id_contenido_seccion;
	params+= '&sql='+sql;
	params+= '&sqlcount='+sqlcount;		
	params+= '&tipodetalle='+tipocampo;
	params+= '&hide='+hide;
	params+= '&last_callback='+last_callback;
	if (hide=='1') hidediv('div_select_relaciones_'+tipocampo);	
	if (hide=='0') callback = 'relaciones_add( \''+tipocampo+'\', \''+tiporelacion+'\', \''+id_contenido_seccion+'\', \''+sql+'\', \''+sqlcount+'\', \''+hide+'\', \''+last_callback+'\'  )';	
	DynamicRequest( 'div_relaciones_'+tipocampo, dirabs + '/inc/core/relaciones.php', params, callback );
}

function relaciones_delete( tipocampo, tiporelacion, id_contenido_seccion, sql, sqlcount, idtodelete, hide, last_callback ) {
		callback = '';
		params = 'accion=delete';
		params+= '&tiporelacion='+tiporelacion;
		params+= '&id_contenido_seccion='+id_contenido_seccion;
		params+= '&sql='+sql;
		params+= '&sqlcount='+sqlcount;
		params+= '&idtodelete='+idtodelete;
		params+= '&tipodetalle='+tipocampo;
		params+= '&hide='+hide;
		params+= '&last_callback='+last_callback;		
		if (hide=='0') callback = 'relaciones_add( \''+tipocampo+'\', \''+tiporelacion+'\', \''+id_contenido_seccion+'\', \''+sql+'\', \''+sqlcount+'\', \''+hide+'\', \''+last_callback+'\' )';
		DynamicRequest( 'div_relaciones_'+tipocampo, dirabs + '/inc/core/relaciones.php', params, callback );
}

function subValid( obj ) {
	pausecomp(1000);	
}

function preventbubble(e){

 if (e && e.stopPropagation) {
 //if stopPropagation method supported 
  e.stopPropagation()
  //alert("stopPropagation");
 } else {
  event.cancelBubble=true
  //alert("cancelBubble");
 }
  
 
}

function preventSubmit(event) {
	
	//
	//alert(event.keyCode);
	if (event.keyCode==13) event.preventDefault();
	//preventbubble(event);
   //var KeyID = (window.event) ? event.keyCode : e.keyCode;	
	
}

function pausecomp(millis)
{
	var date = new Date();
	var curDate = null;

	do { curDate = new Date(); }
	while(curDate-date < millis);
} 


function textCounter( field_id, cntfield_id, maxlimit) {
	
	var field = document.getElementById( field_id );
	var cntfield = document.getElementById( cntfield_id );
		
	if (field && field.value.length > maxlimit) {// if too long...trim it! 
		field.value = field.value.substring(0, maxlimit);
		// otherwise, update 'characters left' counter
		alert('Recuerde que el máximo de caracteres permitidos es de '+maxlimit+'.');
	} else {
		cntfield.value = maxlimit - field.value.length;
	}
}


function searchterm_add_autocomplete( event, id_input_field, type_input_field, tipodetalle, sql, sqlcount, hide, callback ) {
	callback = '';
	
	//alert(event);
	
	if (event==40 || event==38 || event==13 ) {		
				
		if (id_input_field) terms_field = document.getElementById(id_input_field);
		if (id_input_field) terms_field_n = document.getElementById('nresultados_'+id_input_field).value;
		if (id_input_field) terms_field_i = document.getElementById('iresultado_'+id_input_field);
		
		terms_field.idsel_old = terms_field.idsel;
		
		if ( terms_field.idsel!=undefined && event==40 ) {
		
			 terms_field.idsel = terms_field.idsel+1;
			 if (terms_field.idsel >= terms_field_n) {			 
			 	terms_field.idsel = terms_field_n - 1;
			 }
		
		} else if ( terms_field.idsel!=undefined  && event==38 ) {
		
			terms_field.idsel = terms_field.idsel-1;
			if (terms_field.idsel <= 0 ) {
			 	terms_field.idsel = 0;
			 }
		
		} else if ( event!=13 ) {
		
			terms_field.idsel = 0;
			terms_field.idsel_old = terms_field.idsel;
		
		}
		
		terms_field_i.value = terms_field.idsel;
		
		var DIVID_old = terms_field.idsel_old+"-record-"+id_input_field;
		var dobj = document.getElementById( DIVID_old );	
		if (dobj) {
			dobj.className = "record-link";
		}// else alert( DIVID_old + " not found" );		
		
		
		var DIVID = terms_field.idsel+"-record-"+id_input_field;
		dobj = document.getElementById( DIVID );	
		if (dobj) {
			dobj.className = "record-link record-link-hover";
		}// else alert( DIVID + " not found" );
		
		if (event==13) {
			//alert("ok");
			if (dobj) {
				dobj.onclick();
			}
		}
		
		//alert(terms_field.idsel);  
		
	} else {
		if (id_input_field) terms_field = document.getElementById(id_input_field);
		params = 'accion=addautocomplete';
		params+= '&terms='+terms_field.value;
		params+= '&id_input_field='+id_input_field;
		params+= '&type_input_field='+type_input_field;
		params+= '&tipodetalle='+tipodetalle;
		params+= '&sql='+sql;
		params+= '&sqlcount='+sqlcount;
		DynamicRequest( 'div_searchterm_'+id_input_field, dirabs + '/inc/core/searchterm.php', params, callback );
	}
}


function AutoComplete( id_field, legend_text, sql, callback ) {
	
	var input_FIELD = document.getElementById(id_field);
	if (input_FIELD) {
		
		document.write(
				'<div id="div_searchterm_'+id_field+'" class="pop-relaciones"></div>' +
				'<div id="div_searchterm_'+id_field+'loader"></div>' +
				'<input type="hidden" value="" id="'+id_field+'_idx" name="'+id_field+'_idx" size="4" />'+
  	 			'<div class="hidden">'+
	 				'<div id="div_searchterm_'+id_field+'_lastid"></div>'+
	 			'</div>'+
	 			'<div id="div_searchterm_'+id_field+'_lastidloader"></div>'
	 			);
		
		input_FIELD.id_field = id_field;
		input_FIELD.legend_text = legend_text;
		input_FIELD.sql = sql;
		input_FIELD.sql_count = sql.replace( "*", "COUNT(*)");
		
		if (input_FIELD.value=="") {
			//alert(legend_text);
			input_FIELD.value = legend_text;
		}
		
		input_FIELD.autocomplete = "off";
		
		input_FIELD.onblur = function(e) {
			if (!e) e = event;
			searchterm_onblur( this.id_field, this.legend_text ); 
			setTimeout(' hidediv(\'div_searchterm_'+this.id_field+'\')', 500 );
		}
		input_FIELD.onkeypress = function(e) {
			if (!e) e = event;
			preventSubmit(e);
		}
		input_FIELD.onfocus = function(e) {
			if (!e) e = event;
			searchterm_onfocus( this.id_field, this.legend_text );
		}
		input_FIELD.onkeyup = function(e) {
			if (!e) e = event;
			//callback2 = callback.replace( "\'","\\\'" );
			//callback3 = callback2.replace( "\\","\\\\" );
			//alert( callback2 );
			setTimeout('searchterm_add_autocomplete2( \''+e.keyCode+'\',\''+this.id_field+'\',\'text\',\'contenidos\',\''+this.sql+'\',\''+this.sql_count+'\',\'0\',\'searchterm_select_reset_2(\\\''+this.id_field+'\\\')\')',10);
		}
	} 
	
}


/*
 * searchterm_add_autocomplete2( )
 * 
 * 
 * 
 */

function searchterm_select_reset_2( id_input_field ) {
	
	if (id_input_field) terms_field = document.getElementById(id_input_field);
	if (id_input_field) terms_field_n = document.getElementById('nresultados_'+id_input_field).value;
	if (id_input_field) terms_field_i = document.getElementById('iresultado_'+id_input_field);
	
	if (terms_field_n==0) return;
	
	/*RESET selection, any keystroke*/
	terms_field.idsel = 0;
	terms_field.idsel_old = terms_field.idsel;						
	if (terms_field_i) terms_field_i.value = terms_field.idsel
	
	terms_field_i.value = terms_field.idsel;
		
	var DIVID = terms_field.idsel+"-record-"+id_input_field;
	dobj = document.getElementById( DIVID );	
	if (dobj) {
		dobj.className = "record-link record-link-hover";
		//alert( DIVID + " found" );
	} else alert( DIVID + " not found" );	
	
}

function searchterm_add_autocomplete2( event, id_input_field, type_input_field, tiporelacion, sql, sqlcount, hide, callback ) {
	
	//callback = '';

	if (id_input_field) terms_field = document.getElementById(id_input_field);
	if (id_input_field) terms_field_n = document.getElementById('nresultados_'+id_input_field);
	if (id_input_field) terms_field_i = document.getElementById('iresultado_'+id_input_field);	
	
	/*
	 * 40: down arrow
	 * 38: up arrow
	 * 13: enter
	 * 27: escape
	 * */
	//if (event==40) alert(event);
	if (event==40 || event==38 || event==13 || event==27 ) {
		
				
		if (terms_field_n) terms_field_n = terms_field_n.value;
				
		terms_field.idsel_old = terms_field.idsel;
		
		/*DOWN selection*/
		if ( terms_field.idsel!=undefined && event==40 ) {
		
			 terms_field.idsel = terms_field.idsel+1;
			 if (terms_field.idsel >= terms_field_n) {			 
			 	terms_field.idsel = terms_field_n - 1;
			 }
		
		/*UP selection*/
		} else if ( terms_field.idsel!=undefined  && event==38 ) {
		
			terms_field.idsel = terms_field.idsel-1;
			if (terms_field.idsel <= 0 ) {
			 	terms_field.idsel = 0;
			 }
					
		}
		
		terms_field_i.value = terms_field.idsel;
		
		var DIVID_old = terms_field.idsel_old+"-record-"+id_input_field;
		var dobj = document.getElementById( DIVID_old );	
		if (dobj) {
			dobj.className = "record-link";
		} else alert( DIVID_old + " not found" );		
		
		
		var DIVID = terms_field.idsel+"-record-"+id_input_field;
		dobj = document.getElementById( DIVID );	
		if (dobj) {
			dobj.className = "record-link record-link-hover";
			//alert( DIVID + " found" );
		} else alert( DIVID + " not found" );
		
		if (event==13) {
			//alert("ok");
			if (dobj) {
				dobj.onclick();
			}
		} else if (event==27) {
			hidediv( 'div_searchterm_' + id_input_field );
		}
			
		
		//alert(terms_field.idsel);
		
	} else {
		
		params = 'accion=addautocomplete';
		params+= '&terms='+terms_field.value;
		params+= '&id_input_field='+id_input_field;
		params+= '&type_input_field='+type_input_field;
		params+= '&tiporelacion='+tiporelacion;
		params+= '&sql='+sql;
		params+= '&sqlcount='+sqlcount;		
		DynamicRequest( 'div_searchterm_'+id_input_field, dirabs + '/inc/core/searchterm_2.php', params, callback );
	}
}



function searchterm_add( id_input_field, type_input_field, tipodetalle, sql, sqlcount, hide, callback ) {
	callback = '';
	if (id_input_field) terms_field = document.getElementById(id_input_field);
	
	var divterm =  document.getElementById('div_searchterm_'+id_input_field);
	//alert(divterm.style.display);
	if (divterm.style.display != 'none') {
		///esconder si se cliquea dos veces...
		divterm.style.display = 'none';
		//return;
	}
	
	params = 'accion=add';
	params+= '&terms='+terms_field.value;
	params+= '&id_input_field='+id_input_field;
	params+= '&type_input_field='+type_input_field;
	params+= '&tipodetalle='+tipodetalle;
	params+= '&sql='+sql;
	params+= '&sqlcount='+sqlcount;
	DynamicRequest( 'div_searchterm_'+id_input_field, dirabs + '/inc/core/searchterm.php', params, callback );
}

function searchterm_confirmadd( id_input_field, type_input_field, tipodetalle, idcontenidoseccion, sql, sqlcount, hide, id_sel, term_sel, callback ) {
	
	callback = '';
	
	var el = document.getElementById('_searchterm_IDS_'+tipodetalle);
	
	var id_contenido_seccion_rel;
		
	if (hide==undefined) hide='1';
	
	if (el && el.selectedIndex>=0) {
		idcontenidoseccion = el.options[el.selectedIndex].value;
		term = el.options[el.selectedIndex].text;
		if (idcontenidoseccion) {
			idcontenidoseccion = idcontenidoseccion;
		} else alert("Warning "+idcontenidoseccion+" undefined");
	} else {
		//alert("Warning "+'_relaciones_IDS_'+tipocampo+" not founded");
		if (id_sel>0 || term_sel!="") {
			idcontenidoseccion = id_sel;
			term = term_sel;
		} else alert("Warning id_sel undefined");
	}
	
	if (id_input_field) terms_field = document.getElementById(id_input_field);
	if (!terms_field) { alert(id_input_field+" undefined"); return; }
	(terms_field.value=="") ? coma = "" : coma = ", ";
	
	var str = terms_field.value;
	var terms_array = str.split( "," );
	
	if ( terms_array.length > 0 ) {
		lasterm = terms_array[ terms_array.length-1 ];
	} else { 
		terms_array = new Array(1);		 
		lasterm = str;
		terms_array[0] = lasterm;
	} 
	
	//alert(lasterm);
	terms_array[ terms_array.length-1 ] = term ;
	
	if (type_input_field=="text") {
		terms_field.value = "";
		coma = "";
		for(i=0; i<terms_array.length; i++) {
			terms_field.value = terms_field.value + coma + terms_array[i];
			coma = ", ";
		}
	}
	
		
	params = 'accion=confirmadd';
	params+= '&terms='+terms_field.value;
	params+= '&id_input_field='+id_input_field;
	params+= '&type_input_field='+type_input_field;
	params+= '&tipodetalle='+tipodetalle;
	params+= '&idcontenidoseccion='+idcontenidoseccion;
	params+= '&term='+term;
	params+= '&sql='+sql;
	params+= '&sqlcount='+sqlcount;
	
	DynamicRequest( 'div_searchterm_'+id_input_field, dirabs + '/inc/core/searchterm.php', params, callback );
	
}


function searchterm_confirmadd_2( id_input_field, type_input_field, tiporelacion, idcontenidoseccionusuario, sql, sqlcount, hide, id_sel, term_sel, callback ) {
	
	callback = '';
	
	var el = document.getElementById('_searchterm_IDS_'+tiporelacion);
	var idx = document.getElementById( id_input_field + '_idx')
	
	if (idx) idx.value = id_sel;
	
	var id_contenido_seccion_rel;
		
	if (hide==undefined) hide='1';
	
	if (el && el.selectedIndex>=0) {
		idcontenidoseccionusuario = el.options[el.selectedIndex].value;
		term = el.options[el.selectedIndex].text;
		if (idcontenidoseccionusuario) {
			idcontenidoseccionusuario = idcontenidoseccionusuario;
		} else alert("Warning "+idcontenidoseccionusuario+" undefined");
	} else {
		//alert("Warning "+'_relaciones_IDS_'+tipocampo+" not founded");
		if (id_sel>0 || term_sel!="") {
			idcontenidoseccionusuario = id_sel;
			term = term_sel;
		} else alert("Warning id_sel undefined");
	}
	
	if (id_input_field) terms_field = document.getElementById(id_input_field);
	if (!terms_field) { alert(id_input_field+" undefined"); return; }
	(terms_field.value=="") ? coma = "" : coma = ", ";
	
	var str = terms_field.value;
	var terms_array = str.split( "," );
	
	if ( terms_array.length > 0 ) {
		lasterm = terms_array[ terms_array.length-1 ];
	} else { 
		terms_array = new Array(1);		 
		lasterm = str;
		terms_array[0] = lasterm;
	} 
	
	//alert(lasterm);
	terms_array[ terms_array.length-1 ] = term ;
	
	if (type_input_field=="text") {
		terms_field.value = "";
		coma = "";
		for(i=0; i<terms_array.length; i++) {
			terms_field.value = terms_field.value + coma + terms_array[i];
			coma = ", ";
		}
	}
	
	params = 'accion=confirmadd';
	params+= '&terms='+terms_field.value;
	params+= '&id_input_field='+id_input_field;
	params+= '&type_input_field='+type_input_field;
	params+= '&tiporelacion='+tiporelacion;
	params+= '&idcontenidoseccionusuario='+idcontenidoseccionusuario;
	params+= '&term='+term;
	params+= '&sql='+sql;
	params+= '&sqlcount='+sqlcount;
	
	if (AutoCompleteObject) {
		callback = 'AutoCompleteObject(\'' + id_input_field + '\')';
	}
	//alert( callback );		
	//eval ( callback );	
	//setTimeout( callback, 4000 );
	//callback = '';
	DynamicRequest( 'div_searchterm_'+id_input_field, dirabs + '/inc/core/searchterm_2.php', params, callback );
	
	return false;
}

function searchterm_get_fields( idfield, id, fields, details, callback ) {
	
	params = 'accion=get';
	params+= '&fields='+fields; //*TITULO*.*DESCRIPCION*
	params+= '&id='+id;
	params+= '&details='+details; // *#ORGANIZACION_WEB#*,*#ORGANIZACION_MAIL#*
	
	//alert("searchterm_get_fields: params: " +params+" callback:"+callback);
	
	DynamicRequest( 'div_searchterm_'+idfield+'_lastid', dirabs + '/inc/core/searchterm_2.php', params, callback );
	return false;
}

function searchterm_onblur( id_input_field, inputvalue ) {
	
	//alert(id_input_field);
	var el = document.getElementById(id_input_field);
	
	if ( el && el.value=="" ) {		
		el.value = inputvalue;
	}
}

function searchterm_onfocus( id_input_field, inputvalue ) {
	
	//alert(id_input_field);
	var el = document.getElementById(id_input_field);
	
	if ( el && el.value==inputvalue ) {
		el.value = "";
	}
	
}

function ContentManager( p_tipoid, p_divid, p_textid, p_fieldtext, p_fieldid) {

	  this.tipoid = p_tipoid;
	  this.divid = p_divid;
	  this.textid = p_textid;
	  this.fieldtext = p_fieldtext;	  
	  this.fieldid = p_fieldid;
	  this.counter = 0; 
	  this.firstRow = 0;
	  this.lastRow = 0;
	  this.highlightedRow = 0;
	  this.clickfun = this.ContentClick;
	  this.oldquery = "";
	 
	  //private methods
	  this.rowsids = new Array();
	  this.rowstexts = new Array();
	  
	  this.SetRows = function ( idset, textset ) {
		  if (idset!='') {
		    this.idset = new String(idset); 
		  	this.rowsids = idset.split('|');
		  	this.rowstexts =  textset.split('|');
		  	this.lastRow =  this.rowsids.length - 1;
		  	this.highlightedRow = -1;
		  } else {
		  	this.idset = '';
		  	this.rowsids = new Array();
			this.rowstexts = new Array();		  	
		  	this.lastRow =  0;
		  	this.highlightedRow = -1;
		  	
		  }
	  };

	  this.SetFirstRow = function() {
	  	this.highlightedRow = firstRow;
	  };

	  this.SetNextRow = function() {
	  		if (this.highlightedRow==-1 && this.rowsids.length>0 ) {
	  			this.highlightedRow = 0;
	  			this.AllOff();
	  			this.ShowItem(this.highlightedRow);
	  		} else if (this.rowsids.length>0 &&  this.highlightedRow<this.lastRow) {
	  			this.highlightedRow++;
	  			this.AllOff();
	  			this.ShowItem(this.highlightedRow);
	  		}
	  };
	  
	  this.SetPreviousRow = function() {
	  		if (this.highlightedRow==-1 && this.rowsids.length>0 ) {
	  			this.highlightedRow = 0;
	  			this.AllOff();
	  			this.ShowItem(this.highlightedRow);
	  		} else if (this.rowsids.length>0 && this.highlightedRow>0) {
	  			this.highlightedRow--;
	  			this.AllOff();
	  			this.ShowItem(this.highlightedRow);
	  		}
	  };
	  
	  this.AllOff = function() {
	  	if (this.rowsids.length>0) {
		  	for(i=0; i<this.rowsids.length; i++) {
		  		this.HideItem( i );
		  	}
	  	}
	  }
	  
	  this.EnterItem = function() {
	  	if (this.highlightedRow >= 0) {

		} else {
			if (this.rowsids.length>0) {
				this.highlightedRow = 0;
			}
		}
		
		if (this.highlightedRow >= 0) {
			idcontent = this.rowsids[this.highlightedRow];
			var DIVID = this.divid +  idcontent;
			
			var dobj = document.getElementById( DIVID );
			dobj.className = "content_click";		
			
			eval( this.clickfun + '(' + idcontent + ',\'' + this.rowstexts[this.highlightedRow] +'\')');
			//var selcountry = document.getElementById( this.textid );
			//var textcountry = document.getElementById( this.fieldtext );
			//selcountry.value = this.rowstexts[this.highlightedRow];
			//textcountry.value = this.rowstexts[this.highlightedRow];
					
			//var inputcountry = document.getElementById( this.fieldid );
			//inputcountry.value = idcountry;
			
			hidediv(this.divid);
			//hideallmenus();
		}
	  };
	  
	  this.OnFocus = function(texto) {
		var inputtext;
		inputtext = document.getElementById(this.textid);
		if (inputtext) {
			if (inputtext.value == texto ) {
				inputtext.value = '';
			}
		}
		//hideallmenus();
	  };
	  
	  this.OnBlur = function() {
	  	
	  	// if is showing enteritem else nothing...
	  	
	  	/*var dobj = document.getElementById( this.divid );
	  	
	  	if ( dobj && dobj.style.display == 'inline' ) {
	  		this.EnterItem();
	  	} else {
	  	}*/

	  };	  
	  
	  this.HideItem = function(rowid) {
	  		var iditem = this.rowsids[rowid];
	  		var DIVID = this.divid + iditem ;	
			var dobj = document.getElementById( DIVID );	
			dobj.className = "content_out";
	  };
	  
	  this.ShowItem = function(rowid) {
	  		var iditem = this.rowsids[rowid];
	  		var DIVID = this.divid + iditem ;	
			var dobj = document.getElementById( DIVID );	
			dobj.className = "content_over";
	  };	  
	
      this.StartAutoComplete = function( myev, mytime ) {

			var keynum;
			var keychar;
			var numcheck;
			
			if (!myev) var myev = window.event;
				
			if(window.event) // IE
			  {
			  keynum = myev.keyCode;
			  }
			else if(myev.which) // Netscape/Firefox/Opera
			  {
			  keynum = myev.which;
			  }
			  
			 if ( keynum == undefined ) keynum = myev.keyCode; 
			
			keychar = String.fromCharCode(keynum);
		
			  switch (keynum) 
			  { 
			      // Return/Enter 
			      case 13:
			      	  //alert("enter");
					  this.EnterItem(); 
			          break;	 
			      // Escape 
			      case 27:
			      	  hidediv( this.divid );
			      	  //hideallmenus();
			          break; 
			      // Up arrow 
			      case 38:
			      	  //alert("up");
			      	  //hideallmenus();
			      	  showdiv( this.divid );
			      	  this.SetPreviousRow();
			      	  //alert(CountryManager.highlightedRow);
			          break;	 
			      // Down arrow 
			      case 40:
			      	  //alert("down");
			      	  //hideallmenus();
			      	  showdiv( this.divid );
			      	  this.SetNextRow();
			      	  //alert(CountryManager.highlightedRow);
			          break;
			 
			      // left & right arrow keys. Absorb them. 
			      case 37: 
			      case 39:
			      case 9: //tab
			          break; 
			 
			      default: 
			      	setTimeout( this.divid+'_manager.SearchContent()', mytime );	 
		          	break; 
			  }
		
		}
		
		this.SearchContent = function() {
			
			var txtobj = document.getElementById( this.textid );
			if (!txtobj) {
				alert( this.textid );
			}
			if ( this.oldquery != txtobj.value) {
			
				DynamicRequest( this.divid, '../../inc/core/ContentRequest.php','text='+txtobj.value+'&tipoid='+this.tipoid+'&divid='+this.divid, this.divid+'_manager.ContentUpdate()' );
			
				this.oldquery = txtobj.value;
			}

		}
		
		this.ContentUpdate = function() {
			var dividset = document.getElementById( this.divid + '_idset' );
			var divtextset = document.getElementById( this.divid + '_textset');
			
			this.SetRows( dividset.value, divtextset.value );
			
			//hideallmenus();
			if ( this.rowsids.length > 0 ) {
				showdiv( this.divid );
			}
		}
		
		this.ContentClick = function( idcontent, textcontent ) {
			
				var DIVID = this.divid + idcontent ;
				
				var dobj = document.getElementById( DIVID );
				
				dobj.className = "content_click";
				//dobj.className = "";

				var textid = document.getElementById( this.textid );
				textid.value = textcontent;				
				
				var fieldid = document.getElementById( this.fieldid );
				fieldid.value = idcontent;
			
				var fieldtext = document.getElementById( this.fieldtext );
				fieldtext.value = textcontent;
			
				hidediv( this.divid );
				//hideallmenus();
		}
		
		this.ContentOver = function( idcontent ) {

			var DIVID = this.divid + idcontent ;
			
			var dobj = document.getElementById( DIVID );
			
			dobj.className = "content_over";
		
		
		}
		
		this.ContentOut = function( idcontent ) {
		
			var DIVID = this.divid + idcontent ;
			
			var dobj = document.getElementById( DIVID );
			
			dobj.className = "content_out";		
		
		}
}




//funcion para implementar el editor de html
function textareaEdit(n,MLcodigo) {

	textareasEdit[ textareasEditNumber ] = new Array();	
	if (MLcodigo=='') {
		//el original
		textareasEdit[ textareasEditNumber ][0] = n;
		//alert(" edit number : "+textareasEditNumber+" id : " +n );		
	} else {
		//el multi-idioma
		textareasEdit[ textareasEditNumber ][0] = n + '_' + MLcodigo;		
		//alert( "id base : " + n + " cod lang : " + MLcodigo + " edit number : "+textareasEditNumber+" id :" + textareasEdit[ textareasEditNumber ][0]);
	}
	textareasEdit[ textareasEditNumber ][1] = n;
	textareasEdit[ textareasEditNumber ][2] = MLcodigo;		
	textareasEditNumber++;
		
	//alert( textareasEdit[textareasEditNumber-1][0] );
	//generate_wysiwyg( textareasEdit[textareasEditNumber-1][0] );
	if (CKEDITOR) {
		//alert( textareasEdit[textareasEditNumber-1][0] );
		CKEDITOR.replace( textareasEdit[textareasEditNumber-1][0] );		
	} else {
		var oFCKeditor = new FCKeditor(textareasEdit[textareasEditNumber-1][0],500,250,'Basic');
		oFCKeditor.BasePath = "../../inc/js/fckeditor/";
		oFCKeditor.ReplaceTextarea();		
	}
	
	//document.getElementById("wysiwyg"+textareasEdit[textareasEditNumber-1][0]).contentWindow.document.body.style.setProperty("font-family","Verdana","");
	//document.getElementById("wysiwyg"+textareasEdit[textareasEditNumber-1][0]).contentWindow.document.body.style.setProperty("font-size","10px","");	
	
}

function IdiomasValidation( ffid ) {

	var formidioma;
	var finput;
	
	formidioma = document.getElementById( ffid );
	
	if (formidioma) {
		finput = formidioma._e_IDIOMAS;
		finput.value = '';
		coma = '';
		if (finput) {
			if ( formidioma._idioma_english_.checked ) {
				finput.value+= coma + "__ENGLISH__";
				coma = ', ';
			}
			if ( formidioma._idioma_portuguese_.checked ) {
				finput.value+= coma + "__PORTUGUESE__";
				coma = ', ';
			}	
			if ( formidioma._idioma_spanish_.checked ) {
				finput.value+= coma + "__SPANISH__";
				coma = ', ';
			}
			if ( formidioma._idioma_italian_.checked ) {
				finput.value+= coma + "__ITALIAN__";
				coma = ', ';
			}					
			if ( formidioma._idioma_french_.checked ) {
				finput.value+= coma + "__FRENCH__";
				coma = ', ';
			}					
			if ( formidioma._idioma_chinese_.checked ) {
				finput.value+= coma + "__CHINESE__";
				coma = ', ';
			}					
			if ( formidioma._idioma_german_.checked ) {
				finput.value+= coma + "__GERMAN__";
				coma = ', ';
			}					
			if ( formidioma._idioma_japanese_.checked ) {
				finput.value+= coma + "__JAPANESE__";
				coma = ', ';
			}
			//alert(finput.value);					
		}		
	
	} else alert(ffid + "not found");
}

function preloadImages() {
}

function showimg(id,ima) {
	document.getElementById(id).src = ima;
}

function showcolor(id,col) {
	document.getElementById(id).color = col;
}


	var navcon,idc;

	function newsletter() {
		
	}
	
	function changebgcolor(id,color) {
		document.getElementById(id).bgColor = color;
	}

	function changeclass(id,cl) {
		document.getElementById(id).getAttributeNode("class").value = cl;
	}
	
	function changeclassName(id,cl) {
		did = document.getElementById(id);
		did.className = cl;
	}	
	
	function toggleclassName(id,cl,cl2) {
		did = document.getElementById(id);
		if (did.className == cl ) {
			did.className = cl2;
		} else {
			did.className = cl;
		}
	}	
	
	function navegadorcontenido( field , filter ) {				
		navcon = window.open( '../../inc/include/navegadorcontenido.php?_field_='+field+filter,'navegador','width=640, height=480,dependent=yes');		
	}

	function navegarseccion(idseccion) {
		document.formnavegadortree._f_ID_SECCION.value = idseccion;
		document.formnavegadortree._consulta_.value = 'si';
		document.formnavegadortree._borrar_.value = 'no';
		document.formnavegadortree._modificar_.value = 'no';
		document.formnavegadortree._nuevo_.value = 'no';	
		document.formnavegadortree.action = '../../principal/admin/navegadorleave.php';		
		document.formnavegadortree.submit();		
	}
	
	function selectreference( idstr ) {		
		
		var el = document.getElementById(idstr);
		var elsel = document.getElementById(idstr+'_SEL');
		var elid = document.getElementById(idstr+'_ID');

		elid.value = elsel.options[elsel.selectedIndex].value;					
		el.value="{*"+elid.value+"*}";
		
	}

	
	//from the navigation frsme, sets the idc (content id)
	function seleccionarcontenido(idcontenido,field) {
	    document.idc = idcontenido;		
		eval('window.parent.opener.document.' + field+'.value = document.idc;');		
		window.parent.close();
	}
	
	//los combos q se filtran en la consulta 
	function filtrarcombos() {
		//alert(document.consultar._consulta_.value);
		document.consultar._consulta_.value = 'si';
		document.consultar.submit();
	}

	//los combos q se filtran en la edicion de un contenido
	function filtrarcombose() {
		document.confirmar.action = 'modificar.php';
		document.confirmar._filtrando_.value = 'si';
		document.confirmar.submit();
	}	 
	
	function consultar() {
		alert('old function');
		document.consultar.action = 'consulta.php';		
		document.consultar.target = '_self';
		document.consultar.submit();
	}	
	
	
	function consultar( idseccion, idtiposeccion ) {
		//alert('new function');
		if (idseccion>0) {
			document.consultar._f_ID_SECCION.value = idseccion;
			document.consultar._f_ID_TIPOSECCION.value = idtiposeccion;
			document.consultar._consulta_.value = 'si';
			if (document.consultar._borrar_!=undefined) document.consultar._borrar_.value = 'no';
			if (document.consultar._modificar_!=undefined) document.consultar._modificar_.value = 'no';
			if (document.consultar._nuevo_!=undefined) document.consultar._nuevo_.value = 'no';
			document.consultar._intervalo_.value = 1;
			document.consultar._nresultados_.value = "";			
			//alert('idseccion: '+idseccion);
		}
		document.consultar.action = 'consulta.php';		
		document.consultar.target = '_self';
		document.consultar.submit();
	}
	
	function consultarintervalo( intervalo ) {
		
		document.consultar._intervalo_.value = intervalo;
		var S = document.consultar.selectnxintervalo;
		if (S.selectedIndex>=0) {
			document.consultar._nxintervalo_.value = S.options[S.selectedIndex].value;	
		}
		
		document.consultar._consulta_.value = 'si';
		document.consultar._borrar_.value = 'no';
		document.consultar._modificar_.value = 'no';
		document.consultar._nuevo_.value = 'no';			
		document.consultar.action = 'consulta.php';		
		document.consultar.target = '_self';
		document.consultar.submit();
	
	}
	
	function consultarusuarios() {
		document.consultar.action = 'usuarios.php';
		document.consultar.submit();
	}
	
	function usuariosintervalo( intervalo ) {
		
		document.consultar._intervalo_.value = intervalo;
		var S = document.consultar.selectnxintervalo;
		if (S.selectedIndex>=0) {
			document.consultar._nxintervalo_.value = S.options[S.selectedIndex].value;	
		}					
		document.consultar.action = 'usuarios.php';		
		document.consultar.target = '_self';
		document.consultar.submit();
	
	}	
	
	function consultartipocontenido(idtipocontenido) {		
		if (idtipocontenido>0) {
			//document.consultar._f_ID_SECCION.value = "";
			document.consultar._f_ID_TIPOCONTENIDO.value = idtipocontenido;
			document.consultar._consulta_.value = 'si';
			document.consultar._borrar_.value = 'no';
			document.consultar._modificar_.value = 'no';
			document.consultar._nuevo_.value = 'no';			
			//alert('idtipocontenido: '+idtipocontenido);
		}
		document.consultar.action = 'consulta.php';		
		document.consultar.target = '_self';
		document.consultar.submit();	
	}
	
	function nuevo() {
		if (document.consultar._f_ID_TIPOCONTENIDO.type == 'text') {
			if (document.consultar._f_ID_TIPOCONTENIDO.value=="") {
				alert(mustselectatype);
				return;
			}
		} else if (document.consultar._f_ID_TIPOCONTENIDO.type == 'select-one' || document.consultar._f_ID_TIPOCONTENIDO.type == 'select-multiple') {
			if ( document.consultar._f_ID_TIPOCONTENIDO.options[document.consultar._f_ID_TIPOCONTENIDO.selectedIndex].value == "" ) {
				alert(mustselectatype);		
				return;
			}
		} 
		
		document.consultar._primario_ID.value = 0;
		document.consultar._borrar_.value = 'no';
		document.consultar._modificar_.value = 'no';
		document.consultar._nuevo_.value = 'si';		
		document.consultar.action = 'modificar.php';
		document.consultar.target = '_self';
		document.consultar.submit();		
	}

	//esta funcion duplica el contenido ID...
	function nuevo(id) {		
		if (document.consultar._f_ID_TIPOCONTENIDO.type == 'text') {
			if (document.consultar._f_ID_TIPOCONTENIDO.value=="") {
				alert(mustselectatype);
				return;
			}
		} else if (document.consultar._f_ID_TIPOCONTENIDO.type == 'select-one' || document.consultar._f_ID_TIPOCONTENIDO.type == 'select-multiple') {
			if ( document.consultar._f_ID_TIPOCONTENIDO.options[document.consultar._f_ID_TIPOCONTENIDO.selectedIndex].value == "" ) {
				alert(mustselectatype);		
				return;
			}
		}
		
		document.consultar._primario_ID.value = id;
		document.consultar._borrar_.value = 'no';
		document.consultar._modificar_.value = 'no';
		document.consultar._nuevo_.value = 'si';		
		document.consultar.action = 'modificar.php';
		document.consultar.target = '_self';
		document.consultar.submit();	
	}	
	
	function modificar(id) {		
		//document.consultar._random_.value = rand();
		document.consultar._primario_ID.value = id;
		document.consultar._borrar_.value = 'no';
		document.consultar._modificar_.value = 'si';
		document.consultar._nuevo_.value = 'no';	
		document.consultar.action = 'modificar.php';			
		document.consultar.target = '_self';
		document.consultar.submit();
	}

	function borrar(id) {
		//document.consultar._random_.value = rand();
		document.consultar._primario_ID.value = id;
		document.consultar._borrar_.value = 'si';
		document.consultar._modificar_.value = 'no';
		document.consultar._nuevo_.value = 'no';	
		document.consultar.action = 'modificar.php';					
		document.consultar.target = '_self';
		document.consultar.submit();
	}

	function ordenarcontenido( iddest, idsource, before ) {
		document.consultar._primario_ID.value = idsource;
		document.consultar._ordenar_.value = 'dest:'+iddest+",source:"+idsource+",before:"+before;
		//alert(document.consultar._ordenar_.value);
		document.consultar._borrar_.value = 'no';
		document.consultar._modificar_.value = 'no';
		document.consultar._nuevo_.value = 'no';		
		document.consultar.action = 'confirmar.php';
		document.consultar.target = '_self';
		document.consultar.submit();		
	}

	function upcontenido(id) {
		document.consultar._primario_ID.value = id;
		document.consultar._ordenar_.value = 'up';
		document.consultar._borrar_.value = 'no';
		document.consultar._modificar_.value = 'no';
		document.consultar._nuevo_.value = 'no';		
		document.consultar.action = 'confirmar.php';
		document.consultar.target = '_self';
		document.consultar.submit();		
	}

	function downcontenido(id) {
		document.consultar._primario_ID.value = id;
		document.consultar._ordenar_.value = 'down';
		document.consultar._borrar_.value = 'no';
		document.consultar._modificar_.value = 'no';
		document.consultar._nuevo_.value = 'no';		
		document.consultar.action = 'confirmar.php';
		document.consultar.target = '_self';
		document.consultar.submit();		
	}	

	function upsubcontenido( id ) {
		var formsub;
		eval( "formsub = document.formsubcontent_"+id+";" );
		formsub._ordenar_.value = 'up';
		formsub._accion_.value = 'ordenar';		
		formsub.submit();		
	}

	function downsubcontenido( id ) {
		var formsub;
		eval( "formsub = document.formsubcontent_"+id+";" );
		formsub._ordenar_.value = 'down';
		formsub._accion_.value = 'ordenar';		
		formsub.submit();	
	}

	function nuevousuario() {		
		document.consultar._primario_ID.value = 0;
		document.consultar._borrar_.value = 'no';
		document.consultar._modificar_.value = 'no';
		document.consultar._nuevo_.value = 'si';	
		document.consultar.action = 'modificarusuario.php';			
		document.consultar.target = '_self';
		document.consultar.submit();
	}	
	
	function modificarusuario(id) {		
		document.consultar._primario_ID.value = id;
		document.consultar._borrar_.value = 'no';
		document.consultar._modificar_.value = 'si';
		document.consultar._nuevo_.value = 'no';	
		document.consultar.action = 'modificarusuario.php';			
		document.consultar.target = '_self';
		document.consultar.submit();
	}
	
	function borrarusuario(id) {
		document.consultar._primario_ID.value = id;
		document.consultar._borrar_.value = 'si';
		document.consultar._modificar_.value = 'no';
		document.consultar._nuevo_.value = 'no';	
		document.consultar.action = 'modificarusuario.php';					
		document.consultar.target = '_self';
		document.consultar.submit();
	}	
	
	function nuevaseccion() {
		document.formarbolseccion._primario_ID.value = 0;
		document.formarbolseccion._borrar_.value = 'no';
		document.formarbolseccion._modificar_.value = 'no';
		document.formarbolseccion._nuevo_.value = 'si';		
		document.formarbolseccion.action = 'modificarseccion.php';
		document.formarbolseccion.target = '_self';
		document.formarbolseccion.submit();		
	}
	
	function nuevaseccionhija( idseccionpadre ) {
		nuevaseccionhija ( idseccionpadre, '' );
	}
	
	function nuevaseccionhija( idseccionpadre, idtiposeccion ) {
		document.formarbolseccion._e_ID_SECCION .value = idseccionpadre;
		if (idtiposeccion!='') {
			document.formarbolseccion._e_ID_TIPOSECCION.value = idtiposeccion;
		}
		document.formarbolseccion._primario_ID.value = 0;
		document.formarbolseccion._borrar_.value = 'no';
		document.formarbolseccion._modificar_.value = 'no';
		document.formarbolseccion._nuevo_.value = 'si';		
		document.formarbolseccion.action = 'modificarseccion.php';
		document.formarbolseccion.target = '_self';
		document.formarbolseccion.submit();
		
	}	
	
	function modificarseccion(id) {
		document.formarbolseccion._primario_ID.value = id;
		document.formarbolseccion._borrar_.value = 'no';
		document.formarbolseccion._modificar_.value = 'si';
		document.formarbolseccion._nuevo_.value = 'no';	
		document.formarbolseccion.action = 'modificarseccion.php';			
		document.formarbolseccion.target = '_self';
		document.formarbolseccion.submit();
	}
	
	function borrarseccion(id) {
		document.formarbolseccion._primario_ID.value = id;
		document.formarbolseccion._borrar_.value = 'si';
		document.formarbolseccion._modificar_.value = 'no';
		document.formarbolseccion._nuevo_.value = 'no';	
		document.formarbolseccion.action = 'modificarseccion.php';					
		document.formarbolseccion.target = '_self';
		document.formarbolseccion.submit();
	}		
	
	function upseccion(id) {
		document.formarbolseccion._primario_ID.value = id;
		document.formarbolseccion._ordenar_.value = 'up';
		document.formarbolseccion._borrar_.value = 'no';
		document.formarbolseccion._modificar_.value = 'no';
		document.formarbolseccion._nuevo_.value = 'no';		
		document.formarbolseccion.action = 'modificarseccion.php';
		document.formarbolseccion.target = '_self';
		document.formarbolseccion.submit();		
	}

	function downseccion(id) {
		document.formarbolseccion._primario_ID.value = id;
		document.formarbolseccion._ordenar_.value = 'down';
		document.formarbolseccion._borrar_.value = 'no';
		document.formarbolseccion._modificar_.value = 'no';
		document.formarbolseccion._nuevo_.value = 'no';		
		document.formarbolseccion.action = 'modificarseccion.php';
		document.formarbolseccion.target = '_self';
		document.formarbolseccion.submit();		
	}	
	
	function confirmarseccion() {
		confirmar();
	}		
	
	function cancelarseccion() {
		//window.history.go(-1);
		cancelar();
	}	
	
	function consultarseccion( idseccion, idtiposeccion )  {
		document.formarbolseccion._f_ID_SECCION.value = idseccion;		
		document.formarbolseccion._f_ID_TIPOSECCION.value = idtiposeccion;
		document.formarbolseccion._consulta_.value = 'si';
		document.formarbolseccion._borrar_.value = 'no';
		document.formarbolseccion._modificar_.value = 'no';
		document.formarbolseccion._nuevo_.value = 'no';	
		document.formarbolseccion.action = 'consulta.php';					
		document.formarbolseccion.target = 'centro';
		document.formarbolseccion.submit();		
	}	
	
	function borrarseleccion(tabla) {
		var elementos,cb,i,str;
		var seleccionaborrar,coma;
		var hits;
		
		hits = 0;

		if (confirm(multipledeletionwarning)) {
			document.consultar._accion_.value = 'borrarseleccion';
			//aqui creo la seleccion
			coma = "";
			seleccionaborrar = "";
			elementos = document.consultar.elements;
			for(i=0;i<elementos.length;i++) {
				cb = elementos[i];
						
				if (cb.type == 'checkbox') {
					str = new String(cb.name);
					strspl = str.split('_');
					if (strspl[0]=='cb') {					
						if (document.consultar.elements[i].checked) {
							seleccionaborrar+= coma+strspl[1];
							coma = ",";
							hits++;
						}
					}
				}
			}
			if (hits==0) {
				alert(norecordselected);
				return;
			}
			document.consultar._seleccion_.value = seleccionaborrar;			
			document.consultar._borrar_.value = 'si';
			if (tabla=='usuarios') {
				document.consultar.action = 'confirmarusuario.php';
			} else document.consultar.action = 'confirmar.php';
			document.consultar.target = '_self';
			document.consultar._modificar_.value = 'no';
			document.consultar._nuevo_.value = 'no';	
			document.consultar.submit();
		}
	}
	
	function mailsseleccion() {
		var elementos,cb,i,str;
		var seleccionalistar,coma;
		var hits;
		
		hits = 0;

		document.consultar._accion_.value = 'listmails';
		//aqui creo la seleccion
		coma = "";
		seleccionalistar = "";
		elementos = document.consultar.elements;
		for(i=0;i<elementos.length;i++) {
			cb = elementos[i];
					
			if (cb.type == 'checkbox') {
				str = new String(cb.name);
				strspl = str.split('_');
				if (strspl[0]=='cb') {					
					if (document.consultar.elements[i].checked) {
						seleccionalistar+= coma+strspl[1];
						coma = ",";
						hits++;
					}
				}
			}
		}
		
		if (hits==0) {
			alert(norecordselected);
			return;
		}		
		document.consultar._seleccion_.value = seleccionalistar;						
		document.consultar._borrar_.value = 'no';
		document.consultar.action = 'usuarios.php';
		document.consultar.target = '_self';
		document.consultar._modificar_.value = 'no';
		document.consultar._nuevo_.value = 'no';	
		document.consultar.submit();		
	}
	
	function habilitarseleccion() {
		var elementos,cb,i,str;
		var seleccionalistar,coma;
		var hits;
		
		hits = 0;
		
		if (confirm(multipleactivationwarning)) {
		
			document.consultar._accion_.value = 'habilitar';
			//aqui creo la seleccion
			coma = "";
			seleccionalistar = "";
			elementos = document.consultar.elements;
			for(i=0;i<elementos.length;i++) {
				cb = elementos[i];
						
				if (cb.type == 'checkbox') {
					str = new String(cb.name);
					strspl = str.split('_');
					if (strspl[0]=='cb') {					
						if (document.consultar.elements[i].checked) {
							seleccionalistar+= coma+strspl[1];
							coma = ",";
							hits++;
						}
					}
				}
			}
			
			if (hits==0) {
				alert(norecordselected);
				return;
			}		
			document.consultar._seleccion_.value = seleccionalistar;						
			document.consultar._borrar_.value = 'no';
			document.consultar.action = 'confirmar.php';
			document.consultar.target = '_self';
			document.consultar._modificar_.value = 'si';
			document.consultar._nuevo_.value = 'no';	
			document.consultar.submit();		
		}
	}

	function deshabilitarseleccion() {
		var elementos,cb,i,str;
		var seleccionalistar,coma;
		var hits;
		
		hits = 0;
		
		if (confirm(multipledeactivationwarning)) {
		
			document.consultar._accion_.value = 'deshabilitar';
			//aqui creo la seleccion
			coma = "";
			seleccionalistar = "";
			elementos = document.consultar.elements;
			for(i=0;i<elementos.length;i++) {
				cb = elementos[i];
						
				if (cb.type == 'checkbox') {
					str = new String(cb.name);
					strspl = str.split('_');
					if (strspl[0]=='cb') {					
						if (document.consultar.elements[i].checked) {
							seleccionalistar+= coma+strspl[1];
							coma = ",";
							hits++;
						}
					}
				}
			}
			
			if (hits==0) {
				alert(norecordselected);
				return;
			}		
			document.consultar._seleccion_.value = seleccionalistar;						
			document.consultar._borrar_.value = 'no';
			document.consultar.action = 'confirmar.php';
			document.consultar.target = '_self';
			document.consultar._modificar_.value = 'si';
			document.consultar._nuevo_.value = 'no';	
			document.consultar.submit();		
		}
	}
	

	function seleccionartodo( idsel, elementos ) {
		var cbsel;		
		var cb,i,str;
		
		if (elementos==undefined) elementos = document.consultar.elements;
				
		if (idsel!='') {
			cbsel = document.getElementById(idsel);
			if (cbsel.type=='checkbox') {
				//alert(cbsel.checked);
				if (cbsel.checked==false) {
					deseleccionartodo(elementos);
					return;				
				} else {
					//skip
				}
			}
		}		
		

		for(i=0;i<elementos.length;i++) {
			cb = elementos[i];
					
			if (cb.type == 'checkbox') {
				str = new String(cb.name);
				strspl = str.split('_');
				if (strspl[0]=='cb') {					
					elementos[i].checked = true;
				}
			}
		}
	}

	function deseleccionartodo(elementos) {

		var cb,i,str;
		
		if (elementos==undefined) elementos = document.consultar.elements;
		
		for(i=0;i<elementos.length;i++) {
			cb = elementos[i];
					
			if (cb.type == 'checkbox') {
				str = new String(cb.name);
				strspl = str.split('_');
				if (strspl[0]=='cb') {					
					elementos[i].checked = false;					
				}
			}
		}
	}
	

	function confirmar() {
		var i;
		var taframe;
		var editingarea;
		var iframes;
		
		if ( textareasEditNumber > 0 ) {
			for(i=0; i< textareasEditNumber; i++) {		
				
				if (CKEDITOR) {
					taframe = document.getElementById( "cke_contents_" + textareasEdit[i][0] );
					iframes = taframe.getElementsByTagName("iframe");
					if (iframes.length>0) {
				   		document.getElementById(textareasEdit[i][0]).value = iframes[0].contentWindow.document.body.innerHTML;
					}					
				} else {				
					taframe = document.getElementById(textareasEdit[i][0]+'___Frame');
					editingarea = taframe.contentWindow.document.getElementById('xEditingArea');
					iframes = editingarea.getElementsByTagName("iframe");
					
					if (iframes.length>0) {
				   		document.getElementById(textareasEdit[i][0]).value = iframes[0].contentWindow.document.body.innerHTML;				
					}
				}

				if ( textareasEdit[i][2] != "" ) {
					completeML( textareasEdit[i][1], textareasEdit[i][2] );
				}				
			}
		}
		document.confirmar.submit();
	}
	
	function ordenar() {
		document.consultar.target = '_self';
		document.consultar.submit();
	}
	
	function cerrar() {
		window.close();
	}
	
	function volver() {
		//window.history.go(-1);	
		consultar();			
	}

	function cancelar() {
		//window.history.go(-1);
		document.confirmar._borrar_.value = 'no';		
		document.confirmar._modificar_.value = 'no';
		document.confirmar._nuevo_.value = 'no';
		document.confirmar._cancelar_.value = 'si';
		document.confirmar.submit();		
	}
	
	function filtroempieza(campo) {
		var che;
		eval("che = document.consultar._empieza_"+campo+".checked");
		if (che==true) {
			eval("document.consultar._tf_"+campo+".value = \'_empieza_"+campo+"\';");
			eval("document.consultar._contiene_"+campo+".checked = false;");
		} else {
			eval("document.consultar._tf_"+campo+".value = \'\';");
		}
		eval("document.consultar._f_"+campo+".focus();");					
	}
	
	function filtrocontiene(campo) {
		var che;
		eval("che = document.consultar._contiene_"+campo+".checked");
		if (che==true) {
			eval("document.consultar._tf_"+campo+".value = \'_contiene_"+campo+"\';");
			eval("document.consultar._empieza_"+campo+".checked = false");
		} else {
			eval("document.consultar._tf_"+campo+".value = \'\';");
		}
		eval("document.consultar._f_"+campo+".focus();");					
	}
	
	function filtroinferior(campo) {
		var che;
		eval("che = document.consultar._inferior_"+campo+".checked");
		if (che==true) {
			eval("document.consultar._tf_"+campo+".value = \'_inferior_"+campo+"\';");
			eval("document.consultar._superior_"+campo+".checked = false;");
		} else {
			eval("document.consultar._tf_"+campo+".value = \'\';");
		}
		eval("document.consultar._f_"+campo+".focus();");					
	}
	
	function filtrosuperior(campo) {
		var che;
		eval("che = document.consultar._superior_"+campo+".checked");
		if (che==true) {
			eval("document.consultar._tf_"+campo+".value = \'_superior_"+campo+"\';");
			eval("document.consultar._inferior_"+campo+".checked = false");
		} else {
			eval("document.consultar._tf_"+campo+".value = \'\';");
		}
		eval("document.consultar._f_"+campo+".focus();");					
	}	


	function modificartipocontenido() {				
		document.confirmar.action = 'modificar.php';			
		document.confirmar.submit();
	}		
	
	function Anteriores() {
	
		var nmaxitems,offset;
		var offset2;	
		
		nmaxitems =	Number(document.consultar._items_MAXITEMS.value);
		offset =	Number(document.consultar._items_STARTITEM.value);
		totali = Number(document.consultar._items_TOTALITEMS.value);

		offset2 = offset - nmaxitems;
		
		document.consultar._items_STARTITEM.value = offset2;
				
		consultar();		
	}
		
	function Siguientes() {
	
		var nmaxitems,offset;
		var offset2,totali;	
		
		nmaxitems =	Number(document.consultar._items_MAXITEMS.value);
		offset =	Number(document.consultar._items_STARTITEM.value);
		totali = Number(document.consultar._items_TOTALITEMS.value);

		offset2 = offset + nmaxitems;
		
		document.consultar._items_STARTITEM.value = offset2;
				
		consultar();		
	}

	function	setForm( formname ) {
		form_name = formname;
	}

	//uso: completeML ( '_e_ML_TITULO', 'EN' )
	function completeML( nombrecampo, lang ) {
		
		var elMLhidden;
		var elMLeditable;
		
		if (form_name=='') {
			elMLhidden = document.getElementById( nombrecampo );
			elMLeditable = document.getElementById( nombrecampo+"_"+lang );			
		} else {
			eval(' elMLhidden = document.'+form_name+'.'+nombrecampo+';');
			eval(' elMLeditable = document.'+form_name+'.'+nombrecampo+"_"+lang+';');
		}
	
		
		//alert (elMLhidden.value)
		//alert (elMLeditable.value)
		MLstr = new String( elMLhidden.value )
		//parseo
		idx0 = MLstr.indexOf('<'+lang+'>')
		//alert ('idx0:'+idx0)
		if (idx0==-1) {
			elMLhidden.value = '<'+lang+'>'+elMLeditable.value + '</'+lang+'>' + MLstr
		} else {
			idx1 = MLstr.indexOf('</'+lang+'>')
			//alert ('idx1:'+idx1)
			if (idx1>-1 && idx1>idx0) {
				regexp = new RegExp()
				//MLstr.replace( regexp, '<'+lang+'>'+elMLeditable.value + '</'+lang+'>' )
				elMLhidden.value = MLstr.substr(0,idx0)+'<'+lang+'>'+elMLeditable.value + '</'+lang+'>'+MLstr.substr(idx1+5,MLstr.length)				
			} else {
				//alert('Error on '+nombrecampo);
				elMLhidden.value = MLstr.substr(idx0+4,MLstr.length);
			}		
		}
		
		//alert(elMLhidden.value);
	}
	
	function togglelang( ID ) {						
		var el = document.getElementById(ID);
		if (el.style.display == 'block') {
			el.style.display = 'none'
		} else {
			el.style.display = 'block'
		}
	}

	function hideDivAll( ID ) {												
		var el;
		var i;		
		var nlist = document.getElementsByTagName('DIV');//o   document.confirmar
		
		for( i=0; i<nlist.length; i++) {
			el = nlist.item(i);		
			strel = new String(el.id);	
			//recorrer todas los elementos cuyo ID se escriba asi: "[ID]*"
			iof = strel.indexOf(ID);
			if ( iof >= 0 ) {			
				el.style.display = 'none';
			}
		}	
			
	}
	function toggleDivAll( ID ) {												
		var el;
		var i;		
		var nlist = document.getElementsByTagName('DIV');//o   document.confirmar

		for( i=0; i<nlist.length; i++) {
			el = nlist.item(i);		
			strel = new String(el.id);	
			//recorrer todas los elementos cuyo ID se escriba asi: "[ID]*"
			iof = strel.indexOf(ID);
			if ( iof >= 0 ) {			
				
				if (el.className=="debugdetails") {
					el.className = 'debugdetails hidden';
				} else if (el.className=="debugdetails hidden") {
					el.className = 'debugdetails';
				}

				if (el.className=="errordetails") {
					el.className = 'errordetails hidden';
				} else if (el.className=="errordetails hidden") {
					el.className = 'errordetails';
				}

				
				if (el.style.display == 'block' || el.style.display == 'inline' || el.style.display != 'none') {
					el.style.display = 'none';
				} else {
					el.style.display = 'block';
				}
			}
		}		
			
	}

	function posdiv( ID, x, y) {
		var el = document.getElementById(ID);
		//alert(ID);
		el.style.left = x;
		el.style.top = y;		
	}

	function showdiv( ID ) {						
		var el = document.getElementById(ID);
		if (el) {
			el.style.display = 'block';
		} else alert( "div undefined: "+ID );
	}
		
	function hidediv( ID ) {						
		var el = document.getElementById(ID);
		if (el) {
			el.style.display = 'none';
		} else alert( "div undefined: "+ID );
	}
	
	function togglediv( ID ) {						
		var el = document.getElementById(ID);
		if (el.style.display == 'block') {
			el.style.display = 'none'
		} else {
			el.style.display = 'block'
		}
	}		
	
	function hideall( ID ) {						
		var el;		
		var nlist = document.getElementsByTagName('DIV');//o   document.confirmar
		
		for( i=0; i<nlist.length; i++) {
			el = nlist.item(i);		
			el.style.display = 'none';
		}
	}	
	
	function showlang( ID ) {						
		var el = document.getElementById(ID);
		el.style.display = 'block';
	}
	
	function hidelang( ID ) {						
		var el = document.getElementById(ID);
		el.style.display = 'none';
	}
	
//PRODUCTS

	function showproduct( cid, sid , page) {
		
		document.formcart._accion_.value = "showproduct";	
		document.formcart.action = page;
		document.formcart._cID_.value = cid;	
		document.formcart._sID_.value = sid;		
		document.formcart.submit();
	
	}
	
	function addproduct( idcontenido , cantidad, opt) {
		
		var pr = document.formcart._products_;
		var npr = document.getElementById('nproducts');
		var prnew = idcontenido + "__" + opt + ":" + cantidad;		
		var	nm = new Number(npr.firstChild.nodeValue);
		var ncan = new Number(cantidad);
		nm+=ncan;
		npr.firstChild.nodeValue = "" + nm;
		
		if (pr.value!="") {
			pr.value = pr.value +  "|" + prnew;		
		} else {
			pr.value = prnew;		
		}
		//var r = rand();
		window.open('../../inc/core/addproduct.php?_products_='+pr.value,'','width=500,height=500');
		
		alert(addtocartconfirmation);
		
	}
	
	function changeproduct(idcontenido, idcant, page) {
		
		var pr = document.formcart._products_;
		var cant = document.getElementById(idcant);
		var ncant = cant.options[cant.selectedIndex].value;
		//alert('id:'+idcontenido+' cant:'+ncant);
		
		document.formcart._accion_.value = "changeproduct";
		document.formcart.action = page;	
		document.formcart._idstr_.value = idcontenido;					
		document.formcart._cant_.value = ncant;
		document.formcart.submit();

	}
	
	function removeproduct( idcontenido , page ) {		
		document.formcart._accion_.value = "removeproduct";
		document.formcart.action = page;	
		document.formcart._idstr_.value = idcontenido;					
		document.formcart.submit();	
	}
	
	function showcart(page) {		
		if (document.formcart) {
			if (document.formcart._products_.value!='') {
				document.formcart._accion_.value = "showcart";
				document.formcart.action = page;	
				document.formcart.submit();		
			} else {
				alert("Votre panier ne contient pas d'articles");			
			}
		} else {
			var npr = document.getElementById('nproducts');
			var	nm = new Number(npr.firstChild.nodeValue);
			if (nm>=1) {
				window.location.href = page+'?_accion_=showcart';
			} else {
				alert("Votre panier ne contient pas d'articles");
			}			
		}
	}
	
	function showcategory(idseccion,page) {
		document.formcart._accion_.value = "showcategory";
		document.formcart.action = page;
		document.formcart._sID_.value = idseccion;	
		document.formcart.submit();		
	}

	function changeshipping(page,shipping) {
		document.formcart._accion_.value = "";
		document.formcart.action = page;	
		document.formcart._departement_.value = shipping;
		document.formcart.submit();				
	}
	
	function pay(page) {
		if (cartvalidation()) {
			document.formcart.action = page;
			document.formcart.submit();
		}
	}
	
	function paytradition(page) {		
		if (document.formcart.conditions.checked==true) {		
			document.formcart.action = page;
			document.formcart._accion_.value = "tradition";
			document.formcart.submit();
		} else {
			alert(musacceptconditions);
		}		
	}
	
	function paysecure(page) {		
		if (document.formcart.conditions.checked==true) {
			document.formcart.action = page;
			document.formcart._accion_.value = "secure";
			document.formcart.submit();
		} else {
			alert(musacceptconditions);
		}
	}
	
	function erase(id) {
		if ( confirm(deletionwarning) ) {			
		
			var gelem = document.getElementById(id);
			if (gelem!=null) {
				gelem.value = "";
				var glnk = document.getElementById(id+"_LNK");
				if (glnk!=null) {
					glnk.firstChild.nodeValue = "";				
					glnk.href = "";
				}
				var gimgthm = document.getElementById(id+"_IMGTHM");
				if (gimgthm!=null) {
					gimgthm.src = "";
				}
				var gimg = document.getElementById(id+"_IMG");
				if (gimg!=null) {
					gimg.href = "";
				}			
			}
		}
	}	
	
	//GALLERY ADMIN
	
	function galleryupdate(idselect ) {
		var gelem = document.getElementById(idselect+'_gal');
		var nidx = gelem.options.length;			
		var ginput = document.getElementById(idselect);
		ginput.value = "";
		for( i=0; i<nidx; i++ ) {
			ginput.value+= gelem.options[i].value+'::'+gelem.options[i].text+'\n';
		}
		//for debugging
		//alert(ginput.value);
	}


	function galleryup( idselect ) {
		//move up the option selected
		var gelem = document.getElementById(idselect+'_gal');
		var sidx= gelem.selectedIndex;
		var nidx = gelem.options.length;
		if ((sidx>0)) {
			var auxvalue = gelem.options[sidx-1].value;
			var auxtext = gelem.options[sidx-1].text;
			gelem.options[sidx-1].value = gelem.options[sidx].value;
			gelem.options[sidx-1].text = gelem.options[sidx].text;
			gelem.options[sidx].value = auxvalue;
			gelem.options[sidx].text = auxtext;
			gelem.selectedIndex = sidx-1;
		}
		galleryupdate(idselect);
	}
	
	function gallerydown( idselect ) {
		//move down the option selected
		var gelem = document.getElementById(idselect+'_gal');
		var sidx= gelem.selectedIndex;
		var nidx = gelem.options.length;
		if ((sidx<(nidx-1))) {
			var auxvalue = gelem.options[sidx+1].value;
			var auxtext = gelem.options[sidx+1].text;
			gelem.options[sidx+1].value = gelem.options[sidx].value;
			gelem.options[sidx+1].text = gelem.options[sidx].text;
			gelem.options[sidx].value = auxvalue;
			gelem.options[sidx].text = auxtext;
			gelem.selectedIndex = sidx+1;
		}
		galleryupdate(idselect);				
	}

	function gallerydelete( idselect ) {
		//remove the option selected, with alert message
		var gelem = document.getElementById(idselect+'_gal');
		var sidx= gelem.selectedIndex;
		var nidx = gelem.options.length;
		if (sidx>=0) {
			gelem.options[sidx] = null;
		}
		galleryupdate(idselect);		
	}	
/*
	function galleryedit(idselect) {
		//remove the option selected, with alert message
		alert('admin edit function');
		var gelem = document.getElementById(idselect+'_gal');
		var gtext = document.getElementById(idselect+'_gal'+'_TEDIT');
		
		var sidx= gelem.selectedIndex;
		var nidx = gelem.options.length;		
		if (sidx>=0) {
			gelem.options[sidx].text = gtext.value;
		}
		galleryupdate(idselect);		
	}*/

	function gallerylink(idselect) {
		//remove the option selected, with alert message
		var gelem = document.getElementById(idselect+'_gal');
		var gtext = document.getElementById(idselect+'_gal'+'_TLINK');
		
		var sidx= gelem.selectedIndex;
		var nidx = gelem.options.length;		
		if (sidx>=0) {
			gelem.options[sidx].value = gtext.value;
		}
		galleryupdate(idselect);		
	}	
	
	function galleryshow( idselect ) {
		//show the option selected		
		var gelem = document.getElementById(idselect+'_gal');
		var sidx= gelem.selectedIndex;
		
		var gtext = document.getElementById(idselect+'_gal'+'_TEDIT');
		if (sidx>=0) {
			//alert("gtext:"+gtext);
			//alert("gelem:"+gelem.options[sidx].text);
			gtext.value = gelem.options[sidx].text;						
		}
		
		var glink = document.getElementById(idselect+'_gal'+'_TLINK');
		if (sidx>=0) {
			//alert("gtext:"+gtext);
			//alert("gelem:"+gelem.options[sidx].text);
			glink.value = gelem.options[sidx].value;						
		}		
		
		var gimg = document.getElementById(idselect+'_gal'+'_preview_thm');
		if (sidx>=0 && gimg!=null && gimg!='undefined') {
			//alert("gtext:"+gimg);
			strthm = new String(gelem.options[sidx].value);
			rExp = /imagen\//gi;	
			str = strthm.replace(rExp, 'imagen/thm/' );			
			gimg.src = str;
		}				
	}
	
	function gallerydownload( idselect )  {
		//show the option selected		
		var gelem = document.getElementById(idselect+'_gal');
		var sidx= gelem.selectedIndex;		
		var gdown = document.getElementById(idselect+'_gal'+'_download');		
		if (sidx>=0) {
			gdown.href = gelem.options[sidx].value;			
		}			
	}	

	function galleryconfirm( iddiv, iddetalle, idtipodetalle ) {
		/*
		hidediv( iddiv + '_DATA');
		showdiv( iddiv + '_ADD');
		
		var fileelem = document.getElementById(iddiv+'_FILE');
		var comelem = document.getElementById(iddiv+'_COMMENT');
		var file = fileelem.value;
		var comment = comelem.value;		
		*/
		//window.open('../../inc/core/galleryedit.php?_id_detalle_='+iddetalle+'&_id_tipodetalle_'+idtipodetalle+'&_file_='+file+'&_comment_='+comment,'width=500,height=500');
	}

	var gedit = "null";

	function galleryedit( iddiv, iddetalle, idtipodetalle, accion, pos ) {
/*
		if (accion=="add" || accion=="edit") {
			showdiv( iddiv + '_DATA');
			hidediv( iddiv + '_ADD');		
		} else {
			hidediv( iddiv + '_DATA');
			showdiv( iddiv + '_ADD');
		}*/
		//alert('user edit function');
		
		if (accion=="add") {
			eval( 'window.parent.galeria_'+idtipodetalle+'.showdiv(\''+iddiv + '_DATA'+'\');');		
			eval( 'window.parent.galeria_'+idtipodetalle+'.galeriaedit_'+idtipodetalle+'.location=\'../../inc/core/galleryedit.php?__lang__='+lalang+'&_id_detalle_='+iddetalle+'&_id_tipodetalle_='+idtipodetalle+'&_accion_=add&_pos_='+pos+'\';' );
		} else if (accion=="edit") {
			eval( 'window.parent.galeria_'+idtipodetalle+'.showdiv(\''+iddiv + '_DATA'+'\');');
			eval( 'window.parent.galeria_'+idtipodetalle+'.galeriaedit_'+idtipodetalle+'.location=\'../../inc/core/galleryedit.php?__lang__='+lalang+'&_id_detalle_='+iddetalle+'&_id_tipodetalle_='+idtipodetalle+'&_accion_=edit&_pos_='+pos+'\';' );
		} else if (accion=="editup") {
			eval( 'window.galeriaedit_'+idtipodetalle+'.location=\'../../inc/core/galleryedit.php?__lang__='+lalang+'&_id_detalle_='+iddetalle+'&_id_tipodetalle_='+idtipodetalle+'&_accion_=editup&_pos_='+pos+'\';' );
		} else if (accion=="editdown") {
			eval( 'window.galeriaedit_'+idtipodetalle+'.location=\'../../inc/core/galleryedit.php?__lang__='+lalang+'&_id_detalle_='+iddetalle+'&_id_tipodetalle_='+idtipodetalle+'&_accion_=editdown&_pos_='+pos+'\';' );
		}		
	
	}
	
	function galleryerase( iddetalle, idtipodetalle, pos ) {
		if (confirm(deletionwarning)) {
			eval( 'window.galeriaedit_'+idtipodetalle+'.location=\'../../inc/core/galleryedit.php?__lang__='+lalang+'&_id_detalle_='+iddetalle+'&_id_tipodetalle_='+idtipodetalle+'&_accion_=delete&_pos_='+pos+'\';' );
		}
	}

	function activatepassword(idpass) {
		//activer les champs pass et pass_confirm...
	}
	
	 function forcenumeric (str, dec, bNeg)
	{ // auto-correct input - force numeric data based on params.
		 var cDec = '.'; // decimal point symbol
		 var bDec = false; var val = "";
		 var strf = ""; var neg = ""; var i = 0;
		
		 if (str == "") return parseFloat ("0").toFixed (dec);
		
		 if (bNeg && str.charAt (i) == '-') { neg = '-'; i++; }
		
		 for (i; i < str.length; i++)
		 {
		  val = str.charAt (i);
		  if (val == cDec)
		  {
		   if (!bDec) { strf += val; bDec = true; }
		  }
		  else if (val >= '0' && val <= '9')
		   strf += val;
		 }
		 strf = (strf == "" ? 0 : neg + strf);
		 return parseFloat (strf).toFixed (dec);
	} 
	
	function AllPagesOff( idpagebook ) {
	
		var pbook = document.getElementById(idpagebook);
		
		//document.getElementsByTagName('');
		divs = document.getElementsByTagName('div');
		
		p = 0;
		t = 0;

		var pages = new Array();
		var tabs = new Array();
				
		for(i=0;i<divs.length;i++){
			if(		divs[i].className == 'page' ||
					divs[i].className == 'page page-disabled' ||
					divs[i].className == 'page page-off' ||
					divs[i].className == 'page page-on') {
				pages[p] = divs[i];
				p++
			} else
			if(		divs[i].className == 'tab' ||
					divs[i].className == 'tab tab-disabled' ||
					divs[i].className == 'tab tab-off' ||
					divs[i].className == 'tab tab-on'){
				tabs[t] = divs[i];
				t++
			}
		}		
		
		for( i=0; i<pages.length; i++) {
			pages[i].className = 'page page-off';
	 	}	
	 	
		for( i=0; i<tabs.length; i++) {
			tabs[i].className = 'tab tab-off';
	 	}	 		
	
	}
	
	function PageOn( idpagebook, idpage ) {

		AllPagesOff( idpagebook );
		
		var pbook = document.getElementById( idpagebook );
		
		divs = document.getElementsByTagName('div');
 
		for(i=0;i<divs.length;i++){
			if(		divs[i].className == 'page' ||
					divs[i].className == 'page page-disabled' ||
					divs[i].className == 'page page-off' ||
					divs[i].className == 'page page-on') {
				if (divs[i].id==idpage) {
					divs[i].className = 'page page-on';
				}
			} else
			if(		divs[i].className == 'tab' ||
					divs[i].className == 'tab tab-disabled' ||
					divs[i].className == 'tab tab-off' ||
					divs[i].className == 'tab tab-on'){
				if (divs[i].id==idpage) {
					divs[i].className = 'tab tab-on';
				}
			}
		}
		

	}
	
	var nrecords;
	
	nrecords = -1;
	
	function XMLAgregar( label_table, nrecs, max_records ) {
		
		//busca los ids de labe_table + '(n)_' > hasta maxrecords
		
		if ( nrecords == (max_records-1)
			|| (nrecords==-1 && nrecs==max_records) ) {
     		alert("Sï¿œlo puedes registrar "+max_records+' redes sociales.');
     		return;
		}		
		
		if (nrecords==-1) nrecords = nrecs;
		else nrecords++;
				
		//aquï¿œ deberia buscar el primero que encuentra
		xmltable = document.getElementById(label_table);
		
		xmlrecords = xmltable.getElementsByTagName("tr");
		for( r=0;r<xmlrecords.length;r++) {
			if (xmlrecords[r].className=="xmlrecord_agregar") {
				xmlrecord_new = xmlrecords[r];
				break;
			}
		}
		if (!xmlrecord_new)
			xmlrecord_new = document.getElementById( label_table + "_"+nrecords+"_" );
		
		if (xmlrecord_new) {
			xmlrecord_new.className = "xmlrecord";
		} else {
			alert(label_table + "_"+nrecords+"_ no existe");
		}
		
		
		
		/*
		xmltable = document.getElementById( label_table );
		xmlrecord = document.getElementById( label_table + "_X_" );
		
		if (xmlrecord) {			
			
			xmltable_html = new String(xmltable.innerHTML);
			xmlrecord_html = new String(xmlrecord.innerHTML); 
		
			xmlrecord_html_new = xmlrecord_html.replace( /_X_/g , "_"+nrecords+"_" )
			xmltable_html_new = xmltable_html + xmlrecord_html_new;
			
			xmltable.innerHTML = xmltable_html_new;
			alert(xmltable_html_new);			
			
		} else {
			alert( label_table + "X_ no existe");
		}
		*/
		//y agregar un label_table + '(n+1)_'
		
		
	}	
	
	function XMLEliminar( label_table, label_id, nrecs ) {
		
		if (nrecords==-1) nrecords = nrecs;
	
		//alert(nrecords);
		
		if (nrecords>0) {
			
			xmlrecord = document.getElementById(label_id);
			
			
			if (xmlrecord) {
				//xmlrecord.innerHTML = "";
				xmlrecord.className = "xmlrecord_agregar";
				nrecords--;
								
				values = xmlrecord.getElementsByTagName('input');
				
				for( v=0; v<values.length; v++) {
					//alert(values[v].value);
					values[v].value = "";
					
				}
				
			}
		} else {
			alert("La tabla esta vacï¿œa.");
		}
		
		
		
	}
	
