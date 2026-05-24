@echo off
echo ====================================
echo Stopping CelebrationHub Services
echo Using Podman
echo ====================================
echo.

podman stop celebrationhub-mongo celebrationhub-redis celebrationhub-minio

echo.
echo ====================================
echo Services Stopped!
echo ====================================
echo.
echo To remove containers completely:
echo   podman rm celebrationhub-mongo celebrationhub-redis celebrationhub-minio
echo.
pause
