#!/bin/bash

# MultiClaw Health Check Script
# Usage: ./scripts/verify/health-check.sh

set -e

PROJECT_ROOT="${PROJECT_ROOT:-$(pwd)}"
ENV_FILE="${PROJECT_ROOT}/.env"

echo "=== MultiClaw Health Check ==="
echo ""

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo "[ERROR] .env file not found at $ENV_FILE"
    echo "Please copy .env.example and configure it:"
    echo "  cp .env.example .env"
    exit 1
fi

echo "[OK] .env file exists"

# Check required environment variables
check_env() {
    local var_name="$1"
    local var_value=$(grep "^${var_name}=" "$ENV_FILE" | cut -d'=' -f2)

    if [ -z "$var_value" ]; then
        echo "[ERROR] $var_name is not set"
        return 1
    fi

    if [[ "$var_value" == "<"*">" ]]; then
        echo "[WARN] $var_name contains placeholder value"
        return 2
    fi

    echo "[OK] $var_name is set"
    return 0
}

echo ""
echo "=== Checking Required Variables ==="

check_env "OPENCLAW_API_KEY"
OPENCLAW_RESULT=$?

echo ""
echo "=== Checking Optional Variables ==="

if grep -q "^FEISHU_APP_ID=" "$ENV_FILE"; then
    check_env "FEISHU_APP_ID"
    check_env "FEISHU_APP_SECRET"
    check_env "FEISHU_CHAT_ID"
fi

echo ""
echo "=== Checking Dependencies ==="

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "[OK] Node.js installed: $NODE_VERSION"
else
    echo "[ERROR] Node.js not installed"
    exit 1
fi

# Check npm/pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo "[OK] pnpm installed: $PNPM_VERSION"
elif command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "[OK] npm installed: $NPM_VERSION"
else
    echo "[ERROR] npm/pnpm not installed"
    exit 1
fi

echo ""
echo "=== Checking Build ==="

if [ -d "${PROJECT_ROOT}/dist" ]; then
    echo "[OK] dist directory exists"
else
    echo "[WARN] dist directory not found, run: pnpm build"
fi

echo ""
echo "=== Summary ==="

if [ $OPENCLAW_RESULT -eq 0 ]; then
    echo "[PASS] Core configuration is ready"
else
    echo "[FAIL] Core configuration needs attention"
fi

echo ""
echo "To start MultiClaw:"
echo "  pnpm build"
echo "  pnpm start"