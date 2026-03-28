#!/bin/bash

# MultiClaw Quick Setup Script
# Usage: ./scripts/setup/install.sh

set -e

echo "=== MultiClaw Setup ==="
echo ""

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "[ERROR] Node.js 18+ required, current: $(node --version)"
    exit 1
fi
echo "[OK] Node.js version: $(node --version)"

# Install dependencies
echo ""
echo "=== Installing Dependencies ==="

if command -v pnpm &> /dev/null; then
    pnpm install
elif command -v npm &> /dev/null; then
    npm install
else
    echo "[ERROR] No package manager found"
    exit 1
fi

echo "[OK] Dependencies installed"

# Setup environment file
echo ""
echo "=== Setting Up Environment ==="

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "[OK] Created .env from .env.example"
        echo ""
        echo "Please edit .env and configure the following:"
        echo "  - OPENCLAW_API_KEY"
        echo "  - FEISHU_APP_ID (optional)"
        echo "  - FEISHU_APP_SECRET (optional)"
        echo "  - FEISHU_CHAT_ID (optional)"
    else
        echo "[ERROR] .env.example not found"
        exit 1
    fi
else
    echo "[OK] .env already exists"
fi

# Build project
echo ""
echo "=== Building Project ==="

if command -v pnpm &> /dev/null; then
    pnpm build
else
    npm run build
fi

echo "[OK] Build complete"

# Run health check
echo ""
echo "=== Running Health Check ==="

./scripts/verify/health-check.sh

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Edit .env with your real configuration"
echo "  2. Run: pnpm start"
echo "  3. Check logs for runtime status"