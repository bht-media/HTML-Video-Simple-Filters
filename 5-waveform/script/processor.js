//HTML5 / Waveform Monitor Example
//(c) 2011/13 
// Oliver Lietz, lietz@nanocosmos.de
// Waveform von Stud. Dennis König
//v1.3, June.2013

var isFirefox = /Firefox/.test(navigator.userAgent);
var isChrome = /Chrome/.test(navigator.userAgent);

var config = {
	color_offset: 0,  	// brightness
	color_r: 0,			// r level
	color_g: 0,			// g level
	color_b: 0,			// b level
	canvas_width: 0,	// 
	waveform_line: 50,	// waveform scan line
	waveform_all: false,// process all lines? 
	fillLines: false,	// fill lines or single lines (histogram)
	back_color: 255		// waveform background color
};

// RGB Arrays for Waveform
var myArrayR = new Array();
var myArrayG = new Array();
var myArrayB = new Array();

function log(msg) {
    setTimeout(function() {
        throw new Error(msg);
    }, 0);
}

var processor = {

	// change_color_offset()
	// "brightness"/"color offset" effect: event handler for html <input id="color_offset" ...
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
		//this.log("color offset = "+config.color_offset);
	},

	// change_line() event handler for "video line" slider
	change_line: function() {
		config.waveform_line = document.getElementById("video_line").value;
	},

	// change_radioButton(): event handler for "all lines"
	change_radioButton: function() {
		config.waveform_all = document.getElementById("radioButton").checked;
		if(config.waveform_all)
			alert("Funktioniert noch nicht richtig");
	},

	// change_fillLines(): event handler for "fill lines"
	change_fillLines: function() {
		config.fillLines = document.getElementById("fillLines").checked;
	},

	// change_fillLines(): event handler for "fill lines"
	change_background: function() {
		config.back_color = document.getElementById("back_color").value;
	},
	
	drawWaveform: function(frame, myArray, color) {	
		var spaltenZaehler=0;
		var rgbZaehler=255;
		var fillLines = config.fillLines; // fill lines / histogram or single lines 
		
        var l = (frame.data.length) / 4;
		for (var h = 0; h < l; h++) {
			var doPaint = false;
			if(myArray[spaltenZaehler]>=rgbZaehler) {
				doPaint=true;
				if(!fillLines && myArray[spaltenZaehler]>rgbZaehler+2) {
					doPaint=false;
				}
			}
			
			if (doPaint){
				frame.data[h * 4 + 0] = color[0];
				frame.data[h * 4 + 1] = color[1];
				frame.data[h * 4 + 2] = color[2];
			}else if(config.back_color>0) {
				//Hintergrund
				frame.data[h * 4 + 0] = config.back_color;
				frame.data[h * 4 + 1] = config.back_color;
				frame.data[h * 4 + 2] = config.back_color;
			}
			spaltenZaehler++;
			if (spaltenZaehler==config.canvas_width){
				rgbZaehler--;
				spaltenZaehler=0;
			}
		}	
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
        //R
		var ctx2 = this.ctx2;
        ctx2.drawImage(this.video,0, 0, this.width - 1, this.height);
		//G
		var ctx3 = this.ctx3;
        ctx3.drawImage(this.video,0, 0, this.width - 1, this.height);
		//B
		var ctx4 = this.ctx4;
        ctx4.drawImage(this.video,0, 0, this.width - 1, this.height);
		//this.c2 = document.getElementById("c2");
        //this.ctx2 = this.c2.getContext("2d");
		
		var frame;
		var frameR;
		var frameG;
		var frameB;
		
        try {
            // get frame from canvas context
            frame = ctx.getImageData(0, 0, this.width, this.height);
			frameR = ctx2.getImageData(0, 0, this.width, this.height);
			frameG = ctx3.getImageData(0, 0, this.width, this.height);
			frameB = ctx4.getImageData(0, 0, this.width, this.height);
			
        } catch(e) {
			// catch and display error of getImageData fails
            this.browserError(e);
        }

        var l = (frame.data.length) / 4;
		
		//Berechnungen für die rote Linie
		var zeilenLaenge= (frame.data.length / this.height) /4;

		var line = config.waveform_line;
		var line_1 = line;
		var line_2 = line

		// process all video lines?
		if (config.waveform_all) {
			line_1 = 50; //TEST: only 10 lines
			line_2 = 60; 
		}

		// loop over all lines to scan
		for (var j = line_1; j <= line_2; j++) {
		
			var unterGrenze = zeilenLaenge * line;
			var oberGrenze = unterGrenze + zeilenLaenge;
		   
			//Leeren der RGB Arrays
			for (var o=0; myArrayR.length!=0; o++){
				myArrayR.pop();
				myArrayG.pop();
				myArrayB.pop();
			}
			
			//Schleife für den roten Strich
			
			for (var i = 0; i < l; i++) {
				// read RGB values
				var r = frame.data[i * 4 + 0];
				var g = frame.data[i * 4 + 1];
				var b = frame.data[i * 4 + 2];
				
				// do the filter processing: color offset
				var r1 = (r + config.color_r + config.color_offset);
				var g1 = (g + config.color_g + config.color_offset);
				var b1 = (b + config.color_b + config.color_offset);
				
				// Waveform
				
				if (i>=unterGrenze && i<=oberGrenze){
					//Sammeln der anzuzeigenden RGB Werte 
					myArrayR.push(r1);
					myArrayG.push(g1);
					myArrayB.push(b1);
				
					//draw selected line in canvas 1				
					frame.data[i * 4 + 0] = 255;
					frame.data[i * 4 + 1] = 0;
					frame.data[i * 4 + 2] = 0;
				}else{
					frame.data[i * 4 + 0] = r1;
					frame.data[i * 4 + 1] = g1;
					frame.data[i * 4 + 2] = b1;
				}
				
			}
		
			// draw waveforms		
			this.drawWaveform(frameR, myArrayR, [255,0,0] );
			this.drawWaveform(frameG, myArrayG, [0,255,0] );
			this.drawWaveform(frameB, myArrayB, [0,0,255] );
			
			// write frames back to context of canvas objects 
			this.ctx1.putImageData(frame, 0, 0);
			this.ctx2.putImageData(frameR, 0, 0);
			this.ctx3.putImageData(frameG, 0, 0);
			this.ctx4.putImageData(frameB, 0, 0);
		}
		
        return;
    },
	
    timerCallback: function() {
            if(this.error) {
                alert("Error happened - processor stopped.");
                return;
            }
            if (this.video.paused || this.video.ended) {
                this.computeFrame();
                //     return;
            }
            this.computeFrame();
			
			// call this function again after a certain time
			// (40 ms = 1/25 s)
			var timeoutMilliseconds = 40;
            var self = this;
            setTimeout(function() {
                self.timerCallback();
            }, timeoutMilliseconds);
    },
	
	doLoadReady: function() {
        this.c1 = document.getElementById("c1");
        this.ctx1 = this.c1.getContext("2d");
		//R
		this.c2 = document.getElementById("c2");
        this.ctx2 = this.c2.getContext("2d");
		//G
		this.c3 = document.getElementById("c3");
        this.ctx3 = this.c3.getContext("2d");
		//B
		this.c4 = document.getElementById("c4");
        this.ctx4 = this.c4.getContext("2d");
		
		// scaling factor for resulting canvas
        var factor = 1;
        var self = this;
        
		self.width = self.video.videoWidth / factor;
        self.height = self.video.videoHeight / factor;
		config.canvas_width=self.width;
	
        if (!self.width || !self.video) {
            alert("No Video Object Found?");
            return;
        }

        this.ctx1.width = self.width;
        this.ctx1.height = self.height;
        this.c1.width = self.width + 1;
        this.c1.height = self.height;

        //    this.video.addEventListener("playing", function() {
        self.timerCallback();
        //      }, false);
        //   this.computeFrame();
	},
    
    // doLoad: needs to be called on load
    doLoad: function() {

        this.error = 0;
    
        if(!this.browserChecked)
            this.browserCheck();
        
        this.video = document.getElementById("video");

		this.doLoadReady();
		
		// the oncanplay event does not seem to work...
		//video.oncanplay = function(e) {
		//  this.doLoadReady();
		//}
		
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
