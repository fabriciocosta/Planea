var CC = Components.classes;
var CI = Components.interfaces;
var nsIFilePicker = CI.nsIFilePicker;

var spellclass = "@mozilla.org/spellchecker/myspell;1";
if ("@mozilla.org/spellchecker/hunspell;1" in CC)
	spellclass = "@mozilla.org/spellchecker/hunspell;1";
if ("@mozilla.org/spellchecker/engine;1" in CC)
	spellclass = "@mozilla.org/spellchecker/engine;1";
	
var gSpellCheckEngine = CC[spellclass].getService(CI.mozISpellCheckingEngine);


var fs = {
	getlastModifiedTime: function(file_path) {
		var localfile = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
		try {
			localfile.initWithPath( fs.chromeToPath(file_path) );
			if ( localfile.exists() == false ) {
				throw new Error("Archivo no encontrado : " + localfile.path);
				return false;
			} else {
				return localfile.lastModifiedTime;
			}
		}
		catch(e) {
			return false;
		}
	},
    getHomeDir: function() {
        var dirService = CC["@mozilla.org/file/directory_service;1"].getService(CI.nsIProperties);
        var homeDirFile = dirService.get("Home", CI.nsIFile);
        // returns an nsIFile object
        var homeDir = homeDirFile.path;
        return homeDir;
    },
    getContents: function(aURL, callback ){

      var ioService=CC["@mozilla.org/network/io-service;1"].getService(CI.nsIIOService);
      var scriptableStream=CC["@mozilla.org/scriptableinputstream;1"].getService(CI.nsIScriptableInputStream);

      var channel=ioService.newChannel(aURL,null,null);

      //Asynchronous
      if (callback!=undefined) {
        var mylistener = new StreamListener(callback);
        channel.notificationCallbacks = mylistener;
        channel.asyncOpen( mylistener, null );
        return;
      }

      //Synchronous
      var input = channel.open();
      scriptableStream.init(input);
      var str=scriptableStream.read(input.available());
      scriptableStream.close();
      input.close();
      return str;
    },
    chromeToPath : function (aPath) {
       if (!aPath || !(/^chrome:/.test(aPath)))
          return aPath; //not a chrome url
       var rv;
       
          var ios = CC['@mozilla.org/network/io-service;1'].getService(CI["nsIIOService"]);
            var uri = ios.newURI(aPath, "UTF-8", null);
            var cr = CC['@mozilla.org/chrome/chrome-registry;1'].getService(CI["nsIChromeRegistry"]);
            rv = cr.convertChromeURL(uri).spec;

            if (/^file:/.test(rv))
              rv = this.urlToPath(rv);
            else
              rv = this.urlToPath("file://"+rv);

          return rv;
    },
    urlToPath: function (aPath) {

        if (!aPath || !/^file:/.test(aPath))
          return ;
        var rv;
       var ph = CC["@mozilla.org/network/protocol;1?name=file"].createInstance(CI.nsIFileProtocolHandler);
        rv = ph.getFileFromURLSpec(aPath).path;
        return rv;
    },
    getProfileDirectory : function() {

		var file = Components.classes["@mozilla.org/file/directory_service;1"].
           getService(Components.interfaces.nsIProperties).
           get("ProfD", Components.interfaces.nsIFile);
	/*
        let directoryService = CC["@mozilla.org/file/directory_service;1"].getService(CI.nsIProperties); 
        let localDir = directoryService.get("ProfD", CI.nsIFile); 
        localDir.append("FolderName"); 
        if (!localDir.exists() || !localDir.isDirectory())  
            localDir.create( CI.nsIFile.DIRECTORY_TYPE, 0774 ); 
        return localDir; 
		*/
		return file.path;
    },
    writeFile : function( file_path, data_string ) {
        var localfile = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
	    var foStream = CC["@mozilla.org/network/file-output-stream;1"].createInstance(CI.nsIFileOutputStream);
    	var converter = CC["@mozilla.org/intl/converter-output-stream;1"].createInstance(CI.nsIConverterOutputStream);	

		try {
			localfile.initWithPath( file_path );	
		} catch( e ) {
			alert( e + " : file_path: " + file_path );
		}
    	foStream.init( localfile, 0x02 | 0x08 | 0x20, -1, 0);   // write, create, truncate		
	    //converter.init(foStream, "ISO-8859-1", 0, 0);
	    converter.init( foStream, "UTF8", 0, 0);	
    	converter.writeString( data_string );    	

        converter.close();
	    foStream.close();
        
    },
    writeFileBinary : function( file_path, data_string ) {
        var localfile = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
	    var foStream = CC["@mozilla.org/network/file-output-stream;1"].createInstance(CI.nsIFileOutputStream);
    	
		try {
			localfile.initWithPath( file_path );	
		} catch( e ) {
			alert( e + " : file_path: " + file_path );
		}
    	foStream.init( localfile, 0x02 | 0x08 | 0x20, -1, 0);   // write, create, truncate		
	    //converter.init(foStream, "ISO-8859-1", 0, 0);
	    	
    	foStream.write( data_string, data_string.length );    	

	    foStream.close();
        
    },	
    readFile : function( file_path ) {

    	var localfile = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
        var fstream = CC["@mozilla.org/network/file-input-stream;1"].createInstance(CI.nsIFileInputStream);
	    var sstream = CC["@mozilla.org/scriptableinputstream;1"].createInstance(CI.nsIScriptableInputStream);
	    var converteri = CC["@mozilla.org/intl/converter-input-stream;1"].createInstance(CI.nsIConverterInputStream);		

    	//nsfile.initWithPath( "chrome://planear/content/ayuda.xml" );
	    localfile.initWithPath( file_path );

	    if ( localfile.exists() == false ) {
            throw new Error("Archivo no encontrado : " + localfile.path);
            return false;
        } else {
		    //alert("ok helpfile");
	    }

	    fstream.init( localfile, -1, -1, 0);
	    sstream.init(fstream);

	    var file_bytes = sstream.available();
	    converteri.init( fstream, "UTF-8", file_bytes, 0);
	    var str = {};
	    var numChars = converteri.readString( file_bytes, str);

        fstream.close();
        sstream.close();
        converteri.close();

        if (str.value) return str.value;
        else return false;

    },
	readFileBinary : function( file_path ) {
	
		var localfile = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
        var fstream = CC["@mozilla.org/network/file-input-stream;1"].createInstance(CI.nsIFileInputStream);
	    var bstream = CC["@mozilla.org/binaryinputstream;1"].createInstance(CI.nsIBinaryInputStream);

	    localfile.initWithPath( file_path );

	    if ( localfile.exists() == false ) {
            throw new Error("Archivo no encontrado : " + localfile.path);
            return false;
        } else {
		    //alert("ok helpfile");
	    }

	    fstream.init( localfile, -1, -1, 0);
	    bstream.setInputStream(fstream);

	    var file_bytes = bstream.available();
		log (" file_bytes: "+bstream.available());
	    //var binstr = {};
		var ab = new ArrayBuffer(file_bytes);
		
		bstream.readByteArray( file_bytes, ab );
		
		
		
        fstream.close();
        bstream.close();

        return ab;
	},
	readFileBinaryAsync : function( file_path, callback ) {
		 
		var localfile = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
		localfile.initWithPath( file_path );
		//HTML5 File Api
		var DOMFile = new File(localfile);
		//alert(DOMFile.name);
		
		var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = function(e) {
            //theFile.name
			callback( e.target.result, DOMFile );
        }

        // read the file !
        // readAsArrayBuffer and readAsBinaryString both produce valid content for JSZip.
        reader.readAsArrayBuffer(DOMFile);
		
	},
	readAsDataURL: function( fileUri, callback ) {
		try {
			varselectedFile = new File(fileUri);
		
			var oReader = new FileReader();
			oReader.onload = callback;
		
			log("readAsDataURL() > uploading!! [" + fileUri +"] into ["+fileUri+"]");
		
			oReader.readAsDataURL( selectedFile );
		} catch(e) {
			error( "readAsDataURL > fileUri ["+fileUri+"]" );
		}
	},
	readAsDataURLSync: function( fileUri ) {
		/*
		var selectedFile = new File( fileUri );
		var oReader = new FileReaderSync();
		log("readAsDataURLSync() > loading!! [" + selectedFile.name +"] into ["+fileUri+"]");
		return oReader.readAsDataURL(selectedFile);
		*/
		var nsfile = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
		try {
			nsfile.initWithPath( fileUri );
		
			var contentType = CC["@mozilla.org/mime;1"].getService(CI.nsIMIMEService).getTypeFromFile(nsfile);
			var inputStream = CC["@mozilla.org/network/file-input-stream;1"].createInstance(CI.nsIFileInputStream);
		
			inputStream.init(nsfile, 0x01, 0600, 0);
		
			var stream = CC["@mozilla.org/binaryinputstream;1"].createInstance(CI.nsIBinaryInputStream);
			stream.setInputStream(inputStream);
			var encoded = btoa(stream.readBytes(stream.available()));
			return "data:" + contentType + ";base64," + encoded;
		} catch(e) {
			error("readAsDataURLSync() > could read: "+ fileUri+" e:"+e);
		}
	},
	readAsbase64Sync: function( fileUri ) {
		/*
		var selectedFile = new File( fileUri );
		var oReader = new FileReaderSync();
		log("readAsDataURLSync() > loading!! [" + selectedFile.name +"] into ["+fileUri+"]");
		return oReader.readAsDataURL(selectedFile);
		*/
		var nsfile = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
		nsfile.initWithPath( fileUri );
		var contentType = CC["@mozilla.org/mime;1"].getService(CI.nsIMIMEService).getTypeFromFile(nsfile);
		var inputStream = CC["@mozilla.org/network/file-input-stream;1"].createInstance(CI.nsIFileInputStream);
		inputStream.init(nsfile, 0x01, 0600, 0);
		var stream = CC["@mozilla.org/binaryinputstream;1"].createInstance(CI.nsIBinaryInputStream);
		stream.setInputStream(inputStream);
		var encoded = btoa(stream.readBytes(stream.available()));
		return encoded;

	},
	bufferToBase64: function (arrayBuffer) {
		var blob = new Blob([arrayBuffer], {type: 'application/octet-binary'}); // pass a useful mime type here
		var url = URL.createObjectURL(blob);
		return url;
	},
    copyFile : function( file_source, file_destination ) {
		// get a component for the file to copy
		  var aFile = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
		  if (!aFile) return false;

		  // get a component for the directory to copy to
		  var aDir = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
		  if (!aDir) return false;

		  // next, assign URLs to the file components
		  aFile.initWithPath(file_source);
		  aDir.initWithPath(file_destination);

		  // finally, copy the file, without renaming it
		  aFile.copyTo(aDir,null);
    },
    streamToFile : function( stream, file_path) {
        var output = CC["@mozilla.org/network/file-output-stream;1"].createInstance(CI.nsIFileOutputStream);
        output.init(file, 0x02 | 0x08 | 0x20, -1, output.DEFER_OPEN);
        Components.utils.import("resource://gre/modules/NetUtil.jsm");
        NetUtil.asyncCopy(stream, output);
    },
    openUri: function( uri, async, callback ) {
        var request = new XMLHttpRequest();
        request.onload = function( aEvent ) {
            if (callback) callback( aEvent.target.responseText );
        };
        request.onerror = function(aEvent) {
            alert("Error Status: " + aEvent.target.status);
        };
        if (async==undefined) async = false;
        request.open('GET', uri, async );
        request.send(null);
        if (!async) {
            return request.responseText;
        }
    },
	saveUri: function( destFile, dataURI ) {
	  var file = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
	  var io = CC["@mozilla.org/network/io-service;1"].getService(CI.nsIIOService);
	  var persist = CC["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(CI.nsIWebBrowserPersist);
	  var xfer = CC["@mozilla.org/transfer;1"].createInstance(CI.nsITransfer);
	  
	  file.initWithPath(destFile);
	  var source = io.newURI( dataURI, "UTF8", null);
	  var target = io.newFileURI(file);
	  persist.persistFlags = Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
	  persist.persistFlags |= Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION;
	  persist.saveURI(source, null, null, null, null, file, null);
	},
	saveCanvas: function (canvas, destFile, dialog ) {
	  // convert string filepath to an nsIFile
	  var file = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
	  var io = CC["@mozilla.org/network/io-service;1"].getService(CI.nsIIOService);
	  var persist = CC["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(CI.nsIWebBrowserPersist);
	  var xfer = CC["@mozilla.org/transfer;1"].createInstance(CI.nsITransfer);
	  
	  file.initWithPath(destFile);
	  // create a data url from the canvas and then create URIs of the source and targets  
	  var source = io.newURI( canvas.toDataURL("image/png", ""), "UTF8", null );
	  var target = io.newFileURI( file )
		
	  // prepare to save the canvas data
	  persist.persistFlags = Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
	  persist.persistFlags |= Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION;
	  
	  // displays a download dialog (remove these 3 lines for silent download)	
	  if ( dialog ) {	  
		xfer.init(source, target, "", null, null, null, persist);
		persist.progressListener = xfer;
	  }
	  // save the canvas data to the file
	  persist.saveURI(source, null, null, null, null, file, null);
	},
	downloadFile: function (httpLoc, destFile, sourceWindow) {
	  try {
		//new obj_URI object
		var obj_URI = CC["@mozilla.org/network/io-service;1"].getService(CI.nsIIOService).newURI(httpLoc, null, null);

		//new file object
		var obj_TargetFile = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);

		//set file with path
		obj_TargetFile.initWithPath(destFile);
		//if file doesn't exist, create
		if(!obj_TargetFile.exists()) {
		  obj_TargetFile.create(0x00,0644);
		}

		//new persistence object
		var obj_Persist = CC["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(CI.nsIWebBrowserPersist);

		// with persist flags if desired
		const nsIWBP = CI.nsIWebBrowserPersist;
		const flags = nsIWBP.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
		obj_Persist.persistFlags = flags | nsIWBP.PERSIST_FLAGS_FROM_CACHE;

		var privacyContext = sourceWindow.QueryInterface(CI.nsIInterfaceRequestor)
										 .getInterface(CI.nsIWebNavigation)
										 .QueryInterface(CI.nsILoadContext);

		//save file to target
		obj_Persist.saveURI(obj_URI,null,null,null,null,obj_TargetFile,privacyContext);
	  } catch (e) {
		alert(e);
	  }
	},
	getWorkingPath: function() {
		var getWorkingDir= CC["@mozilla.org/file/directory_service;1"].getService(CI.nsIProperties).get("CurProcD", CI.nsIFile);
		return getWorkingDir.path;
	},
	callProgram: function( programrelativepath, programarguments ) {
	    
		var getWorkingDir= CC["@mozilla.org/file/directory_service;1"].getService(CI.nsIProperties).get("CurProcD", CI.nsIFile);

		var lFile = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
		var lPath = normalizePath( getWorkingDir.path + "" + programrelativepath );
		log("running lPath: "  + lPath );
		lFile.initWithPath(lPath);
		var process = CC["@mozilla.org/process/util;1"].createInstance(CI.nsIProcess);
		process.init( lFile );
		//var wxsPath = inputPath + �\\� + getAppName() + �.wixobj�;
		var args = programarguments;
		log("running lPath: args:"  + JSON.stringify( args, null, "\t" ) );

		process.run( true, args, args.length );
		log("called program: " + lPath + " exitvalue:" + process.exitValue );
		if (!(process instanceof CI.nsIProcess) || process.exitValue != 0) {
			// error handling;
			error("calling Program:" + lPath + " with arguments:" + JSON.stringify(programarguments) );
			alert("Converter error.");
		}
	},
	newFilePicker: function() {
		return CC["@mozilla.org/filepicker;1"].createInstance(CI.nsIFilePicker);
	},
	getExtension: function( file_path ) {
		if (typeof file_path == "string" ) {
			return file_path.substr((~-file_path.lastIndexOf(".") >>> 0) + 2);
		}
		return "";
		
	},
	getLeafName: function( file_path ) {
		var leafName = file_path.replace(/^.*(\\|\/|\:)/, '');
		return leafName;
	},
	setExtension: function( file_path, set_extension ) {
		//extraer filename:
		//chequear extension:
		//si no la tiene agregarsela
		set_extension = set_extension.toLowerCase();
		
		var file_extension = fs.getExtension( file_path ).toLowerCase();
		
		log("setExtension: file has: ["+file_extension+"] will set to: [" + set_extension + "] leafName:" + fs.getLeafName(file_path) );
		
		if ( file_extension == "" || file_extension==undefined || file_extension!=set_extension ) {
			return file_path + "." + set_extension;
		}
		
		if (file_extension == set_extension ) {
				return file_path;
		}
		
		return file_path;
	},
	launchFile: function( file_open_path ) {
	
		var lFile = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
		lFile.initWithPath( file_open_path );
		lFile.launch();
	}
};

function StreamListener(aCallbackFunc) {
    this.mCallbackFunc = aCallbackFunc;
};

StreamListener.prototype = {
      mData: "",

      // nsIStreamListener
      onStartRequest: function (aRequest, aContext) {
         this.mData = "";
      },

      onDataAvailable: function (aRequest, aContext, aStream, aSourceOffset, aLength) {
         var scriptableInputStream = CC["@mozilla.org/scriptableinputstream;1"].createInstance(CI.nsIScriptableInputStream);
         scriptableInputStream.init(aStream);

         this.mData += scriptableInputStream.read(aLength);
      },

      onStopRequest: function (aRequest, aContext, aStatus) {
         if (Components.isSuccessCode(aStatus)) {
            // request was successfull
            this.mCallbackFunc(this.mData);
         } else {
            // request failed
            this.mCallbackFunc(null);
         }
         gChannel = null;
      },

      // nsIChannelEventSink
      onChannelRedirect: function (aOldChannel, aNewChannel, aFlags) {
         // if redirecting, store the new channel
         gChannel = aNewChannel;
      },

      // nsIInterfaceRequestor
      getInterface: function (aIID) {
         try {
            return this.QueryInterface(aIID);
         } catch (e) {
            throw Components.results.NS_NOINTERFACE;
         }
      },

      // nsIProgressEventSink (not implementing will cause annoying exceptions)
      onProgress : function (aRequest, aContext, aProgress, aProgressMax) { },
      onStatus : function (aRequest, aContext, aStatus, aStatusArg) { },

      // nsIHttpEventSink (not implementing will cause annoying exceptions)
      onRedirect : function (aOldChannel, aNewChannel) { },

      // we are faking an XPCOM interface, so we need to implement QI
      QueryInterface : function(aIID) {
          if (aIID.equals(CI.nsISupports) ||
              aIID.equals(CI.nsIInterfaceRequestor) ||
              aIID.equals(CI.nsIChannelEventSink) ||
              aIID.equals(CI.nsIProgressEventSink) ||
              aIID.equals(CI.nsIHttpEventSink) ||
              aIID.equals(CI.nsIStreamListener))
            return this;

         throw Components.results.NS_NOINTERFACE;
      }
};




