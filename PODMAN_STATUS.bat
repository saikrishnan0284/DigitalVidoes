@echo off
echo ====================================
echo CelebrationHub Services Status
echo Using Podman
echo ====================================
echo.

podman ps -a --filter "name=celebrationhub" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo ====================================
echo Quick Commands:
echo ====================================
echo Start:   START_PODMAN_SERVICES.bat
echo Stop:    STOP_PODMAN_SERVICES.bat
echo Logs:    podman logs celebrationhub-mongo
echo ====================================
pause
