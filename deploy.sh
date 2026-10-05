#!/usr/bin/env bash
set -euo pipefail

echo "======================================================"
echo "  LayoutCraft Studio - Automated Deployment"
echo "======================================================"

echo "[*] Verifying Docker daemon status..."
if ! docker info > /dev/null 2>&1; then
  echo "[!] Docker daemon is not running or not accessible."
  echo "[*] Falling back to local Node.js production preview mode..."
  if command -v npm > /dev/null 2>&1; then
    npm run build
    echo "[OK] Build completed successfully."
    echo "[*] Starting local preview on port 4173..."
    npm run preview -- --port 4173 --host
    exit 0
  else
    echo "[x] Neither Docker nor Node.js runtime is available."
    exit 1
  fi
fi

echo "[*] Building and launching containerized service..."
docker compose down --remove-orphans || true
docker compose up -d --build

echo "[*] Polling container health status..."
CONTAINER_NAME="layoutcraft-web"
MAX_ATTEMPTS=20
ATTEMPT=0

until [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; do
  STATUS=$(docker inspect --format='{{json .State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo '"starting"')
  if [ "$STATUS" = '"healthy"' ]; then
    echo "[OK] Container is healthy and accepting traffic."
    break
  fi
  ATTEMPT=$((ATTEMPT + 1))
  sleep 2
done

if [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
  echo "[!] Container did not report healthy in time. Printing logs:"
  docker logs "$CONTAINER_NAME" --tail 20
fi

echo "======================================================"
echo "[OK] Deployment complete."
echo "     Access URL: http://localhost:3000"
echo "======================================================"
