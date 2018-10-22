//HTML5 Example: Chroma Key Filter 
//BHT Berlin, Lohr/Lietz

var proc = null; // save current processor class

var processor = {

    // computeFrame
    // do the image processing for one frame
    // reads frame data from rgb picture ctx
    // writes chroma key pictures to ctx1..3
    computeFrame: function (now, data) {

        console.log("now, data",now,data);

        // get the context of the canvas 1
        var ctx = proc.ctx1;

        // draw current video frame to ctx
        ctx.drawImage(proc.video, 0, 0, proc.width - 1, proc.height);

        // get frame RGB data bytes from context ctx 
        var frame = {};
        var length = 0;
        try {
            frame = ctx.getImageData(0, 0, proc.width, proc.height);
            length = (frame.data.length) / 4;
        } catch (e) {
            // catch and display error of getImageData fails
            proc.browserError(e);
        }


        // do the color key:
        // do the image processing
        // read in pixel data to r,g,b, key, write back
        for (var i = 0; i < length; i++) {
            var r = frame.data[i * 4 + 0];
            var g = frame.data[i * 4 + 1];
            var b = frame.data[i * 4 + 2];

			// do the chroma key:

            // check for key color "blue" 
			if (b > 100 && g < 100 && r < 100) {
				// set "alpha" value to (0)
                frame.data[i * 4 + 3] = 0;
			}
        }
        // write back to 3 canvas objects
        proc.ctx1.putImageData(frame, 0, 0);
        proc.ctx2.putImageData(frame, 0, 0);
        proc.ctx3.putImageData(frame, 0, 0);

        return;
    },

    timerCallback: function () {
        if (this.error) {
            alert("Error happened - processor stopped.");
            return;
        }

        proc.computeFrame(Date.now());

        // call this function again after a certain time
        // (40 ms = 1/25 s)
        var fps = 25;
        var timeoutMilliseconds = 1000/fps;
        var self = this;
        setTimeout(function () {
            self.timerCallback();
        }, timeoutMilliseconds);

    },


    // doLoad: needs to be called on load
    doLoad: function () {

        this.error = 0;
        proc = this;

        try {

            // get the html <video> and <canvas> elements 
            this.video = document.getElementById("video");

            // get the canvas and 2d drawing context 
            this.c1 = document.getElementById("c1");
            this.ctx1 = this.c1.getContext("2d",{willReadFrequently: true});
            this.c2 = document.getElementById("c2");
            this.ctx2 = this.c2.getContext("2d");
            this.c3 = document.getElementById("c3");
            this.ctx3 = this.c3.getContext("2d");

            // show video width and height to log
            this.log("Found video: size " + this.video.videoWidth + "x" + this.video.videoHeight);

            // scale the video display 
            var factor = 2;
            this.video.width = this.video.videoWidth / factor;
            this.video.height = this.video.videoWidth / factor;

            w = this.video.videoWidth / factor;
            h = this.video.videoHeight / factor;

            if (!w || !this.video) {
                alert("No Video Object Found?");
            }
            this.ctx1.width = w;
            this.ctx1.height = h;
            this.c1.width = w + 1;
            this.c1.height = h;
            this.c2.width = w;
            this.c2.height = h;
            this.c3.width = w;
            this.c3.height = h;
            this.width = w;
            this.height = h;

        } catch (e) {
            // catch and display error
            alert("Erro: " + e);
            return;
        }

        // start the timer callback to draw frames
        var self = this;
        setTimeout(function () {
            self.timerCallback();
        }, 0);

    },

    // log(text)
    // display text in log area or console
    log: function (text) {
        var logArea = document.getElementById("log");
        if (logArea) {
            logArea.innerHTML += text + "<br>";
        }
        if (typeof console != "undefined") {
            console.log(text);
        }
    },

    // helper function: browserError()
    // displays an error message for incorrect browser settings
    browserError: function (e) {

        this.error = 1;

        var isFirefox = /Firefox/.test(navigator.userAgent);
        var isChrome = /Chrome/.test(navigator.userAgent);
                
        //chrome security for local file operations
        if (isChrome)
            alert("Security Error\r\n - Call chrome with --allow-file-access-from-files\r\n\r\n" + e);
        else if (isFirefox)
            alert("Security Error\r\n - Open Firefox config (about: config) and set the value\r\nsecurity.fileuri.strict_origin_policy = false ");
        else
            alert("Error in getImageData " + e);
    },

    error: 0
};
