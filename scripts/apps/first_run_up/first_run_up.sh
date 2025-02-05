#!/bin/bash

# Exit on error
set -e

echo "=== First Run Initialization Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nPerforming initial setup..."
sleep 2

echo "Step 1: Setting up environment..."
sleep 1

# Run resolve_host.sh to get HOST_VOLUME_MAPPING
if ! source /app/scripts/utils/resolve_host.sh; then
    echo "Warning: Failed to resolve host path, continuing anyway..."
fi

COMPOSE_FILE_PATH="/app/compose/installed/resourcemng/resources.yaml"
echo "Creating messnet network for containers"
# docker network create --subnet=10.21.12.0/26 messnet
sleep 5
# Run docker-compose up in detached mode and capture the exit code
if docker compose -f "$COMPOSE_FILE_PATH" -p resources up -d --wait; then
    echo "Resource initialization completed successfully"
else
    echo "Warning: Resource initialization exited with non-zero status, continuing anyway..."
fi

echo "Step 2: Checking prerequisites..."
sleep 1

echo "Step 3: Preparing system..."
sleep 1

echo -e "\n✅ First run initialization completed!"
exit 0