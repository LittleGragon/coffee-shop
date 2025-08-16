#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_MAIN="docker-compose.yml"
COMPOSE_DEV="docker-compose.dev.yml"
COMPOSE_LOCAL_DB="docker-compose.local-db.yml"
K8S_NAMESPACE_FILE="k8s/namespace.yaml"

usage() {
  cat <<'EOF'
ops.sh - Workspace operations for Docker and Kubernetes

Usage:
  ./scripts/ops.sh docker up [--dev|--local-db]    Start stack
  ./scripts/ops.sh docker down [--dev|--local-db]  Stop stack
  ./scripts/ops.sh docker build [--dev|--local-db] Build images
  ./scripts/ops.sh docker logs [--dev|--local-db]  Tail logs

  ./scripts/ops.sh k8s apply     Apply k8s manifests to namespace
  ./scripts/ops.sh k8s delete    Delete k8s resources (keep namespace)
  ./scripts/ops.sh k8s status    Show pods/services/ingresses in namespace

Options:
  --dev         Use docker-compose.dev.yml
  --local-db    Use docker-compose.local-db.yml
Env:
  NAMESPACE (default: value from k8s/namespace.yaml, or coffee-shop)
EOF
}

ensure_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Required command '$1' not found in PATH"; exit 127; }
}

select_compose() {
  local file="$COMPOSE_MAIN"
  case "${1:-}" in
    --dev) file="$COMPOSE_DEV" ;;
    --local-db) file="$COMPOSE_LOCAL_DB" ;;
    "" ) file="$COMPOSE_MAIN" ;;
    *) echo "Unknown option: $1"; usage; exit 2 ;;
  esac
  if [ ! -f "$file" ]; then
    echo "Compose file not found: $file"
    exit 1
  fi
  echo "$file"
}

parse_namespace() {
  if [ -n "${NAMESPACE:-}" ]; then
    echo "$NAMESPACE"
    return
  fi
  if [ -f "$K8S_NAMESPACE_FILE" ]; then
    # naive YAML parse: grab 'name:' under metadata
    local ns
    ns="$(awk '/kind:\s*Namespace/{f=1} f&&/name:/{print $2; exit}' "$K8S_NAMESPACE_FILE")"
    if [ -n "$ns" ]; then
      echo "$ns"
      return
    fi
  fi
  echo "coffee-shop"
}

docker_cmd() {
  ensure_cmd docker
  ensure_cmd docker-compose || true # prefer compose v2
  ensure_cmd bash

  local action="${1:-}"; shift || true
  local mode="${1:-}"; shift || true
  local compose_file
  compose_file="$(select_compose "${mode:-}")"

  # Prefer docker compose v2
  if docker compose version >/dev/null 2>&1; then
    DC="docker compose -f $compose_file"
  else
    DC="docker-compose -f $compose_file"
  fi

  case "$action" in
    up)
      $DC up -d
      ;;
    down)
      $DC down
      ;;
    build)
      $DC build
      ;;
    logs)
      $DC logs -f
      ;;
    *)
      echo "Unknown docker action: $action"
      usage
      exit 2
      ;;
  esac
}

k8s_cmd() {
  ensure_cmd kubectl
  local action="${1:-}"; shift || true
  local ns
  ns="$(parse_namespace)"

  case "$action" in
    apply)
      kubectl get ns "$ns" >/dev/null 2>&1 || kubectl apply -f "$K8S_NAMESPACE_FILE"
      kubectl -n "$ns" apply -f k8s/postgres.yaml
      kubectl -n "$ns" apply -f k8s/api.yaml
      kubectl -n "$ns" apply -f k8s/web.yaml
      kubectl -n "$ns" apply -f k8s/coffee-shop-ops.yaml
      ;;
    delete)
      kubectl -n "$ns" delete -f k8s/coffee-shop-ops.yaml --ignore-not-found
      kubectl -n "$ns" delete -f k8s/web.yaml --ignore-not-found
      kubectl -n "$ns" delete -f k8s/api.yaml --ignore-not-found
      kubectl -n "$ns" delete -f k8s/postgres.yaml --ignore-not-found
      ;;
    status)
      echo "Namespace: $ns"
      kubectl -n "$ns" get pods
      echo
      kubectl -n "$ns" get svc
      echo
      kubectl -n "$ns" get ingress || true
      ;;
    *)
      echo "Unknown k8s action: $action"
      usage
      exit 2
      ;;
  esac
}

main() {
  case "${1:-}" in
    docker)
      shift
      docker_cmd "$@"
      ;;
    k8s)
      shift
      k8s_cmd "$@"
      ;;
    -h|--help|"")
      usage
      ;;
    *)
      echo "Unknown command: $1"
      usage
      exit 2
      ;;
  esac
}

main "$@"