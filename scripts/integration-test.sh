#!/usr/bin/env bash
set -euo pipefail

# Lightweight integration test runner for Coffee Shop Buddy
# Usage:
#   bash scripts/integration-test.sh [--no-build] [--skip-tests] [--teardown] [--timeout SECONDS]
#
# Options:
#   --no-build    : don't pass --build to docker-compose up
#   --skip-tests  : skip running npm test in packages
#   --teardown    : run docker-compose down -v after tests finish
#   --timeout N   : wait timeout in seconds for services (default 60)

ROOT_DIR="$(cd "$(dirname "$0")/.."; pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.dev.yml"
COMPOSE="docker-compose -f $COMPOSE_FILE"
WAIT_TIMEOUT=60
NO_BUILD=false
SKIP_TESTS=false
TEARDOWN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-build) NO_BUILD=true; shift ;;
    --skip-tests) SKIP_TESTS=true; shift ;;
    --teardown) TEARDOWN=true; shift ;;
    --timeout) WAIT_TIMEOUT="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 2 ;;
  esac
done

echo "Integration test runner"
echo "ROOT_DIR: $ROOT_DIR"
echo "COMPOSE_FILE: $COMPOSE_FILE"
echo "WAIT_TIMEOUT: $WAIT_TIMEOUT"
echo "NO_BUILD: $NO_BUILD"
echo "SKIP_TESTS: $SKIP_TESTS"
echo "TEARDOWN: $TEARDOWN"
echo ""

if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Start Docker and retry."
  exit 1
fi

if ! command -v docker-compose > /dev/null 2>&1; then
  echo "docker-compose not found. Install Docker Compose and retry."
  exit 1
fi

# Start services
UP_ARGS="up -d"
if [ "$NO_BUILD" = false ]; then
  UP_ARGS="up --build -d"
fi

echo "Starting services with: $COMPOSE $UP_ARGS"
$COMPOSE $UP_ARGS

# Helpers
timestamp() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

wait_for_curl() {
  local url=$1
  local timeout=$2
  local now=0
  echo "Waiting for $url (timeout ${timeout}s)..."
  until curl -sSf "$url" > /dev/null 2>&1; do
    sleep 1
    now=$((now+1))
    if [ "$now" -ge "$timeout" ]; then
      echo "Timed out waiting for $url"
      return 1
    fi
  done
  echo "OK: $url"
  return 0
}

wait_for_pg() {
  local timeout=$1
  local now=0
  echo "Waiting for PostgreSQL (timeout ${timeout}s)..."
  until $COMPOSE exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
    now=$((now+1))
    if [ "$now" -ge "$timeout" ]; then
      echo "Timed out waiting for PostgreSQL"
      return 1
    fi
  done
  echo "OK: PostgreSQL"
  return 0
}

dump_logs_on_failure() {
  local out="$ROOT_DIR/scripts/integration-logs-$(date +%s).log"
  echo "Collecting docker-compose logs to $out"
  $COMPOSE logs --no-color > "$out" || echo "Failed to collect logs"
  echo "Logs saved: $out"
}

# Wait services
if ! wait_for_pg "$WAIT_TIMEOUT"; then
  dump_logs_on_failure
  [ "$TEARDOWN" = true ] && $COMPOSE down -v || true
  exit 2
fi

# API, Web, Ops health checks (adjust endpoints if necessary)
if ! wait_for_curl "http://localhost:3001/api/member" "$WAIT_TIMEOUT"; then
  dump_logs_on_failure
  [ "$TEARDOWN" = true ] && $COMPOSE down -v || true
  exit 3
fi

if ! wait_for_curl "http://localhost:5173" "$WAIT_TIMEOUT"; then
  echo "Warning: Web frontend did not respond within timeout."
fi

if ! wait_for_curl "http://localhost:3000" "$WAIT_TIMEOUT"; then
  echo "Warning: Coffee Shop Ops did not respond within timeout."
fi

# Run package test suites (optional)
if [ "$SKIP_TESTS" = false ]; then
  echo ""
  echo "Running package test suites..."

  set +e
  (cd "$ROOT_DIR/packages/api" && npm test --silent)
  rc_api=$?
  (cd "$ROOT_DIR/packages/coffee-shop-ops" && npm test --silent)
  rc_ops=$?
  set -e

  if [ $rc_api -ne 0 ] || [ $rc_ops -ne 0 ]; then
    echo "One or more package tests failed (api:$rc_api ops:$rc_ops)"
    dump_logs_on_failure
    [ "$TEARDOWN" = true ] && $COMPOSE down -v || true
    exit 4
  fi

  echo "Package tests passed."
fi

# Basic HTTP smoke checks
echo ""
echo "Running basic HTTP smoke checks..."

SMOKE_OK=true

if ! curl -sSf http://localhost:3001/api/menu > /dev/null 2>&1; then
  echo "API /api/menu failed"
  SMOKE_OK=false
else
  echo "/api/menu OK"
fi

if ! curl -sSf http://localhost:3001/api/member > /dev/null 2>&1; then
  echo "API /api/member failed"
  SMOKE_OK=false
else
  echo "/api/member OK"
fi

if ! curl -sSf http://localhost:3000/ > /dev/null 2>&1; then
  echo "Coffee Shop Ops root failed (3000)"
  SMOKE_OK=false
else
  echo "Coffee Shop Ops root OK"
fi

if [ "$SMOKE_OK" = false ]; then
  echo "Smoke checks failed."
  dump_logs_on_failure
  [ "$TEARDOWN" = true ] && $COMPOSE down -v || true
  exit 5
fi

# Run Playwright e2e tests
echo ""
echo "Running Playwright e2e tests..."

if [ -d "$ROOT_DIR/e2e" ] && [ -f "$ROOT_DIR/e2e/package.json" ]; then
  cd "$ROOT_DIR/e2e"
  
  # Install Playwright if not already installed
  if [ ! -d "node_modules" ]; then
    echo "Installing Playwright dependencies..."
    npm install
    npx playwright install --with-deps
  fi
  
  # Run e2e tests with environment variables (run only fixed tests)
  E2E_BASE_URL=http://localhost:5173 E2E_API_URL=http://localhost:3001 npx playwright test tests/coffee-purchase-fixed.spec.ts tests/business-flows-fixed.spec.ts --reporter=line || {
    echo "Playwright tests failed"
    return 1
  }
  e2e_rc=$?
  
  cd "$ROOT_DIR"
  
  if [ $e2e_rc -ne 0 ]; then
    echo "Playwright e2e tests failed"
    dump_logs_on_failure
    [ "$TEARDOWN" = true ] && $COMPOSE down -v || true
    exit 6
  fi
  
  echo "Playwright e2e tests passed."
else
  echo "Skipping Playwright tests (e2e directory not found)"
fi

echo ""
echo "Integration checks passed at $(timestamp)."

if [ "$TEARDOWN" = true ]; then
  echo "Tearing down services..."
  $COMPOSE down -v
fi

exit 0