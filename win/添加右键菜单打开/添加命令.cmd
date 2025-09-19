@REM ----------------------------------------------------------------------------
@REM 添加命令到右键
@REM ----------------------------------------------------------------------------

@echo off

set bin_path = "" 

@REM ----------------------------------------------------------------------------
@REM 　　HKCR： HKEY_CLASSES_ROOT
@REM 　　HKCU： HKEY_CURRENT_USER
@REM 　　HKLM： HKEY_LOCAL_MACHINE
@REM 　　HKU： HKEY_USERS
@REM 　　HKCC： HKEY_CURRENT_CONFIG
@REM ----------------------------------------------------------------------------
reg add HKCR\*\shell\VSCode /d VSCode 
reg add HKCR\*\shell\VSCode /v Icon /d "D:\Program Files\VSCode\Code.exe"
reg add HKCR\*\shell\VSCode\command /d "D:\Program Files\VSCode\Code.exe %1"

reg add HKCR\Directory\shell\VSCode /d VSCode
