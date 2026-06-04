#!/usr/bin/env bash
#
# One-shot local setup script. Run AFTER:
#   1. Moving this folder out of Dropbox to ~/code/schaeffer-portfolio
#   2. Filling in DATABASE_URI in .env (from neon.tech)
#
# Usage:
#   chmod +x setup.sh && ./setup.sh
#

set -e

echo "› Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org (need v20+)"
  exit 1
fi

NODE_MAJOR=$(node -v | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "❌ Node.js $(node -v) is too old. Need v20+."
  exit 1
fi
echo "✓ Node.js $(node -v)"

if ! command -v pnpm &> /dev/null; then
  echo "› pnpm not found, installing via npm..."
  npm install -g pnpm
fi
echo "✓ pnpm $(pnpm -v)"

echo ""
echo "› Checking .env..."

if [ ! -f .env ]; then
  echo "❌ .env file missing. Make sure you're in the schaeffer-portfolio folder."
  exit 1
fi

if grep -q "user:password@host.neon.tech" .env; then
  echo "⚠️  DATABASE_URI in .env is still the placeholder."
  echo "   Sign up at https://neon.tech, create a project, copy the pooled"
  echo "   connection string, paste it into .env, then re-run this script."
  exit 1
fi
echo "✓ .env looks configured"

echo ""
echo "› Installing dependencies (this takes a couple of minutes)..."
pnpm install

echo ""
echo "› Generating Payload types..."
pnpm payload generate:types || echo "  (skipped — DB not connected yet, normal on first run)"

echo ""
echo "› Generating admin import map..."
pnpm payload generate:importmap || true

echo ""
echo "╭──────────────────────────────────────────────────────────────╮"
echo "│  ✓ Setup complete!                                           │"
echo "│                                                              │"
echo "│  Next steps:                                                 │"
echo "│    pnpm dev          # start the dev server                  │"
echo "│                                                              │"
echo "│  Then open:                                                  │"
echo "│    http://localhost:3000          # frontend (empty for now) │"
echo "│    http://localhost:3000/admin    # Payload admin            │"
echo "│                                                              │"
echo "│  First visit to /admin will prompt you to create the         │"
echo "│  admin user. After that, create:                             │"
echo "│    - 1 Settings entry per brand                              │"
echo "│    - 1 Navigation entry per brand                            │"
echo "│    - 1 Footer entry per brand                                │"
echo "│    - A 'home' Page with brand=[personal]                     │"
echo "│                                                              │"
echo "│  See START-HERE.md for the full walkthrough.                 │"
echo "╰──────────────────────────────────────────────────────────────╯"
