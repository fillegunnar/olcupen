#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${REPO_ROOT}/compose.yml"

if command -v podman-compose >/dev/null 2>&1; then
  COMPOSE_CMD=(podman-compose)
elif command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1; then
  COMPOSE_CMD=(podman compose)
else
  echo "Error: podman compose is not available. Install podman-compose or podman compose plugin." >&2
  exit 1
fi

echo "Using compose command: ${COMPOSE_CMD[*]}"

cleanup() {
  echo "Stopping and removing compose services..."
  "${COMPOSE_CMD[@]}" -f "${COMPOSE_FILE}" down --remove-orphans
}

trap cleanup EXIT

echo "Starting backend service (and dependencies)..."
"${COMPOSE_CMD[@]}" -f "${COMPOSE_FILE}" up -d --build backend

echo "Running integration tests inside backend container..."
"${COMPOSE_CMD[@]}" -f "${COMPOSE_FILE}" exec -T backend npm run test:integration

echo "Integration test run finished."
