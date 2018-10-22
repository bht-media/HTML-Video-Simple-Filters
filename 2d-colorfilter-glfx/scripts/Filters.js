Filters = {};

Filters.getPixels = function(img,w = img.width,h = img.height) {
	//
	//Function to retrieve ImageData object from Img or Video Tag
	//
	var c = this.getCanvas(w, h);
	var ctx = c.getContext('2d');
	ctx.drawImage(img,0,0,w,h);
	return ctx.getImageData(0,0,c.width,c.height);
}

Filters.getCanvas = function(w,h) {
	//
	//function used to quickly create a canvas using width and height values
	//
	var c = document.createElement('canvas');
	c.width = w;
	c.height = h;
	return c
}

Filters.filterImage = function(filter, img, var_args) {
	//
	//Image Filter base function, used to pass ImageData and Weights to Filter function
	//
	if(img.constructor.name == "HTMLImageElement" || img.constructor.name == "HTMLVideoElement") {
		img = this.getPixels(img);
	}
	var args = [img];
	for (var i=2; i<arguments.length;i++) {
		args.push(arguments[i]);
	}
	return filter.apply(null, args);
}

Filters.greyscale = function(pixels, tone = [0,0,0]) {
	//
	//Greyscale Slider
	//
	var d = pixels.data;
	for (var i = 0;i<d.length;i+=4) {
		var r = d[i];
		var g = d[i+1];
		var b = d[i+2];
		// grayscale avg of rgb
		//var l = (r + g + b)/3;
		//var l = 0.2126*r + 0.7152*g + 0.0722*b;
		var l = 0.299*r + 0.587*g + 0.114*b;
		d[i] = l + tone[0];
		d[i+1] = l + tone[1];
		d[i+2] = l + tone[2];				
	}
	return pixels;
}

Filters.sepia = function(pixels, tone = [0,0,0]) {
	var d = pixels.data;
	for (var i = 0;i<d.length;i+=4) {
		var r = d[i];
		var g = d[i+1];
		var b = d[i+2];
		d[i] = 0.393*r + 0.769*g + 0.189*b;
		d[i+1] = 0.349*r + 0.686*g + 0.168*b;
		d[i+2] = 0.272*r + 0.534*g + 0.131*b;		
	}
	return pixels;
}

Filters.offset = function(pixels, offset = [0,0,0]) {
	//
	//Offset Filter to offset color values
	//
	var d = pixels.data;
	for (var i = 0;i<d.length;i+=4) {
		d[i] = d[i] + offset[0];
		d[i+1] = d[i+1] + offset[1];
		d[i+2] = d[i+2] + offset[2];				
	}
	return pixels;
}

Filters.tmpCanvas = document.createElement('canvas');
Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

Filters.createImageData = function(w,h) {
	//
	//Function used to create plain image data
	//
	return this.tmpCtx.createImageData(w,h);
}

Filters.convolute = function(pixels, weights) {
	//
	//Actual convolution function used to set the pixels according to predetermined weights
	//
	var side = Math.round(Math.sqrt(weights.length));
	var halfSide = Math.floor(side/2);
	var src = pixels.data;
	var sw = pixels.width;
	var sh = pixels.height;
	
	var w = sw;
	var h = sh;
	var output = Filters.createImageData(w,h);
	var dst = output.data;
	
	for (var y=0;y<h;y++) {
		for (var x=0; x<w; x++) {
			var sy = y;
			var sx = x;
			var dstOff = (y*w+x)*4;
			
			var r=0, g=0, b=0, a=0;
			for (var cy=0; cy<side; cy++) {
				for(var cx=0; cx<side; cx++) {
					var scy = sy + cy - halfSide;
					var scx = sx + cx - halfSide;
					if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
						var srcOff = (scy*sw+scx)*4;
						var wt = weights[cy*side+cx];
						r += src[srcOff] * wt;
						g += src[srcOff+1] * wt;
						b += src[srcOff+2] * wt;
						a += src[srcOff+3] * wt;
						
					}	
				}
				
			}
			dst[dstOff] = Math.abs(r);
			dst[dstOff+1] = Math.abs(g);
			dst[dstOff+2] = Math.abs(b);
			dst[dstOff+3] = Math.abs(a);
		}
	}
	return output;
};

gaussFunc = function(size = 3, sigma = 1.5) {
	//
	//function to calculate weights of gaussian blur
	//
	if (!(size % 2)) {
		console.log("Error: Kernel size is not odd number, default value will be used.")
	}
	var g = [];
	for (var i=-1;i<2;i++) {
		for(var j=-1;j<2;j++) {
			g.push((1 / (2 * Math.PI * sigma * sigma)) * Math.exp(-(i*i + j*j) / (2 * sigma * sigma)));
		}
	}
	
	return g;
}

checkWeights = function(weights) {
	//
	//function to check and correct weights that do not sum up to 1
	//
	var sum = Math.abs(weights.reduce(function(a,b) { return a + b; }));
	return weights.map(function(a) { return a / sum; })
}


//Filter Matrixes
Filters.blurFilterMatrixes = {
	box:checkWeights([1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]), //BOX BLUR: weight every pixel equally.
	gauss:checkWeights(gaussFunc(3)), //GAUSSIAN BLUR: the weighting of each pixel is determined by the gauss function
	prewitt:checkWeights([1,1,1,1,-16,1,1,1,1]) //Prewitt sharpen. 
};

