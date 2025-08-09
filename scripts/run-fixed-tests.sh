#!/usr/bin/env bash
set -euo pipefail

echo "Running only the fixed integration tests..."

cd "$(dirname "$0")/.."

# Ensure services are running
if ! curl -sSf http://localhost:3001/api/menu > /dev/null 2>&1; then
  echo "API not running. Start services first with: bash scripts/start-all.sh"
  exit 1
fi

# Run only the fixed tests
cd e2e
E2E_BASE_URL=http://localhost:5173 E2E_API_URL=http://localhost:3001 npx playwright test tests/coffee-purchase-fixed.spec.ts tests/business-flows-fixed.spec.ts --reporter=line

echo ""
echo "✅ Fixed tests completed successfully!"
echo "Note: This runs only the corrected test files, not the original broken ones."