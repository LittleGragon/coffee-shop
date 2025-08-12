#!/bin/bash

# This script cleans up the project structure by removing any leftover API files
# and ensuring the correct files are in place

echo "Cleaning up project structure..."

# Remove any leftover API files
rm -rf packages/web/src/api 2>/dev/null

# Remove server.js if it exists
rm -f packages/web/server.js 2>/dev/null

# Make sure the .env and .env.example files exist
touch packages/web/.env
touch packages/web/.env.example

# Update .env file
cat > packages/web/.env << EOL
# API configuration
VITE_API_BASE_URL=/api

# Use mock data when API is unavailable
VITE_USE_MOCK_DATA=false
EOL

# Update .env.example file
cat > packages/web/.env.example << EOL
# API configuration
VITE_API_BASE_URL=/api

# Use mock data when API is unavailable
VITE_USE_MOCK_DATA=false
EOL

echo "Cleanup complete!"
echo ""
echo "Please close all editor tabs and reopen only these files:"
echo "- packages/web/package.json"
echo "- packages/web/vite.config.ts"
echo "- packages/web/.env"
echo "- packages/web/README.md"
echo "- packages/web/API_INTEGRATION.md"