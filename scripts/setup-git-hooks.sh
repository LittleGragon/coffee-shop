#!/usr/bin/env bash
set -euo pipefail

echo "Setting up Git hooks..."

# Create .githooks directory if it doesn't exist
mkdir -p .githooks

# Set Git to use our custom hooks directory
git config core.hooksPath .githooks

# Make sure the pre-push hook is executable
chmod +x .githooks/pre-push

echo "✅ Git hooks configured successfully!"
echo ""
echo "The pre-push hook will now:"
echo "  • Automatically start services if not running"
echo "  • Run integration tests before each push"
echo "  • Block the push if any tests fail"
echo ""
echo "To test the hook manually:"
echo "  git push --dry-run"
echo ""
echo "To bypass the hook (emergency only):"
echo "  git push --no-verify"