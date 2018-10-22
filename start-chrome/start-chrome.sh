#!/bin/sh
#call chrome on MacOS
if [[ "$OSTYPE" == "darwin"* ]]; then
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
else
CHROME=google-chrome
fi
OPTIONS=--allow-file-access-from-files
"$CHROME" $OPTIONS
