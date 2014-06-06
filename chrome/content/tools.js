var _startX = 0; // mouse starting positions 
var _startY = 0; 
var _offsetX = 0; // current element offset
var _offsetXright;
var _offsetY = 0; 
var _dragElement; // needs to be passed from OnMouseDown to OnMouseMove 
var _oldZIndex = 0; // we temporarily increase the z-index during drag 


var unit_typess = {
	"D": "days",
	"S": "weeks",
	"M": "months",
	"A": "years"
};


function OsIs( lin_win_osx ) {
	log("OsIs:"+navigator.platform);
	return ( navigator.platform.toLowerCase().indexOf(lin_win_osx.toLowerCase())>=0 );
}

function sumaTiempo( date, units, unit_type  ) {

	//var thisDate = Date.parse(date);
	log("sumaTiempo() > date: "+date +" units:"+ units+" unit_type:" + unit_type+" unit_typess:"+JSON.stringify(unit_typess,null,"\t") );
	var unit_type_en = unit_typess[ unit_type.substr(0,1) ];
	log("sumaTiempo() > unit_type_en:"+unit_type_en);
	var dobj = {};
	dobj[unit_type_en] = units;
	log("sumaTiempo() > dobj "+JSON.stringify( dobj, null, "\t" ) );
	var duration = moment.duration(dobj);
	log("sumaTiempo() > duration "+JSON.stringify( duration, null, "\t" ) );
	var fromDate = moment( date );
	log("sumaTiempo() > fromDate "+JSON.stringify( fromDate, null, "\t" ) );
	var toDate = fromDate.add( duration );
	log("sumaTiempo() > toDate "+JSON.stringify( toDate, null, "\t" ) );
	return toDate.toDate();
}

function dateToString( date ) {

	var md = moment(date);
	
	return md.format("YYYY-MM-DD");

}


function performClick(node) {
   var evt = document.createEvent("MouseEvents");
   evt.initEvent("click", true, false);
   node.dispatchEvent(evt);
}

function activateClass( element, class_name, trigger_time, trigger_callback  ) {

	if (!element) return error("activateClass() > Element not defined: " + element + " class_name:" + class_name );

	var actual_class = element.getAttribute("class");
	
	if (actual_class) {
			var is_on = (actual_class.indexOf(class_name)>=0);
			if (!is_on) {
				element.setAttribute( "class", actual_class+" "+class_name );
			}
	} else element.setAttribute( "class", class_name );

	if (trigger_callback) setTimeout( trigger_callback, trigger_time );
	
}

function deactivateClass( element, class_name, trigger_time, trigger_callback  ) {
	if (!element) console.error("element not defined: " + element + " class_name:" + class_name );
	var actual_class = element.getAttribute("class");
	if (actual_class) {
			var position = actual_class.indexOf(class_name);
			var is_on = (position>=0);
			if (is_on) {
				
				if (position==0)/*is first*/
						actual_class = actual_class.replace( new RegExp(class_name+" ","g"), "" );
				else 
				if( (position+class_name.length)==actual_class.length) /*is last*/
						actual_class = actual_class.replace( new RegExp(" "+class_name,"g"), "" );

				actual_class = actual_class.replace( new RegExp(" "+class_name+" ","g"), " " );				
				element.setAttribute( "class", actual_class );
			}
	} else element.setAttribute( "class", class_name );
	
	if (trigger_callback) setTimeout( trigger_callback, trigger_time );
	
}

/*

function setCharPref(name, value) {
   try {
      netscape.security.PrivilegeManager
         .enablePrivilege("UniversalPreferencesWrite");
      navigator.preference(name, value);
      log("Preference has been set.\n\nName: "+name+"\nValue: "+value);
   } catch(ex) { error("Preference cannot be set.\n\n"+ex); }
}
*/


function InitDragDrop() { 
document.onmousedown = OnMouseDown; 
document.onmouseup = OnMouseUp; 
}

/*InitDragDrop(); */

function OnMouseDown(e)
{
    // IE is retarded and doesn't pass the event object
    if (e == null) 
        e = window.event; 
    
    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;
    if (!target.className) return false;
    log("OnMouseDown() > "+( target.className.indexOf('drag')>=0 
        ? 'draggable element clicked' 
        : 'NON-draggable element clicked'));

    // for IE, left click == 1
    // for Firefox, left click == 0
    if ((e.button == 1 && window.event != null || 
        e.button == 0) && 
        target.className.indexOf('drag')>=0)
    {
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;
        
        // grab the clicked element's position

		var styled = window.getComputedStyle(target);
		_offsetX = ExtractNumber(styled.left);
        _offsetY = ExtractNumber(styled.top);
		//log("OnMouseDown() > _offsetX:" + _offsetX + " _offsetY:" + _offsetY  );
        
        // bring the clicked element to the front while it is being dragged
        _oldZIndex = target.style.zIndex;
        target.style.zIndex = 10000;
        
        // we need to access the element in OnMouseMove
        _dragElement = target;

        // tell our code to start moving the element with the mouse
        document.onmousemove = OnMouseMove;
        
        // cancel out any text selections
        document.getElementById("container").focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };
        
        // prevent text selection (except IE)
        return false;
    }
}

function OnMouseMove(e)
{
    if (e == null) 
        var e = window.event; 

    // this is the actual "drag code"
	_dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
	_dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
		
    _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
    
     /*log("OnMouseDown() > " + '(' + _dragElement.style.left + ', ' + 
        _dragElement.style.top + ')' );   */
}

function OnMouseUp(e)
{
    if (_dragElement != null)
    {
        _dragElement.style.zIndex = _oldZIndex;

        // we're done with these events until the next OnMouseDown
        document.onmousemove = null;
        document.onselectstart = null;
        _dragElement.ondragstart = null;

        // this is how we know we're not dragging      
        _dragElement = null;
        
        /*log("OnMouseDown() > " + 'mouse up');*/
    }
}

function ExtractNumber(value)
{
    var n = parseInt(value);
	return isNaN(n) ? value : n;
    //return n == null || isNaN(n) ? 0 : n;
}

function showaction() {
	//show some message to wait
}

function FocusOut() {
	document.getElementById('OutFocus').focus();
}

function trim(str) {
	str = String(str).trim();
	//str = jQuery.trim(str);
	return str;
}

function strip(html)
{
 	return html.replace(/<(?:.|\n)*?>/gm, '');
}

function normalizePath( path_str ) {

    switch( getOS()) {
        case "UNIX":
        case "Linux":
        case "MacOS":
            path_str = path_str.replace( new RegExp( "\\\\", "gi" ), "/");
            break;
        case "Windows":
            path_str = path_str.replace( new RegExp( "/", "gi" ), "\\");
            break;
    }

    return path_str;

}

function getOS() {
    var OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
    return OSName;
}

function evaluateXPath(aNode, aExpr) {

	if (aNode==undefined || aNode.nodeName==undefined) {
		error("evaluateXPath() > aNode is null, aExpr: ["+aExpr+"]");
		return [];
	}

  var xpe = new XPathEvaluator();
  var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?
    aNode.documentElement : aNode.ownerDocument.documentElement);
  
  function resolver( prefix ) {
	var ns = {
		'xul' : 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'
	  };
	  log("resolver> prefix:"+prefix+ "  nsprefix:"+ns[prefix]);
	  return ns[prefix] || null;
  }
  
  var result = xpe.evaluate(aExpr, aNode, nsResolver, XPathResult.ANY_TYPE, null);
  var found = [];
  var res;
    
  while (res = result.iterateNext())
    found.push(res);
  
  if (found.length==0) {
	//log("evaluateXPath() > no results! aExpr:" +  aExpr); 
  }
  
  return found;
}

function remove_html_namespace( strhtml ) {
    if (strhtml)
        return strhtml.replace( new RegExp( "html\\:", "gi"), "" );   
    return strhtml;
}

function add_html_namespace( strhtml ) {

    var tags = [ "ul", "img", "li", "a", "br", 
                 "span", "div", 
                "table", "tr", "td", "th","thead","tfoot","tbody",
                "input","textarea","select","option","button",
                "font","ol",
                "label",
                "video","audio","frame","iframe" ];

    var result = strhtml;
/*return result;*/
    for( tag in tags ) {
        tagstr = tags[tag];
        var msearch = new RegExp( '<'+tagstr+'', 'gi')
        result = result.replace( msearch, '<html:'+ tagstr );

        msearch = new RegExp( '\\/'+tagstr+'>', 'gi')
        result = result.replace( msearch, '/html:'+ tagstr + '>' );
    }

    return result;
}

function getStructure( sobject ) {

	var str_structure = "";
	var sep  ="";
	for( var k in sobject) {
		var val = sobject[k];
		str_structure+= sep+""+k+": "+val;
		sep = ",\n";
	}
	return str_structure;
}

function getAttributes( node ) {
			/*ATTRIBUTES*/
			var attr_value = undefined;
			var attrs = {};
			var str_attr = "";
			var sep = "";
			if ( node.hasAttributes() ) {  
				var its; 
				var a = 0;								
				for (a=0; a < node.attributes.length; a++) {  
					its = node.attributes.item(a);  
                    var nodename = its.nodeName.toLowerCase();
					attrs[nodename] = buildValue( its.nodeValue ); 
					str_attr+= sep+nodename+":"+attrs[nodename];
					sep = ",\n";
				}  
			}

			return str_attr;
}

function GetAttribute( node, attr_name ) {
			
			if (!node || !node.nodeName) {
				error("GetAttribute() node is not a valid NODE ["+(typeof node)+"] nodeName ["+node.nodeName+"], looking for attr ["+attr_name+"]");
				return null;
			}
			//log("GetAttribute() node ["+node.nodeName+"], looking for attr ["+attr_name+"]");
			/*ATTRIBUTES*/
			var attr_value = undefined;
			var attrs = {};
			if ( node.hasAttributes() ) {  
				var its; 
				var a = 0;								
				for (a=0; a < node.attributes.length; a++) {  
					its = node.attributes.item(a);  
                    var nodename = its.nodeName.toLowerCase();
					attrs[nodename] = buildValue( its.value ); 
					if (nodename == attr_name ) {
						attr_value = attrs[nodename];										
					}
				}  
			}
			//log("GetAttribute() founded attr ["+attr_name+"] value ["+attr_value+"]");
			return attr_value;
}


//==NOT USED===//


//generic function to process the retrieved XML
function processXML(xpath, id) {

  log("Processing XML data from server", false, 1);

  logDOM(request.responseXML, false, 5);
  var xulItems = xsl.transformToDocument(request.responseXML);
  logDOM(xulItems, false, 5);
  var node = getElement(id);
  logDOM(document, false, 5);
  renderXUL(xulItems, xpath, node);
  logDOM(document, false, 5);
}


//function to convert an XSLT result into XUL items
function renderXUL(dom, xpath, node) {
  log("xpath : " + xpath + ", append to : " + node.nodeName, 5);
  var items = dom.evaluate(xpath,dom,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
  for(var i = 0; i < items.snapshotLength; i++) {
    var item = items.snapshotItem(i);
    var xulitem = createItem(item.nodeName);
    var attlist = "attrs[";
    for(var j = 0; j < item.attributes.length; j++) {
      attlist += (item.attributes[j].name  + "=" + item.attributes[j].value + ",");
      xulitem.setAttribute(item.attributes[j].name, item.attributes[j].value);
    }
    log("Item : " + xulitem.nodeName + ", " + attlist + "]", false, 5);
    node.appendChild(xulitem);
    renderXUL(dom, xpath + "[" + (i+1) + "]/*", xulitem);
  }
}


function process()
{
    var src = readFile("D:\\createXML2.xsl");
    var parsed = (new DOMParser()).parseFromString(src, "text/xml");
    var stylesheet = parsed.documentElement;

    var processor = new XSLTProcessor();
    processor.importStylesheet(stylesheet );

}


var buffers = {};
function rendersvg( svg, idcanvas, width, height) {
		
	width = width || 2000;
	height = height || 1000;
	log("rendersvg() > svg ["+svg+"] idcanvas [" + idcanvas+"] width [" + width + "] height ["+height+"]");
	
	if (svg && svg!="") {
	
		var d = document.getElementById(idcanvas);
		showdiv(idcanvas);
		d.innerHTML = '<html:canvas width="'+width+'" height="'+height+'"> </html:canvas>';
		var c = d.childNodes[0];
	
	/*
	var buffer = document.createElement( "canvas" );
	buffer.width = width;
	buffer.height = height;
	*/
	/*alert( buffer.getContext('2d') );*/
	/*
	*/
	//document.getElementById(idcanvas).appendChild(c);
	/*
	log("rendersvg() > canvas:"+d.outerHTML);
	var svgx = (new XMLSerializer()).serializeToString(svg);
	log ("rendersvg() > svg:"+ svgx );
	
	*/
	/*alert( c.getContext('2d') );*/
	
		var svgx = (new XMLSerializer()).serializeToString(svg);
		var buffer = c;
		
		canvg( buffer, svgx, { log: true, renderCallback: function (dom) {	
			//var svg = (new XMLSerializer()).serializeToString(dom);
			buffers[idcanvas] = buffer.toDataURL("image/png");
			log("rendersvg() > idcanvas ["+idcanvas+"] "+buffers[idcanvas]);
			hidediv(idcanvas);
		}});
	}
}

function renderhtml( html_code, idcanvas ) {
	html_code = remove_html_namespace(html_code);
	var outputPlaneaHtml = normalizePath( fs.getProfileDirectory() + "\\" + "outputPlanea"+idcanvas+".html" );
	var outputPlaneaHtmlUri = "file:///"+(outputPlaneaHtml.replace(/\\/gi, "/" ));
	var outputPlaneaImage = normalizePath( fs.getProfileDirectory() + "\\" + "outputPlanea"+idcanvas+".jpg" );
	
	log( " rendertable > outputPlaneaHtml:" + outputPlaneaHtml+ " outputPlaneaHtmlUrl:" + outputPlaneaHtmlUri );
	fs.writeFile( outputPlaneaHtml, html_code );
	
	fs.callProgram( "\\utils\\win\\wkhtmltoimage.exe", [ outputPlaneaHtmlUri, outputPlaneaImage ] );
	
	
}

function gethtmlimage( idcanvas ) {
	var outputPlaneaImageSrc = normalizePath( fs.getProfileDirectory() + "\\" + "outputPlanea"+idcanvas+".jpg" );
	outputPlaneaImage = "file:///"+outputPlaneaImageSrc.replace(/\\/gi,"/");
	//outputPlaneaImage = "outputPlanea"+idcanvas+".png";
	
	log("gethtmlimage > idcanvas:" + idcanvas+" outputPlaneaImage:"+outputPlaneaImage );
	
	//var dataURL = fs.readAsDataURLSync( outputPlaneaImageSrc );
	
	//log("gethtmlimage > idcanvas:" + idcanvas +" dataURL:"+ dataURL);
	var img = new Image();
	img.src = outputPlaneaImage;
	//var href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
	//var dataurl_64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	var wi = img.width;
	var he = img.height;
	return { 'abssrc': outputPlaneaImageSrc,'src': "outputPlanea"+idcanvas+".jpg", 'width': wi, 'height': he, 'dimensions': wi+"x"+he };
}

function getcanvasimage( idcanvas ) {
	/*
	var d = document.getElementById(idcanvas);
	var c = d.childNodes[0];
	if (c==undefined) return error("getcanvasimage() > ["+idcanvas+"] canvas is not initialized! ");
	var dataURL = c.toDataURL("image/png");
	var styled = window.getComputedStyle( c );
	var wi = parseInt(styled.width);
	var he = parseInt(styled.height);
	log("getcanvasimage() > idcanvas:"+idcanvas + " dataurl:" + dataURL );
	var href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
	log("getcanvasimage() > href: " + href);
	var dataurl_64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	log("getcanvasimage() > dataurl_64: " + dataurl_64);
	var xdataURItoBlob = dataURItoBlob(dataURL);
	log("getcanvasimage() > dataURItoBlob: " + xdataURItoBlob);
	
	//var ouri = fs.openUri(href);
	//if (ouri) fs.writeFile(  normalizePath( home_path + "/imagen.png" ), ouri );
	var dfile = normalizePath( home_path + "/"+idcanvas+".png" );
	log("getcanvasimage() > "+dfile );
	fs.saveCanvas( c, dfile, false );
	*/
	var dataURL = buffers[idcanvas];
	if (dataURL) {
		showdiv(idcanvas);
		var d = document.getElementById(idcanvas);
		var c = d.childNodes[0];
		
		var dataURL = c.toDataURL("image/png");
		var href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
		var dataurl_64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		var styled = window.getComputedStyle( c );
		var wi = parseInt(styled.width);
		var he = parseInt(styled.height);
		hidediv(idcanvas);
	}
	return { 'dataurl': dataURL, 'base64': dataurl_64, 'width': wi, 'height': he, 'dimensions': wi+"x"+he };
}

/**
*	var fd = new FormData(document.forms[0]);
	fd.append("canvasImage", blob);
*/
function dataURItoBlob(dataURI) {
	var binary = atob(dataURI.split(',')[1]);
	var array = [];
	
	for(var i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	log("dataURItoBlob() > array: " + JSON.stringify(array) );
	return new Blob([new Uint8Array(array)], {type: 'image/png'});
}


/*
                    
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<!-- the default namespace for the output of this stylesheet is the XUL namespace -->
<xsl:output method="xml" omit-xml-declaration="yes" indent="yes" />

<!-- XSL to transform RSS feeds into XUL objects -->
<xsl:key name="categories" match="//category" use="." />

<!-- Template to convert configuration file into tree  -->
<xsl:template match="/channels">
 <treechildren>
  <xsl:for-each select="//category[generate-id() = generate-id(key('categories', .)[1])]">
    <xsl:sort select="." />  
    <treeitem container="true" open="true">
      <treerow>
        <treecell label="{.}" />
      </treerow>
      <treechildren>
        <xsl:call-template name="createTreeItemsForCategory">
          <xsl:with-param name="category" select="." />
        </xsl:call-template>
      </treechildren>
    </treeitem>
  </xsl:for-each>
 </treechildren>
</xsl:template>

<xsl:template name="createTreeItemsForCategory">
  <xsl:param name="category" />
  <xsl:for-each select="/channels/channel[category = $category]">
    <treeitem>
      <treerow>
        <treecell label="{name}" value="{url}"/>
      </treerow>
    </treeitem>
  </xsl:for-each>
</xsl:template>

<!-- Template to  convert RSS entries into list items -->
<xsl:template match="/rss/channel">
  <listitems>
  <xsl:for-each select="item">
    <xsl:sort select="category" />
    <xsl:sort select="title" />
    <listitem value="{link}">
      <listcell label="{category}"/>
      <listcell label="{title}"/>
      <listcell label="{pubDate}"/>
    </listitem>
  </xsl:for-each>
  </listitems>
</xsl:template>

</xsl:stylesheet>
*/
