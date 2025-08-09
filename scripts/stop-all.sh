#!/bin/bash

# Coffee Shop Buddy - Stop All Services Script
# This script stops all running services

set -e

echo "🛑 Stopping Coffee Shop Buddy Services..."

# Stop Docker Compose services
if [ -f "docker-compose.dev.yml" ]; then
    echo "🔧 Stopping development services..."
    docker-compose -f docker-compose.dev.yml down
fi

if [ -f "docker-compose.yml" ]; then
    echo "🏭 Stopping production services..."
    docker-compose down
fi

echo ""
echo "✅ All services have been stopped!"
echo ""
echo "📝 To clean up completely (remove volumes and images):"
echo "  🧹 Clean dev:          docker-compose -f docker-compose.dev.yml down -v --rmi all"
echo "  🧹 Clean production:   docker-compose down -v --rmi all"
echo ""