//HTML5 tools / browser check
//(c) 2011-13 
// Oliver Lietz, lietz@nanocosmos.de
//v1.5, Dec.2013

var isFirefox = /Firefox/.test(navigator.userAgent);
var isChrome = /Chrome/.test(navigator.userAgent);

var tools = {
	    
	// helper function: isCanvasSupported()
	// check if HTML5 canvas is available
    isCanvasSupported: function(){ 
        var elem = document.createElement('canvas'); 
        return !!(elem.getContext && elem.getContext('2d')); 
    }, 

	// helper function: browserError()
	// displays an error message for incorrect browser settings
    browserError: function(e) {
    
        this.error = 1;
        
        //chrome security for local file operations
        if(isChrome)
            alert("Security Error\r\n - Call chrome with --allow-file-access-from-files\r\n\r\n"+e);
        else if(isFirefox)
            alert("Security Error\r\n - Open Firefox config (about: config) and set the value\r\nsecurity.fileuri.strict_origin_policy = false ");
        else 
            alert("Error in getImageData "+ e);    
    },
    
    //helper function to check for browser compatibility
    browserCheck: function() {
		if(!this.isCanvasSupported()) {
			alert("No HTML5 canvas - use a newer browser please.");
			return false;
		}
        // check for local file access
        //if(location.host.length>1)
        //    return;
        this.browserChecked = true;
        return true;
    },
    browserChecked: false,
    error: 0
};
