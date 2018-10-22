rem ffmpeg script: create h264-mp4
rem 2011, lietz@nanocosmos.de

rem input/output files
set input="scene-cut.avi"
set output="scene-cut.mp4"

rem length in seconds (optional)
rem set timelength=-t 10

set ffmpeg="C:\Users\nano\Dropbox\Beuth\Beuth MTV 2012 public\software\ffmpeg-win32\bin\ffmpeg.exe"
rem set ffmpeg="..\..\..\..\Beuth MTV 2012 public\software\ffmpeg-win32\bin\ffmpeg.exe"
rem set ffmpeg="bin\ffmpeg.exe"

%ffmpeg% %timelength% -threads 4 -i %input% -vcodec libx264 -profile:v main -level 3 -b:v 500k %output%

goto end

:end
pause
