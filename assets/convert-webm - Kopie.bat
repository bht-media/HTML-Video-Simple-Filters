rem ffmpeg script: create webm
rem 2012, lietz@nanocosmos.de
@echo off

rem input/output files
set input="blue_screen.mp4"
set output="blue_screen1.mp4"

rem length in seconds (optional)
rem set timelength=-t 10

set dropbox_folder=%USERPROFILE%\Dropbox\Beuth\Beuth MTV\MTV Public
set ffmpeg="%dropbox_folder%\software\ffmpeg-win32\bin\ffmpeg.exe"
rem set ffmpeg="bin\ffmpeg.exe"

echo Converting %input% to %output%
if not exist %ffmpeg% goto err

%ffmpeg% %timelength% -threads 4 -i %input% -b:v 1000k %output%

goto end

:err
echo ffmpeg not found: %ffmpeg%

:end
pause
