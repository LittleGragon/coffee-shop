#!/bin/bash

# Coffee Shop Buddy - Start All Services Script
# This script starts all services with Docker Compose

set -e

echo "🚀 Starting Coffee Shop Buddy Services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p packages/coffee-shop-ops/public/uploads

# Start services in development mode
echo "🔧 Starting services in development mode..."
docker-compose -f docker-compose.dev.yml up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check PostgreSQL
echo "  - Checking PostgreSQL..."
if docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "    ✅ PostgreSQL is ready"
else
    echo "    ⚠️  PostgreSQL is not ready yet"
fi

# Check API service
echo "  - Checking API service..."
if curl -f http://localhost:3001/api/member > /dev/null 2>&1; then
    echo "    ✅ API service is ready"
else
    echo "    ⚠️  API service is not ready yet"
fi

# Check Web service
echo "  - Checking Web service..."
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo "    ✅ Web service is ready"
else
    echo "    ⚠️  Web service is not ready yet"
fi

# Check Coffee Shop Ops service
echo "  - Checking Coffee Shop Ops service..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "    ✅ Coffee Shop Ops service is ready"
else
    echo "    ⚠️  Coffee Shop Ops service is not ready yet"
fi

echo ""
echo "🎉 All services are starting up!"
echo ""
echo "📋 Service URLs:"
echo "  🌐 Web Frontend:        http://localhost:5173"
echo "  🔧 API Backend:         http://localhost:3001"
echo "  ⚙️  Coffee Shop Ops:     http://localhost:3000"
echo "  🗄️  PostgreSQL:          localhost:5432"
echo ""
echo "📝 Useful commands:"
echo "  📊 View logs:           docker-compose -f docker-compose.dev.yml logs -f"
echo "  🛑 Stop services:       docker-compose -f docker-compose.dev.yml down"
echo "  🔄 Restart services:    docker-compose -f docker-compose.dev.yml restart"
echo "  🧹 Clean up:           docker-compose -f docker-compose.dev.yml down -v"
echo ""