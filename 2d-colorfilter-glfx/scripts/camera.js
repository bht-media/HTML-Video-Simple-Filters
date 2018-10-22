
	// start camera and replace "video"
	function startCam() {

		const constraints = {
			video: { facingMode: "user" },
		};

		navigator.mediaDevices
		.getUserMedia(constraints)
		.then((localMediaStream) => {
		  /* use the stream */
		  var video = document.querySelector('video');
		  video.srcObject = localMediaStream;

		  // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
		  // See crbug.com/110938.
		  video.onloadedmetadata = function(e) {
			// Ready to go. Do some stuff.
			console.log("Cam connected",e);
			video.play();
		  };

		})
		.catch((err) => {
		  /* handle the error */
		  console.error('cam fails!', err);
		});

	 }
