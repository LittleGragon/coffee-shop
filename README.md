# Coffee Shop Buddy

A comprehensive coffee shop management system with multiple services including customer frontend, API backend, and operations management interface.

## 🏗️ Architecture

This project consists of three main services:

- **Web Frontend** (`packages/web`): Customer-facing React application with Vite
- **API Backend** (`packages/api`): Next.js API service for data operations
- **Coffee Shop Ops** (`packages/coffee-shop-ops`): Management interface with Next.js and Material UI

## 🚀 Quick Start

### One-Command Startup (Development)

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Start all services in development mode
./scripts/start-all.sh
```

This will start:
- 🌐 Web Frontend: http://localhost:5173
- 🔧 API Backend: http://localhost:3001
- ⚙️ Coffee Shop Ops: http://localhost:3000
- 🗄️ PostgreSQL: localhost:5432

### One-Command Startup (Production)

```bash
# Start all services in production mode
./scripts/start-production.sh
```

### Stop All Services

```bash
# Stop all running services
./scripts/stop-all.sh
```

## 🐳 Docker Deployment

### 🇨🇳 中国用户加速配置 (For Users in China)

为了加速 Docker 镜像拉取，建议先配置 USTC 镜像源：

```bash
# 一键配置 USTC 镜像源
./scripts/configure-docker-mirror.sh
```

详细配置说明请参考：[Docker 镜像源配置指南](DOCKER_MIRROR_SETUP.md)

### Development Mode
```bash
# Start with hot reloading
docker-compose -f docker-compose.dev.yml up --build
```

### Production Mode
```bash
# Start optimized production build
docker-compose up --build
```

### Clean Up
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v
```

## ☸️ Kubernetes Deployment

### Prerequisites
- kubectl installed and configured
- Kubernetes cluster running
- NGINX Ingress Controller (for ingress)

### Deploy to Kubernetes
```bash
# Deploy all services to Kubernetes
./scripts/deploy-k8s.sh
```

### Access Services
Add these entries to your `/etc/hosts` file:
```
127.0.0.1 coffee-shop.local
127.0.0.1 api.coffee-shop.local
127.0.0.1 ops.coffee-shop.local
```

Then access:
- Web Frontend: http://coffee-shop.local
- API Backend: http://api.coffee-shop.local
- Coffee Shop Ops: http://ops.coffee-shop.local

### Kubernetes Management
```bash
# View all pods
kubectl get pods -n coffee-shop

# View services
kubectl get services -n coffee-shop

# View logs
kubectl logs -f deployment/coffee-shop-api -n coffee-shop

# Delete deployment
kubectl delete namespace coffee-shop
```

## 🛠️ Manual Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL
- npm or yarn

### Setup Each Service

#### 1. Database Setup
```bash
# Start PostgreSQL (using Docker)
docker run --name coffee-shop-postgres \
  -e POSTGRES_DB=coffee_shop_buddy \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine
```

#### 2. API Backend
```bash
cd packages/api
npm install
npm run dev  # Runs on http://localhost:3001
```

#### 3. Web Frontend
```bash
cd packages/web
npm install
npm run dev  # Runs on http://localhost:5173
```

#### 4. Coffee Shop Operations
```bash
cd packages/coffee-shop-ops
npm install
npm run dev  # Runs on http://localhost:3000
```

## 📁 Project Structure

```
coffee-shop-buddy/
├── packages/
│   ├── web/                    # Customer frontend (React + Vite)
│   ├── api/                    # API backend (Next.js)
│   └── coffee-shop-ops/        # Operations management (Next.js + MUI)
├── k8s/                        # Kubernetes configurations
├── scripts/                    # Deployment scripts
├── docker-compose.yml          # Production Docker Compose
├── docker-compose.dev.yml      # Development Docker Compose
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Web Frontend (`packages/web/.env.development`)
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_USE_MOCK_DATA=false
```

#### API Backend
```env
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/coffee_shop_buddy
```

#### Coffee Shop Ops
```env
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/coffee_shop_buddy
```

## 🧪 Testing

```bash
# Run tests for API service
cd packages/api
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 Monitoring

### Docker Compose Logs
```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f web
docker-compose logs -f api
docker-compose logs -f coffee-shop-ops
```

### Kubernetes Logs
```bash
# View pod logs
kubectl logs -f deployment/coffee-shop-web -n coffee-shop
kubectl logs -f deployment/coffee-shop-api -n coffee-shop
kubectl logs -f deployment/coffee-shop-ops -n coffee-shop
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 3001, 5173, and 5432 are available
2. **Database connection**: Ensure PostgreSQL is running and accessible
3. **Docker issues**: Try `docker system prune` to clean up Docker resources
4. **Permission issues**: Make sure scripts are executable with `chmod +x scripts/*.sh`

### Health Checks

```bash
# Check if services are responding
curl http://localhost:5173        # Web Frontend
curl http://localhost:3001/api/member  # API Backend
curl http://localhost:3000        # Coffee Shop Ops
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.