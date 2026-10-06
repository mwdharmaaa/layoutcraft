#!/usr/bin/env bash
set -euo pipefail

echo "======================================================"
echo "  LayoutCraft Studio - Test Suite & Verification"
echo "======================================================"

echo "[*] Step 1: Code Linting..."
npm run lint

echo "[*] Step 2: Production Compilation..."
npm run build

echo "======================================================"
echo "[OK] All verification checks passed without error."
echo "======================================================"
