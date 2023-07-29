@echo off
set typescriptIndexPath=%~dp0
echo %typescriptIndexPath%
cd /d %typescriptIndexPath% & node prod/index.js
exit 0