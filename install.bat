@echo off
setlocal EnableDelayedExpansion

:: --- Configuration ---
set APP_NAME=PrepareProj
set EXE_NAME=prepareProj.exe
set INSTALL_DIR=C:\Tools\%APP_NAME%

:: --- Check for Admin Rights ---
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo ======================================================
    echo  ERROR: Please right-click this script and select
    echo         'Run as administrator' to modify the system PATH.
    echo ======================================================
    pause
    goto :eof
)

echo Installing %APP_NAME% to %INSTALL_DIR%...

:: --- Create Directory ---
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
    if errorlevel 1 (
        echo ERROR: Could not create directory: %INSTALL_DIR%
        pause
        goto :eof
    )
    echo Created directory: %INSTALL_DIR%
) else (
    echo Directory already exists: %INSTALL_DIR%
)

:: --- Copy Executable ---
echo Copying %EXE_NAME%...
copy /Y "%~dp0%EXE_NAME%" "%INSTALL_DIR%\" > nul
if errorlevel 1 (
    echo ERROR: Could not copy %EXE_NAME% to %INSTALL_DIR%
    echo Make sure %EXE_NAME% is in the same folder as this script.
    pause
    goto :eof
)

:: --- Add to System PATH using SETX (More Robust Check) ---
echo Checking system PATH for %INSTALL_DIR%...

set "TARGET_PATH=%INSTALL_DIR%"
set "PATH_PRESENT=0"

:: Read the current system PATH into a variable
:: This REG QUERY approach is generally safer than relying on %PATH%
for /F "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do (
    set "CURRENT_SYS_PATH=%%B"
)

:: Check if the variable was set (registry key exists)
if not defined CURRENT_SYS_PATH (
    echo WARNING: Could not read current system PATH from registry.
    echo Attempting to set PATH anyway, but existing entries might be lost if key was missing.
    set "CURRENT_SYS_PATH="
)

:: Use delayed expansion to safely check the path components
set "TEMP_PATH=;!CURRENT_SYS_PATH!;"
echo "!TEMP_PATH!" | findstr /I /C:";%TARGET_PATH%;" > nul
if !errorlevel! == 0 (
    echo Path already contains %TARGET_PATH%. Skipping update.
    set "PATH_PRESENT=1"
)

:: Only update if not already present
if !PATH_PRESENT! == 0 (
    echo Adding %INSTALL_DIR% to system PATH...
    echo (This may take a moment and might show a 'SUCCESS' message)

    :: Use SETX to modify the persistent PATH. /M for system path.
    setx PATH "!CURRENT_SYS_PATH!;%TARGET_PATH%" /M

    if !errorlevel! neq 0 (
        echo ERROR: Failed to modify system PATH using SETX. Exit code: !errorlevel!
        echo You may need to add "%INSTALL_DIR%" to your PATH manually.
        pause
        goto :eof
    ) else (
        echo Successfully requested PATH update.
    )
)

echo ======================================================
echo  %APP_NAME% installation process finished.
echo.
echo  IMPORTANT: You MUST close and re-open any command
echo             prompt windows for the PATH change to
echo             take effect!
echo ======================================================
pause
endlocal