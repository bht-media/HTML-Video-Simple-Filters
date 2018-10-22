@echo off
set dropbox_folder=%USERPROFILE%\Dropbox\Beuth\Beuth MTV\MTV Public
set file_in="%dropbox_folder%\Videos\fussball-xvid.avi"
set file_out=fussball-crop.mp4
echo converting %file_in% to %file_out% 
pause

set ffmpeg="%dropbox_folder%\software\ffmpeg-win32\bin\ffmpeg.exe"
set options=-vf "crop=640:360:0:60"

set ffmpegcommand=%ffmpeg% -i %file_in% -b:v 800000 %options% %file_out%

echo command: %ffmpegcommand%

%ffmpegcommand%

pause

