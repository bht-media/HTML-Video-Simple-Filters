REM This command line starts chrome in local file access mode (security restriction off)
REM Script by Oliver Lietz, lietz@nanocosmos.de

set file=scene-detect

REM set the path to your chrome.exe 
SET CHROME="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" goto ok
SET CHROME="%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if exist %CHROME% goto ok
goto err
:ok
%CHROME% --allow-file-access-from-files "%CD%\%file%.html"
goto end
:err
echo.
echo Chrome.exe not found. Please install or set the path in this script
pause
:end
