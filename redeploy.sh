#!/usr/bin/env bash
set -euo pipefail

echo "======================================================"
echo "  LayoutCraft Studio - Redeployment Pipeline"
echo "======================================================"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "devv")

echo "[*] Active branch: $CURRENT_BRANCH"
echo "[*] Discarding local untracked changes..."
git reset --hard HEAD
git clean -fd

echo "[*] Pulling latest updates from origin..."
git pull origin "$CURRENT_BRANCH" || echo "[!] Remote pull skipped or branch is local."

echo "[*] Handing over execution to deploy.sh..."
bash deploy.sh
