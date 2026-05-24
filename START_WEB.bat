@echo off
title CelebrationHub - Web App
cd /d "%~dp0web"
echo ========================================
echo   CelebrationHub Web Application
echo ========================================
echo.
echo Starting web app on http://localhost:5173
echo.
npm run dev
pause
