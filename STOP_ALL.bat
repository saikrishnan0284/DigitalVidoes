@echo off
echo Stopping CelebrationHub...
echo.

echo Stopping Docker services...
docker-compose down
echo.

echo Docker services stopped!
echo.
echo Note: Backend, Web, and Mobile processes need to be stopped manually
echo by closing their terminal windows or pressing Ctrl+C
echo.
pause
