//HTML5 Example: Color Filter 
//(c) 2011-13 
// Jürgen Lohr, lohr@beuth-hochschule.de
// Oliver Lietz, lietz@nanocosmos.de
//v1.4, May.2013

var isFirefox = /Firefox/.test(navigator.userAgent);
var isChrome = /Chrome/.test(navigator.userAgent);

var config = {
	color_offset: 0
};

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

		// get the context of the canvas 1
        var ctx = this.ctx1;

		// draw current video frame to ctx
        ctx.drawImage(this.video, 0, 0, this.width - 1, this.height);
		
		// get frame RGB data bytes from context ctx 
        var frame={};
		var length=0;
        try {
            // get frame from canvas context
            frame = ctx.getImageData(0, 0, this.width, this.height);
            frame2 = ctx.getImageData(0, 0, this.width, this.height);
            frame3 = ctx.getImageData(0, 0, this.width, this.height);
            frame4 = ctx.getImageData(0, 0, this.width, this.height);
            frame5 = ctx.getImageData(0, 0, this.width, this.height);
        } catch(e) {
			// catch and display error of getImageData fails
            this.browserError(e);
        }

        var l = (frame.data.length) / 4;
		
		//console.log("Using offset " + config.color_offset);
		
        // do the image processing
        // read in pixel data to r,g,b, key, write back
        for (var i = 0; i < l; i++) {
            var r = frame.data[i * 4 + 0];
            var g = frame.data[i * 4 + 1];
            var b = frame.data[i * 4 + 2];

            // R
            frame.data[i * 4 + 0] = r;
            frame.data[i * 4 + 1] = 0;
            frame.data[i * 4 + 2] = 0;

            // G
            frame2.data[i * 4 + 0] = 0;
            frame2.data[i * 4 + 1] = g;
            frame2.data[i * 4 + 2] = 0;

            // B
            frame3.data[i * 4 + 0] = 0;
            frame3.data[i * 4 + 1] = 0;
            frame3.data[i * 4 + 2] = b;

            // Grey (Y)
			var y = 0.3*r + 0.6*g + 0.1*b;
            frame4.data[i * 4 + 0] = y;
            frame4.data[i * 4 + 1] = y;
            frame4.data[i * 4 + 2] = y;

            // Sepia
            frame5.data[i * 4 + 0] = (r * 0.393) + (g * 0.769) + (b * 0.189);
            frame5.data[i * 4 + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
            frame5.data[i * 4 + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);

			// Sepia (2) 
            frame5.data[i * 4 + 0] = y + 100;
            frame5.data[i * 4 + 1] = y + 40;
            frame5.data[i * 4 + 2] = y + 10;
			
        }
		// write frame back to context of canvas objects 
        this.ctx1.putImageData(frame, 0, 0);
        this.ctx2.putImageData(frame2, 0, 0);
        this.ctx3.putImageData(frame3, 0, 0);
        this.ctx4.putImageData(frame4, 0, 0);
        this.ctx5.putImageData(frame5, 0, 0);
        return;
    },

	getTimestamp: function() { return new Date().getTime(); },

	// timerCallback function - is called every couple of milliseconds to do the calculation
    timerCallback: function() {
            if(this.error) {
                alert("Error happened - processor stopped.");
                return;
            }

			// call the computeFrame function to do the image processing
            this.computeFrame();
			
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
    
        if(!this.browserChecked)
            this.browserCheck();
        
        this.video = document.getElementById("video");

        this.c1 = document.getElementById("c1");
        this.ctx1 = this.c1.getContext("2d");
        this.c2 = document.getElementById("c2");
        this.ctx2 = this.c2.getContext("2d");
        this.c3 = document.getElementById("c3");
        this.ctx3 = this.c3.getContext("2d");
        this.c4 = document.getElementById("c4");
        this.ctx4 = this.c4.getContext("2d");
        this.c5 = document.getElementById("c5");
        this.ctx5 = this.c5.getContext("2d");

        // scaling factor for resulting canvas
        var factor = 4;
        var self = this;
        self.width = self.video.videoWidth / factor;
        self.height = self.video.videoHeight / factor;

        if (!self.width || !self.video) {
            alert("No Video Object Found?");
            return;
        }

        this.ctx1.width = self.width;
        this.ctx1.height = self.height;
        this.c1.width = self.width + 1;
        this.c1.height = self.height;
        this.c2.width = self.width;
        this.c2.height = self.height;
        this.c3.width = self.width;
        this.c3.height = self.height;
        this.c4.width = self.width;
        this.c4.height = self.height;
        this.c5.width = self.width;
        this.c5.height = self.height;

        self.timerCallback();
		
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
