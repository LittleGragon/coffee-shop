#!/bin/bash

# Start the API server in the background
echo "Starting API server..."
cd ../api && npm run dev &
API_PID=$!

# Wait a moment for the API server to start
sleep 3

# Start the web server
echo "Starting web server..."
cd ../web && npm run dev

# When the web server is stopped, also stop the API server
kill $API_PID