@echo off
echo This command line starts chrome in local file access mode (security restriction off)
echo Script by Oliver Lietz, lietz@nanocosmos.de

REM set path to html file
rem set FILE="%CD%\index.html"
set FILE="https://webrtc.nanocosmos.de/test/h264/1/chat.html?&serverusername=nano&serverpassword=nano&room=h264-1&debug=1&username=ol1&apikey=ecc91d20-884e-4aae-bcc8-11aa37c73377&videocodec=H264"

set OPTIONS=--allow-file-access-from-files --disable-web-security --user-data-dir=%TEMP%\chromecanaryuser2
set OPTIONS=--use-fake-ui-for-media-stream
set OPTIONS=--enable-features=WebRTC-H264WithOpenH264FFmpeg %OPTIONS%

REM set the path to your chrome.exe 
rem SET CHROME="%LOCALAPPDATA%\Google\Chrome SxS\Application\chrome.exe"
SET CHROME=C:\Users\oliet_000\AppData\Local\Google\Chrome SxS\Application\chrome.exe
if exist "%CHROME%" goto ok
goto err
:ok

"%CHROME%" %OPTIONS% %FILE%

goto end
:err
echo.
echo Chrome.exe not found. Please install or set the path in this script
pause
:end
