Workspace Ops Guide

Overview
This repository includes unified scripts to manage Docker Compose stacks and Kubernetes manifests. Use the root npm scripts or call scripts/ops.sh directly.

Prerequisites
- Docker Desktop or Docker Engine + Compose v2
- kubectl and a configured K8s context (for k8s commands)

Ports and Services
- Postgres: 5432 (docker)
- API: 3001 (docker)
- Web: 5173 (docker)
- Coffee-shop-ops: 3000 (docker)
- K8s services expose the same target ports inside the cluster (ClusterIP)

Docker (Compose)
- Default stack (docker-compose.yml):
  - npm run docker:up
  - npm run docker:down
  - npm run docker:build
  - npm run docker:logs

- Dev stack override (docker-compose.dev.yml):
  - npm run docker:dev:up
  - npm run docker:dev:down

- Use local host DB for containers (docker-compose.local-db.yml):
  - npm run docker:localdb:up
  - npm run docker:localdb:down

Direct ops.sh usage:
- bash scripts/ops.sh docker up [--dev|--local-db]
- bash scripts/ops.sh docker down [--dev|--local-db]
- bash scripts/ops.sh docker build [--dev|--local-db]
- bash scripts/ops.sh docker logs [--dev|--local-db]

Environment notes:
- API and coffee-shop-ops containers use DATABASE_URL configured in compose.
- Web container uses VITE_API_BASE_URL for its API base URL (HTTP to API container).
- For local development (outside Docker), packages/web/.env.local should set DATABASE_URL as needed for Prisma.

Kubernetes
Namespace:
- Defined in k8s/namespace.yaml (default: coffee-shop)

Apply/delete:
- npm run k8s:apply     # create/update namespace and all resources
- npm run k8s:delete    # delete app resources (namespace stays)
- npm run k8s:status    # list pods, services, ingress

Direct ops.sh usage:
- bash scripts/ops.sh k8s apply
- bash scripts/ops.sh k8s delete
- bash scripts/ops.sh k8s status

Manifests:
- k8s/postgres.yaml: Postgres Deployment + Service
- k8s/api.yaml: API Deployment + Service + Ingress
- k8s/web.yaml: Web Deployment + Service + Ingress
- k8s/coffee-shop-ops.yaml: Ops Deployment + PVC + Service + Ingress

Tips
- Ensure your kubectl context points to the right cluster before k8s:apply.
- For Compose v2, scripts auto-detect docker compose; otherwise fall back to docker-compose.
- To change namespace, edit k8s/namespace.yaml or export NAMESPACE before running scripts.