if not exist build.txt echo 100 > build.txt
set /P NBUILD= < build.txt
set /A NBUILD= NBUILD + 1
echo %NBUILD% > build.txt
set BUILD=13X%NBUILD%
make -j5 -f %1 %2 %3 %4
