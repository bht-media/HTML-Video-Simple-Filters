#!/bin/sh

#call chrome on MacOS
if [[ "$OSTYPE" == "darwin"* ]]; then
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
else
CHROME=google-chrome
fi

# disable security
OPTIONS+=" --allow-file-access-from-files --disable-web-security --allow-http-screen-capture"
OPTIONS+=" --unsafely-treat-insecure-origin-as-secure=http://localhost"
OPTIONS+=" --user-data-dir=/tmp/chromeuser2"

# feeds a test pattern to getUserMedia() instead of live camera input.
OPTIONS+=" --use-fake-device-for-media-stream"
# avoids the need to grant camera/microphone permissions.
OPTIONS+=" --use-fake-ui-for-media-stream"

OPTIONS+=" --use-file-for-fake-video-capture=/Users/nano/Downloads/TV-20210110-2026-5800.websm.mjpeg"
OPTIONS+=" --use-file-for-fake-audio-capture=/Users/nano/Downloads/TV-20210110-2026-5800.websm.wav"

OPTIONS+=" --use-file-for-fake-video-capture=/Users/nano/MyDrive/videos/talking-women.mjpeg"
OPTIONS+=" --use-file-for-fake-video-capture=/Users/nano/MyDrive/videos/tagesschau-women.mjpeg"
OPTIONS+=" --use-file-for-fake-video-capture=/Users/nano/MyDrive/videos/schulze.mjpeg"
OPTIONS+=" --use-file-for-fake-video-capture=/Users/nano/MyDrive/videos/Kirsten.mjpeg"
OPTIONS+=" --use-file-for-fake-video-capture=/Users/nano/MyDrive/videos/Merkel23-720.mjpeg"
OPTIONS+=" --use-file-for-fake-video-capture=/Users/nano/MyDrive/videos/Sanna1.mjpeg"
OPTIONS+=" --use-file-for-fake-video-capture=/Users/nano/MyDrive/videos/merkel.mjpeg"
OPTIONS+=" --use-file-for-fake-video-capture=/Users/nano/MyDrive/videos/SannaAngela.mjpeg"

OPTIONS+=" --webrtc-event-logging=/tmp/webrtc.log"
# log/debug
OPTIONS+=" --console --no-first-run --enable-logging --v=1 --vmodule=*source*/talk/*=3 --vmodule=*third_party/libjingle/*=3,*=0"

echo Starting $CHROME 
echo $OPTIONS 
"$CHROME" $OPTIONS $1 $2 $3

