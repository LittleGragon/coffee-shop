#!/bin/bash

# Coffee Shop Buddy - Kubernetes Deployment Script
# This script deploys all services to Kubernetes

set -e

echo "☸️  Deploying Coffee Shop Buddy to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl > /dev/null 2>&1; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if we can connect to Kubernetes cluster
if ! kubectl cluster-info > /dev/null 2>&1; then
    echo "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

# Build Docker images
echo "🏗️  Building Docker images..."
docker build -t coffee-shop-web:latest ./packages/web
docker build -t coffee-shop-api:latest ./packages/api
docker build -t coffee-shop-ops:latest ./packages/coffee-shop-ops

# Apply Kubernetes configurations
echo "📦 Applying Kubernetes configurations..."

# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy PostgreSQL
echo "  - Deploying PostgreSQL..."
kubectl apply -f k8s/postgres.yaml

# Wait for PostgreSQL to be ready
echo "  - Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n coffee-shop --timeout=300s

# Deploy API service
echo "  - Deploying API service..."
kubectl apply -f k8s/api.yaml

# Deploy Web service
echo "  - Deploying Web service..."
kubectl apply -f k8s/web.yaml

# Deploy Coffee Shop Ops service
echo "  - Deploying Coffee Shop Ops service..."
kubectl apply -f k8s/coffee-shop-ops.yaml

# Wait for all deployments to be ready
echo "⏳ Waiting for all deployments to be ready..."
kubectl wait --for=condition=available deployment --all -n coffee-shop --timeout=300s

# Get service information
echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Service Information:"
kubectl get services -n coffee-shop

echo ""
echo "🌐 Access URLs (add these to your /etc/hosts file):"
echo "  Web Frontend:        http://coffee-shop.local"
echo "  API Backend:         http://api.coffee-shop.local"
echo "  Coffee Shop Ops:     http://ops.coffee-shop.local"
echo ""
echo "📝 Useful commands:"
echo "  📊 View pods:           kubectl get pods -n coffee-shop"
echo "  📋 View services:       kubectl get services -n coffee-shop"
echo "  📊 View logs:           kubectl logs -f deployment/coffee-shop-api -n coffee-shop"
echo "  🛑 Delete deployment:   kubectl delete namespace coffee-shop"
echo ""