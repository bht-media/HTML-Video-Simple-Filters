//HTML5 Example: Color Filter 
//(c) 2011-13 
// Juergen Lohr, lohr@beuth-hochschule.de
// Oliver Lietz, lietz@nanocosmos.de
//v1.5, June 2013

var isFirefox = /Firefox/.test(navigator.userAgent);
var isChrome = /Chrome/.test(navigator.userAgent);

var config = {
	color_offset: 0
};

// reference frame for difference (frame-1)
var frame2;

var processor = {

	// "brightness" effect: change_color_offset: handled by html <input id="color_offset" ...
	change_color_offset: function() {
		// get color config value
		config.color_offset = document.getElementById("color_offset").value;
		this.log("color offset = "+config.color_offset);
	},

    // computeFrame
	// do the image processing for one frame
    // reads frame data from rgb picture ctx
    // writes chroma key pictures to ctx1..3
    computeFrame: function() {
			
		// get the context of the canvas 1 (video frame)
        var ctx = this.ctx1;

		// draw current video frame to ctx
        ctx.drawImage(this.video, 0, 0, this.width - 1, this.height);
		
		// get frame RGB data bytes from context ctx 
        var frame={};
		var length=0;
        try {
            frame = ctx.getImageData(0, 0, this.width, this.height);
			length = (frame.data.length) / 4;
        } catch(e) {
			// catch and display error of getImageData fails
            this.browserError(e);
        }

		// set first reference frame2  
		if(frame2 == null){
			frame2 = frame;		
		}
		
		// color offset for "brightness" effect
		offset = parseInt(config.color_offset);
		
        // do the image processing
		
		var diff = 0, diff2 = 0, diffSum = 0;
			
     	// read in pixel data to r,g,b, key, write back
        for (var i = 0; i < length; i++) {
            var r = frame.data[i * 4 + 0];
            var g = frame.data[i * 4 + 1];
            var b = frame.data[i * 4 + 2];
						
			var grau = 0.3*r + 0.6*g + 0.1*b;

			var r2 = frame2.data[i * 4 + 0] ;
            var g2 = frame2.data[i * 4 + 1];
            var b2 = frame2.data[i * 4 + 2];

			var grau2 = 0.3*r2 + 0.6*g2 + 0.1*b2;
			var diff = grau - grau2;
			diffSum += Math.abs(diff);									
        }
		
		// current video position (x.yy seconds)
		var position = Math.round(this.video.currentTime*100)/100;
		//this.log("CurrentTime: " + position + "  DiffSum: " + diffSum);
		console.log("CurrentTime: " + position + "  DiffSum: " + diffSum);
		var sceneThreshold = 3000000;
		//if(this.video.videoWidth<600)
		//	sceneThreshold = 1000000;
		if(diffSum>sceneThreshold) {
			this.showcut(position);			
		}
		
		// store current frame as "last frame"
		frame2 = frame;		
		
        return;
    },

	getTimestamp: function() { return new Date().getTime(); },

	// timerCallback function - is called every couple of milliseconds to do the calculation
    timerCallback: function() {
            if(this.error) {
                alert("Error happened - processor stopped.");
                return;
            }

			// call computeFrame only when not paused or ended
			if(!(this.video.paused || this.video.ended)) {	
			
				// call the computeFrame function to do the image processing
				this.computeFrame();

			}
			
			// call this function again after a certain time
			// (40 ms = 1/25 s)
			var timeoutMilliseconds = 40;
			var self = this;
            setTimeout(function() {
                self.timerCallback();
            }, timeoutMilliseconds);
    },
	
    // doLoad: needs to be called on load
    doLoad: function() {

        this.error = 0;
    
		// init high precision timer if available
		if (window.performance.now) {
			this.log("Using high performance timer");
			getTimestamp = function() { return window.performance.now(); };
		} else {
			if (window.performance.webkitNow) {
				this.log("Using webkit high performance timer");
				getTimestamp = function() { return window.performance.webkitNow(); };
			} 
		}

		// check for a compatible browser
        if(!this.browserChecked)
            this.browserCheck();
			
		try {
        
			// get the html <video> and <canvas> elements 
			this.video = document.getElementById("video");
			this.c1 = document.getElementById("c1");
			// get the 2d drawing context of the canvas
			this.ctx1 = this.c1.getContext("2d");

			// show video width and height to log
			this.log("Found video: size "+this.video.videoWidth+"x"+this.video.videoHeight);
						
			// scale the video display 
			this.video.width = this.video.videoWidth;
			this.video.height = this.video.videoHeight;
			if(this.video.width>600) {
				this.video.width /= 2;
				this.video.height /= 2;
			}
			
			// scaling factor for resulting canvas
			var factor = 1;
			
			// set width and height of canvas object
			this.width = this.video.width / factor;
			this.height = this.video.height / factor;

			this.ctx1.width = this.width;
			this.ctx1.height = this.height;
			this.c1.width = this.width + 1;
			this.c1.height = this.height;
			
		} catch(e) {
			// catch and display error
			alert("Error: " + e);
			return;
		}
		
		// start the timer callback to draw frames
		this.timerCallback();
		
    },
	
	// helper function: isCanvasSupported()
	// check if HTML5 canvas is available
    isCanvasSupported: function(){ 
        var elem = document.createElement('canvas'); 
        return !!(elem.getContext && elem.getContext('2d')); 
    }, 
	
	// log(text)
	// display text in log area or console
	log: function(text) {
		var logArea = document.getElementById("log"); 
		if(logArea) {
			logArea.innerHTML += text + "<br>";
		}
		if(typeof console != "undefined") {
			console.log(text);
		}
	},

	// show cut in cutlist
	showcut: function(text) {
		var showtext = "Scene cut at position: " + text;
		this.log(showtext);
		var cutArea = document.getElementById("cutlist"); 
		if(cutArea) {
			cutArea.innerHTML += showtext + "<br>";
		}
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
