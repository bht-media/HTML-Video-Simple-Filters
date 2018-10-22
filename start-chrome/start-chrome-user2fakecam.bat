@echo off
echo This command line starts chrome in local file access mode (security restriction off)
echo Script by Oliver Lietz, lietz@nanocosmos.de

REM set path to html file
set FILE="%CD%\color.html"

set OPTIONS=--allow-file-access-from-files --disable-web-security --use-fake-device-for-media-stream --use-fake-ui-for-media-stream --user-data-dir=%TEMP%\chromeuser2

REM set the path to your chrome.exe 
SET CHROME="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" goto ok
SET CHROME="%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if exist %CHROME% goto ok
goto err
:ok

%CHROME% %OPTIONS% %FILE%

goto end
:err
echo.
echo Chrome.exe not found. Please install or set the path in this script
pause
:end
