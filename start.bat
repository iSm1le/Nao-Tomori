@echo off
cd %~dp0
title Auto restart Nao Tomori
set _checkup=node.exe
:st
tasklist /FI "IMAGENAME eq %_checkup%" 2>NUL | find /I /N "%_checkup%">NUL
if "%ERRORLEVEL%"=="0" (echo [%DATE% - %TIME%] Up and running!) else (echo [%DATE% - %TIME%] ------------------------- Restarting! & start "Nao Tomori" node .)
TIMEOUT /T 60 /NOBREAK >nul
goto st