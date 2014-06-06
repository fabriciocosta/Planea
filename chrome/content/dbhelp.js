
// this is simply a shortcut for the eyes and fingers
/*
function $(id)
{
    return document.getElementById(id);
}
*/
/**
*
*
*       Gettting last help from site www.moldeointeractive.com.ar
*
*       http://www.moldeointeractive.com.ar/taxones?_tema_=planea&_modo_=ayuda
*
*/

var DBHelp = {
    verbose: false
};


function showhidehelps( modus ) {

    //
    log( "showhidehelps  > "+modus );

    switch(modus) {

        case "rapida":
            //togglediv('ayudaguia');
            break;
        case "completa_flotante":
            togglediv('ayudaguia-flotante');
            break;
        case "completa_lado":
            togglediv('ayudaguia-lado');
            break;
        case "completa_frente":
            togglediv('ayudaguia-frente');
            break;
    }



}

function htmlize( text ) {

    return text.replace( new RegExp( "\\n","gi") , "<br/>");
}

function toggleHelp( field_path, field_id ) {

	togglediv('ayudaguia-frente');
	OpenHelp(field_path);
/*
	var el = document.getElementById(help_id);
	if (el.style.display!="none") {
		el.style.opacity = "0.0";
		setTimeout( function() { hidediv(help_id); } , 1000 );
	} else {
		showdiv(help_id);
		el.style.opacity = "0.0";
		setTimeout( function() { 
			var el1 = document.getElementById(help_id);
			el1.style.opacity = "0.8";
		} , 100 );
	}
	
	*/
	
}

function ShowHint( idcampo ) {
	//$("#input_"+idcampo).tooltip({ content: "Awesome title!" });
	//$("#ayudarapida_"+idcampo).show().delay(2000).fadeOut()
	log("ShowHint()> idcampo:" + idcampo);
	var help_id = "ayudarapida_"+idcampo;
	var el  = document.getElementById(help_id);
	if ( el && trim(strip(el.innerHTML))!="") {
		showdiv(help_id);
		setTimeout( function() { hidediv(help_id); } , 4000 );
	} else {
		log("sin F1:"+help_id);
	}
	/*
	if ( el && el.style.display=="none") {
		el.style.opacity = "0.0";
		setTimeout( function() { hidediv(help_id); } , 4000 );
	} else if(el) {
		el.style.opacity = "0.0";
		showdiv(help_id);
		el.style.opacity = "1.0";
		setTimeout( function() { hidediv(help_id); } , 4000 );
	} else {
		log("sin F1:"+help_id);
	}
	*/
}

function concatHelp(ayuda, idayuda) {
	var res = htmlize( '<div class="nombreh">' + ayuda["nombre"] 
				+ '\n</div><div class="resumenh">' 
				+ ayuda["resumen"] 
				+ '\n</div><div class="cuerpoh">' 
				+ ayuda["completo"]);			
	
	if (trim(ayuda["ejemplos"])!="") res+= htmlize('<a class="aejemplos" onclick="javascript:togglediv(\''+idayuda+'\');">Ejemplos<br/> </a>'
				+ '<div class="cuerpoh ejemplos" id="'+idayuda+'" style="display: none;">'
				+ ayuda["ejemplos"]
				+ '\n</div>');
	return res+htmlize('\n</div>');
}

/**
*   When focused by cursor on an input field it opens or popups...
*/
function OpenHelp( field_or_section_path, is_a_section ) {

	//log("OpenHelp() > field_or_section_path [" + field_or_section_path + "] is_a_section ["+is_a_section+"]");
	
	var htmlHelpTextContainer = document.getElementById("ayuda_contenedor_frente");
	var htmlHelpContainer = document.getElementById("ayudaguia-frente");
	if (!htmlHelpContainer) error("OpenHelp() > id = ? ayudaguia-frente ["+htmlHelpContainer+"] field_or_section_path ["+field_or_section_path+"]"  );
	
	var section_path = field_or_section_path;
	
	
	if (is_a_section==undefined || is_a_section===false) {
		var dbField = _dbFields[field_or_section_path];
		if (dbField) {
			section_path = dbField["section_path"];
			
			if (section_path==undefined) {
				//must be a record. si it has a parent_path
				var parent_path = dbField["parent_path"];
				//go up through the parents field until found one ....
				return OpenHelp( parent_path, false );
			}
			//}
		} else {
			error("OpenHelp() > nodbField for ["+field_or_section_path+"]");
			return;
		}
	}
	
	var dbForm = _dbForms[section_path];
	var idform;
	var htmlForm;
	if (dbForm) {
		idform = "dbformulario_"+dbForm["formularioN"]+"_";
		htmlForm = document.getElementById( idform );
	} else {
		error("OpenHelp() > no dbForms for section_path ["+section_path+"] from ["+field_or_section_path+"]"  );
		return; 
	}
	
	if (htmlForm) {
		var offsetParentParent = htmlForm.parentNode.parentNode;
		var offsetParent = htmlForm.parentNode;
		var firstPage = getFirstPageNode();
		if (!firstPage) return error("OpenHelp() > no first page!!");
		var rectFP = firstPage.getBoundingClientRect();
		
		var rectPP = offsetParentParent.getBoundingClientRect();
		//var rectFP = rectPP;
		var rectP = offsetParent.getBoundingClientRect();
		var formstyled = window.getComputedStyle(htmlForm);
		var rect = htmlForm.getBoundingClientRect();
		var rects = htmlForm.getClientRects();
		var rectc = rects[0];
		var docmargin_top = parseInt( document.getElementById("dbformularios").style.marginTop ); 
		//log("OpenHelp() > offsetParent:"+offsetParent+" getBoundingClientRect rect.top: " +rect.top + " rect.right:" + rect.right + " rect.bottom:" + rect.bottom+ " rect.left:" + rect.left,'help');
		//log("OpenHelp() > getClientRects rectc.top: " +rectc.top + " rectc.right:" + rectc.right + " rectc.bottom:" + rectc.bottom+ " rectc.left:" + rectc.left,'help');
		log("OpenHelp() > top position is: rect.top: "+ rectc.top+ " idform["+idform+"] formstyled ["+formstyled.top+"]",'help'  );
		log("OpenHelp() > parent top position is: rectP.top: "+ rectP.top,'help'  );
		log("OpenHelp() > parent parent top position is: rectPP.top: "+ rectPP.top,'help'  );
		log("OpenHelp() > firstPage top position is: rectFP.top: "+ rectFP.top,'help'  );
		//if (rectc) htmlHelpContainer.style.top = parseInt(rectc.top-rectP.top + 50  )+"px";
		if (rect)  htmlHelpContainer.style.top = parseInt(rect.top-rectFP.top + 50  )+"px";
	} else  {
		error("OpenHelp() > no dbForms for section_path ["+section_path+"] idform ["+idform+"] htmlForm["+htmlForm+"]"  );
		return;
	}
	//var helpstyled = window.getComputedStyle(htmlHelpContainer);
	//var formstyled = window.getComputedStyle(htmlForm);
	//log("OpenHelp() > top position is: clientY: "+ astyled.top+ " idform["+idform+"] formstyled ["+formstyled.top+"]"  );
	
	if ( is_a_section!=undefined && is_a_section==true 
		&& _ayudas[field_or_section_path] 
		&&  _ayudas[field_or_section_path]["full"] ) {
		
		//log("OpenHelp() > calling for section: ["+field_or_section_path+"] full:"+JSON.stringify(_ayudas[field_or_section_path]["full"]) );
		
		var fullSection = "";
		for( var p in _ayudas[field_or_section_path]["full"] ) {
			//fullSection+= htmlize("p:"+p);
			fullSection+= concatHelp( _ayudas[field_or_section_path]["full"][p], field_or_section_path+p );
		}
		htmlHelpTextContainer.innerHTML = fullSection;
		return;
	}
	
	
/*
	var ayuda_contenedor = document.getElementById("ayuda_contenedor_flotante");
    if (_ayudas[pathcampo]) {
    	ayuda_contenedor.innerHTML = htmlize(_ayudas[pathcampo]["completo"]);
	}
*/
	
    if (_ayudas[field_or_section_path]) {
    	htmlHelpTextContainer.innerHTML = concatHelp(_ayudas[field_or_section_path], field_or_section_path);
	}
/*
	var ayuda_contenedor3 = document.getElementById("ayuda_contenedor_lado");
    if (_ayudas[pathcampo]) {
    	ayuda_contenedor3.innerHTML = htmlize( _ayudas[pathcampo]["completo"] );
	}
*/
}

function associateHelp( herence, it_herence, helps_text, xmlNode, it_seccion ) {

    _ayudas[it_herence] = helps_text;
	
	if ( it_seccion!=it_herence
		&& it_seccion!=""
		&& _ayudas[it_seccion]["full"]
		&& it_herence.indexOf(it_seccion)==0) {
		//log("associateHelp() > it_seccion:["+it_seccion+"] it_herence["+it_herence+"] = helps_text ["+JSON.stringify(helps_text));
		_ayudas[it_seccion]["full"][it_herence] = helps_text;
		
	}
}

/**
* GetHelp
* retreive from the xmlnode tags <resumen> and <completo>
*/
function GetHelp( xmlNode ) {

    var res_helps = { nombre: "", resumen: "" , completo:"", ejemplos: "", node: "", full: "" };

    for( var i=0; i<xmlNode.childNodes.length;i++) {
        var childNode = xmlNode.childNodes[i];
		
        if ( childNode.nodeName=="ayuda") {
            for( var j=0; j<childNode.childNodes.length;j++) {
                var subchild = childNode.childNodes[j];
                if (subchild.nodeName=="nombre") {
                    res_helps["nombre"] = subchild.childNodes[0].nodeValue;
                }				
                if (subchild.nodeName=="resumen") {
                    res_helps["resumen"] = subchild.childNodes[0].nodeValue;
                }
                if (subchild.nodeName=="completo") {
                    res_helps["completo"] = subchild.childNodes[0].nodeValue;
                }
                if (subchild.nodeName=="ejemplos") {
                    res_helps["ejemplos"] = subchild.childNodes[0].nodeValue;
                }
            }
			res_helps["node"] = xmlNode;
			res_helps["full"] = [];
        }

    }
	res_helps["node"] = xmlNode;
	res_helps["full"] = [];
    return res_helps;

}

var it_seccion = "";

function loadHelpIterative( xmlNode, iteration, herence, enditeration ) {

    var it_herence = herence;

    if(DBHelp.verbose) log("loadHelpIterative: "+ xmlNode.nodeName + " herence: "+ herence + " iteration: "+iteration+"/" + enditeration )

    if ( iteration == 0) {
        if(DBHelp.verbose) log("loadHelpIterative: INIT ITERATION: " + iteration + " herence:" + herence);
    }

    if (iteration >= enditeration) {
        //break the iterator
        return;
    } else iteration++;
 

    var id_identifier = 0;
    var nombre = "";

    if(DBHelp.verbose) log("loadHelpIterative: childNode: "+ xmlNode.nodeName);

    if ( xmlNode.nodeName == "#text" ) {
        nombre = "#text";
        return;
    } else {
        //NOMBRE DEL NODO : siguiente <label> o el texto.
    	if ( xmlNode.nodeName == "categoria" || xmlNode.nodeName == "seccion" || xmlNode.nodeName == "campo"  ) {
            var labels = xmlNode.getElementsByTagName("label");
    		(labels.length>0) ? nombre = trim(labels[0].childNodes[0].nodeValue) : nombre = trim(xmlNode.childNodes[0].nodeValue);
        } else {
            nombre = xmlNode.nodeName; 
            if (nombre!="arbol") return; //we dont care....return            
        }       
    }

    if (herence!="") it_herence = herence + ":" + nombre;
    else it_herence = nombre;
	
	var helps_str = "";
	/*categorias*/
	if ( xmlNode.nodeName == "categoria" || xmlNode.nodeName == "seccion" ) {		
		helps_str = GetHelp( xmlNode );
		associateHelp( herence, it_herence, helps_str, xmlNode, it_seccion );
		
		it_seccion = it_herence;
    /*campo*/		
    } else if ( xmlNode.nodeName == "campo" ) {
        helps_str = GetHelp( xmlNode );
        associateHelp( herence, it_herence, helps_str, xmlNode, it_seccion );
    }

    for( var i=0; i<xmlNode.childNodes.length; i++) {
        var childNode = xmlNode.childNodes[i];
        loadHelpIterative( childNode, iteration, it_herence, enditeration );
    }

}

