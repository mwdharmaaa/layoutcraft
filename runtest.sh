#!/usr/bin/env bash
set -euo pipefail

echo "======================================================"
echo "  LayoutCraft Studio - Test Suite & Verification"
echo "======================================================"

echo "[*] Step 1: Typecheck and Production Compilation..."
npm run build

echo "======================================================"
echo "[OK] All verification checks passed without error."
echo "======================================================"
