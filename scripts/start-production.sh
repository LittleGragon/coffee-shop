#!/bin/bash

# Coffee Shop Buddy - Start Production Services Script
# This script starts all services in production mode with Docker Compose

set -e

echo "🚀 Starting Coffee Shop Buddy Services (Production Mode)..."

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

# Build and start services in production mode
echo "🏗️  Building and starting services in production mode..."
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 15

# Check service health
echo "🔍 Checking service health..."

# Check PostgreSQL
echo "  - Checking PostgreSQL..."
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
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
echo "🎉 Production services are running!"
echo ""
echo "📋 Service URLs:"
echo "  🌐 Web Frontend:        http://localhost:5173"
echo "  🔧 API Backend:         http://localhost:3001"
echo "  ⚙️  Coffee Shop Ops:     http://localhost:3000"
echo "  🗄️  PostgreSQL:          localhost:5432"
echo ""
echo "📝 Useful commands:"
echo "  📊 View logs:           docker-compose logs -f"
echo "  🛑 Stop services:       docker-compose down"
echo "  🔄 Restart services:    docker-compose restart"
echo "  🧹 Clean up:           docker-compose down -v"
echo ""