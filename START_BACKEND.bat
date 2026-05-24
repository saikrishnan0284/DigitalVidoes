@echo off
title CelebrationHub - Backend Server
cd /d "%~dp0backend"
echo ========================================
echo   CelebrationHub Backend Server
echo ========================================
echo.
echo Starting backend on http://localhost:5000
echo.
npm run dev
pause
