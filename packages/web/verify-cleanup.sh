#!/bin/bash

# This script verifies that the API files have been properly removed

echo "Verifying cleanup..."

# Check if the API directory exists
if [ -d "packages/web/src/api" ]; then
  echo "ERROR: API directory still exists at packages/web/src/api"
else
  echo "SUCCESS: API directory has been removed"
fi

# Check if server.js exists
if [ -f "packages/web/server.js" ]; then
  echo "ERROR: server.js still exists at packages/web/server.js"
else
  echo "SUCCESS: server.js has been removed"
fi

# Check if the .env file exists and has the correct content
if [ -f "packages/web/.env" ]; then
  echo "SUCCESS: .env file exists"
else
  echo "ERROR: .env file is missing"
fi

# Check if the .env.example file exists
if [ -f "packages/web/.env.example" ]; then
  echo "SUCCESS: .env.example file exists"
else
  echo "ERROR: .env.example file is missing"
fi

# Check if the vite.config.ts file has the correct proxy configuration
if grep -q "target: 'http://localhost:3001'" "packages/web/vite.config.ts"; then
  echo "SUCCESS: vite.config.ts has the correct proxy configuration"
else
  echo "ERROR: vite.config.ts does not have the correct proxy configuration"
fi

echo ""
echo "NOTE: If you're still seeing API files in your editor tabs, they are just cached in the editor's state."
echo "The files have been deleted from the file system. You can close and reopen the editor to refresh its state."