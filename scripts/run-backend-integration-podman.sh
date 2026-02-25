#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

cleanup() {
  echo "Stopping and removing compose services..."
  podman compose -f compose.yml down --remove-orphans
}

trap cleanup EXIT

echo "Starting database service..."
podman compose -f compose.yml up -d db

echo "Running integration tests in one-off backend container..."
podman compose -f compose.yml run --rm --build backend npm run test:integration

echo "Integration test run finished."
