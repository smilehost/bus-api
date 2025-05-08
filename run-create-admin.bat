@echo off
SETLOCAL ENABLEEXTENSIONS

:: แสดงวิธีใช้เมื่อใส่ -h หรือ --help
IF "%1"=="-h" GOTO SHOW_HELP
IF "%1"=="--help" GOTO SHOW_HELP

:: ตรวจสอบ arguments
IF "%3"=="" (
    echo ❌ Error: Missing arguments.
    echo Run '%~nx0 -h' for help.
    EXIT /B 1
)

:: รับ arguments
SET COMID=%1
SET USERNAME=%2
SET NAME=%3

:: รันคำสั่ง
npm run cli -- create-admin --comid=%COMID% --username=%USERNAME% --name=%NAME%
GOTO END

:SHOW_HELP
echo.
echo 🛠️  Usage: %~nx0 ^<comid^> ^<username^> ^<name^>
echo.
echo Example:
echo   %~nx0 1 admin56 som
echo.
GOTO END

:END
ENDLOCAL