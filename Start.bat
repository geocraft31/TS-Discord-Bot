@echo off
set typescriptIndexPath=%~dp0
cmd /k "cd /d %typescriptIndexPath% & node prod/index.js"
