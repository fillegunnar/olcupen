#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

cleanup() {
  echo "Stopping database service..."
  podman compose -f compose.yml down db
}

trap cleanup EXIT

echo "Starting database service..."
podman compose -f compose.yml up -d db

echo "Running backend tests in one-off backend container..."
podman compose -f compose.yml run --rm --build backend npm run test -- --run --fileParallelism=false

echo "Backend test run finished."
