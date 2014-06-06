//Components
var jsconsole = CC['@mozilla.org/consoleservice;1'].getService(CI.nsIConsoleService);


function buildValue(sValue) {  
    if (/^\s*$/.test(sValue)) { return(null); }  
    if (/^(true|false)$/i.test(sValue)) { return(sValue.toLowerCase() === "true"); }  
    if (isFinite(sValue)) { return(parseFloat(sValue)); }  
    if (isFinite(Date.parse(sValue))) { return(new Date(sValue)); }  
    return(sValue);  
}     

var startdragHeader = false;
var startX = -1;
var startY = -1;

function startWindowDrag( header, event ) {
	startdragHeader = true;
	startX = event.screenX;
	startY = event.screenY;
	header.setCapture(false);
	log("header start drag:"+startdragHeader+" event:" + JSON.stringify(event));
}

function dragWindowMove( header, event ) {
	if (startdragHeader) {
		//log("header move > X:"+event.screenX + " Y:" + event.screenY);
		var mx = event.screenX - startX;
		var my = event.screenY - startY;
		
		window.moveBy( mx, my );
		startX = event.screenX - mx;
		startY = event.screenY - my;
	}
	
}

function stopWindowDrag( header, event ) {
	startdragHeader = false;
	document.releaseCapture();
	//log("header stop drag:"+startdragHeader);
}

function changeZoom(e) {
	var tofloat = (parseInt(e.value)/100);
	var wclient = window.outerWidth;
	//1400 pixel => 1.0
	//1000 pixel => 1.0 * 1000/1400
	var ideal = wclient / 1500;
	planea.autozooming = false;
	//log("zooming to:" + e.value+" % > [" + tofloat+"] in wclient ["+wclient+"] ideal is ["+ideal+"]");
	setLayoutCssPref( "devPixelsPerPx", ""+tofloat+"" );
}

function autoZoom() {

	var wclient = window.outerWidth;
	//var wcli = window.style.width;
	var pixelv = parseFloat( getLayoutCssPref("devPixelsPerPx") );
	//log("autoZoom pixelv ["+pixelv+"] wclient["+wclient+"] wva["+parseInt(wclient*pixelv)+"]");
	var wva = parseInt(wclient*pixelv);
	var ideal = wva / 1500;
	//log("autoZoom ideal:" + ideal+"");
	setLayoutCssPref( "devPixelsPerPx", ""+ideal+"" );
}

function getLayoutCssPref( name ) {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService);
	var layout_css_branch = prefs.getBranch("layout.css.");
	var valueget = layout_css_branch.getCharPref( name );
	return valueget;
}

function setLayoutCssPref( name, value) {

	var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService);
	var layout_css_branch = prefs.getBranch("layout.css.");
	var valueget = layout_css_branch.getCharPref( name );
	//log("setPref() > layout_css_branch ["+layout_css_branch+"] name ["+name+"] has value ["+valueget+"] , try to set to value ["+value+"]");
	layout_css_branch.setCharPref( name, value );
	
	//log("setPref() > layout_css_branch ["+layout_css_branch+"] name ["+name+"] has value ["+valueget+"] , try to set to value ["+value+"]");
	/*getComplexValue(name,
      Components.interfaces.nsISupportsString).data;
	*/
	
}
// ------------------------------------------------------------------
// use helper functions to hook up the planea object so "this"
// works in the explorer object
// ------------------------------------------------------------------

function planea_startup() {
  planea.startup();
}

function planea_shutdown() {
  planea.shutdown();
}
	
function message(str) {
    console.logStringMessage(str);
}

function winMinimize( target, event ) {
	window.minimize	();
}

function winMaximize( target, event ) {
	log("winMaximize() > window.windowState:"+window.windowState);
	if (window.windowState!=STATE_MAXIMIZED) window.maximize();
	else window.restore();
}

function winClose( target, event ) {
	 if (confirm("¿Estás seguro?")) {
			window.close();
    		return true;
    } else return false;
}


function log( aMessage, module) {

	var show_modules = [
		"",
		"",
		""
	];
	
	if (aMessage=="" || aMessage==undefined || aMessage.length==0) return;
	
	
	var start_message = [
/*
		"getFieldTemplateFormula",
		"updateFormulas",
		"processRecordFormula",
		"updateSums",
		"processFieldFormula",
		"getFieldTemplateMultiple",
		"getFieldTemplateReference",
		"getFieldTemplateReferenceOptions",
		"SaveField",
		"updateReferences",
		"refreshRecords",
		"AddRecord",
		"PopupRelational",
		//"StopEditField",
		"EditField",
		//"GetValuesInput",
		//"saveDB",*/
		//"check",
		//"navigation",
		//"help",
		//"showMarkedSection",
		"getFieldTemplateParrafo"
		//"getFieldTemplateMultiple",
		//"getObjectRecordEditView",
		

		//"SelectField",
		
	];

   if (module!=undefined) aMessage = ""+module+": " + aMessage;
   return jsconsole.logStringMessage( aMessage );
   //return;
   for(var ii in start_message) {
		var sm = start_message[ii];
		if ( aMessage.indexOf( sm ) >= 0 )
			jsconsole.logStringMessage( aMessage );

	}
   //if ( start_message.indexOf( aMessage.substr(0,10) ) >= 0 )
		
}

function error( aError ) {
    Components.utils.reportError( aError );
}

function warning( warningmsg ) {
	jsconsole.logStringMessage( warningmsg );
}

var console = {
	log: function( a, b) {
		if (a && b) return log(a+">>"+b);
		return log(a);
	},
	error: function(a,b) {
		if (a && b) return error(a+">>"+b);
		return error(a);
	},
	trace: function(a,b) {
		if (a && b) return log("trace >> "+a+">>"+b);
		return log("trace >> "+a);
	}
};

window.console = console;
console.log("window:"+typeof window);

// ------------------------------------------------------------------
// attach to window events so planea object can startup / shutdown
// ------------------------------------------------------------------

window.addEventListener("load", planea_startup, false);
window.addEventListener("unload", planea_shutdown, false);

// ------------------------------------------------------------------
// planea object
// ------------------------------------------------------------------

var planea = {
  initialized : false,
  autozooming: true,
  
  _handleWindowClose : function(event) {
    // handler for clicking on the 'x' to close the window
    return this.shutdownQuery();
  },
  _handleWindowResize : function(event) {
    // handler for clicking on the 'x' to close the window
    //setTimeout( autoZoom, 1000 );
	if (this.autozooming) {
		setTimeout( autoZoom, 1500);
		this.autozooming = false;
		setTimeout( function() { planea.autozooming=true; }, 3000);
	}
  },

  _initSidebar : function(sidebarID) {
    if (sidebarID) {
      var sidebar = document.getElementById(sidebarID);
      var sidebarDeck = document.getElementById("sidebar_deck");
      sidebarDeck.selectedPanel = sidebar;
      var sidebarTitle = document.getElementById("sidebar_title");
      sidebarTitle.value = sidebar.getAttribute("label");
    }
  },

  toggleSidebar : function(sidebarID, forceOpen) {
    var sidebarBox = document.getElementById("sidebar_box");
    var sidebarSplitter = document.getElementById("sidebar_split");
    if (forceOpen || sidebarBox.hidden) {
      sidebarBox.hidden = false;
      sidebarSplitter.hidden = false;

      this._initSidebar(sidebarID);      
    }
    else {
      sidebarBox.hidden = true;
      sidebarSplitter.hidden = true;
    }
  },


  startup : function() {
    if (this.initialized)
      return;
    this.initialized = true;

    var self = this;

    window.addEventListener("close", function(event) { self._handleWindowClose(event); }, false);
	window.addEventListener("resize", function(event) { self._handleWindowResize(event); }, false);

    // initialize the sidebar
	/*
    document.getElementById("sidebar_close").addEventListener("command", function(event) { self.toggleSidebar(null, null); }, false);
    this._initSidebar("sidebar_page1");
*/

    FileController.init(this);
    window.controllers.appendController(FileController);


    ToolsController.init(this);
    window.controllers.appendController(ToolsController);


    HelpController.init(this);
    window.controllers.appendController(HelpController);

	//setting layout to exact pixel view... this could be changed by the user...
	setLayoutCssPref("devPixelsPerPx","1.0");
	
	initializeMenu();
	setTimeout( function() { 
		window.maximize(); 
		newProject();  
		document.body = document.getElementById('container');
		//gSpellCheckEngine.dictionary = 'es-AR';
		//gSpellCheckEngine.language = 'es-AR';
		//log("gSpellCheckEngine:"+JSON.stringify(gSpellCheckEngine));
    }, 500 );
  },

  shutdownQuery : function() {
    // do any shutdown checks
    // return false to stop the shutdown
	
    if (confirm("¿Estás seguro?")) {
    		return true;
    } else return false;
	
  },
    
  shutdown : function() {

  }
  ,

    quit: function (aForceQuit)
    {
      var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].
        getService(Components.interfaces.nsIAppStartup);

      // eAttemptQuit will try to close each XUL window, but the XUL window can cancel the quit
      // process if there is unsaved data. eForceQuit will quit no matter what.
      var quitSeverity = aForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
                                      Components.interfaces.nsIAppStartup.eAttemptQuit;
      appStartup.quit(quitSeverity);
    }
  
};


  
function openOptions() {

	var res = window.openDialog(
		  "chrome://planea/content/options.xul",
		  "main",
		  "chrome,dialog,centerscreen");

    log(res);

}
