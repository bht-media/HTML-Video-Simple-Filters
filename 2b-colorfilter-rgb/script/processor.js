// HTML5 Video Processing
// Example: Color Filter 
// (c) 2011-14 
// Oliver Lietz, lietz@nanocosmos.de
// v1.5, Dec.2013

// configuration variables for video effect
var config = {
	color_offset: 0,  	// brightness
	color_r: 0,			// r level
	color_g: 0,			// g level
	color_b: 0			// b level

};

// processor class - contains video filter functions
var processor = {

	// change_color_offset()
	// "brightness"/"color offset" effect: 
	// event handler called from html slider <input id="color_offset" ...
	change_color_offset: function(rgb) {
		// get color config value
		if(rgb=="r")
			config.color_r = Number(document.getElementById("color_r").value);
		else if(rgb=="g")
			config.color_g = Number(document.getElementById("color_g").value);
		else if(rgb=="b")
			config.color_b = Number(document.getElementById("color_b").value);
		else
			config.color_offset = Number(document.getElementById("color_offset").value);
		this.log("color offset = "+config.color_offset + " - RGB: "+config.color_r+","+config.color_g+","+config.color_b);
	},

    // computeFrame()
	// do the image processing for one frame
    // reads frame data from rgb picture ctx
    // writes resulting video frames/pictures to 
	// html5 contexts ctx1..3
    computeFrame: function() {

		// get the context of the canvas 1
        var ctx = this.ctx1;

		// draw current video frame to ctx
        ctx.drawImage(this.video, 0, 0, this.width - 1, this.height);
		
		// get frame RGB data bytes from context ctx 
        var frame={};
		var length=0;
        try {
            // get frame bitmap from video canvas context
            frame = ctx.getImageData(0, 0, this.width, this.height);
        } catch(e) {
			// catch and display error of getImageData fails
            tools.browserError(e);
        }

		// frame data length in pixels (bytes/4, RGBA)
        var l = (frame.data.length) / 4;
		
		//console.log("Using offset " + config.color_offset);
		
        // do the image processing
        // read in pixel data to r,g,b,a
		// write back
        for (var i = 0; i < l; i++) {
			// read RGB values
            var r = frame.data[i * 4 + 0];
            var g = frame.data[i * 4 + 1];
            var b = frame.data[i * 4 + 2];
						
			// Diese Zeilen regeln momentan die Gesamthelligkeit (alle 3 Farbwerte)
			// indem der Wert config.color_offset auf alle Werte aufaddiert wird

			//  Hinweis: die Regler-Werte von der HTML-Seite stehen in den Variablen
			//  config.color_r, config.color_g, config.color_b 

            // Read rgb values + global offset
            r = r + config.color_offset;
            g = g + config.color_offset;
            b = b + config.color_offset;

			// add color offset
            var r1 = (r + config.color_r + config.color_offset);
            var g1 = (g + config.color_g + config.color_offset);
            var b1 = (b + config.color_b + config.color_offset);
			
            // write RGB data to frame
            frame.data[i * 4 + 0] = r1;
            frame.data[i * 4 + 1] = g1;
            frame.data[i * 4 + 2] = b1;			

        }
		// write frame back to context of canvas objects 
        this.ctx1.putImageData(frame, 0, 0);
        return;
    },

	// getTimestamp(): returns current time
	getTimestamp: function() { return new Date().getTime(); },

	// timerCallback function 
	// - is called every couple of milliseconds to do the calculation 
	// for each new video frame
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
	
    // doLoad: needs to be called on page load
    doLoad: function() {

        this.error = 0;
    
        tools.browserCheck();
        
        this.video = document.getElementById("video");

        this.c1 = document.getElementById("c1");
        this.ctx1 = this.c1.getContext("2d");

        // scaling factor for resulting canvas
        var factor = 1;
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

        self.timerCallback();
		
    },
	    
	// log(text)
	// display text in html log area (div "log") and browser console
	log: function(text) {
		var logArea = document.getElementById("log"); 
		if(logArea) {
			logArea.innerHTML += text + "<br>";
		}
		if(typeof console != "undefined") {
			console.log(text);
		}
	}
    
};
