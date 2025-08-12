#!/bin/bash

# This script helps refresh the editor state by closing all tabs
# and reopening only the files that actually exist

echo "This script will help refresh your editor state."
echo "Please follow these steps:"
echo ""
echo "1. Close all open tabs in your editor"
echo "2. Open only these files that actually exist:"
echo "   - packages/web/package.json"
echo "   - packages/web/vite.config.ts"
echo "   - packages/web/.env"
echo "   - packages/web/.env.example"
echo "   - packages/web/README.md"
echo "   - packages/web/API_INTEGRATION.md"
echo "   - packages/web/start-dev.sh"
echo ""
echo "The API files that were showing in your tabs have been deleted from the file system"
echo "but were still cached in your editor's state."