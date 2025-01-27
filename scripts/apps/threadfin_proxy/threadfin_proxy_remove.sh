#!/bin/bash

echo "=== Threadfin Proxy Removal Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nStarting removal..."
sleep 2

# Define compose file path
COMPOSE_FILE_PATH="/app/compose/installed/threadfin_proxy/docker-compose.yaml"

echo "Step 1: Stopping services..."
docker compose -f "$COMPOSE_FILE_PATH" down

echo "Step 2: Removing container..."
docker rm threadfin

echo "Step 3: Removing environment file..."
rm /app/compose/installed/threadfin_proxy/.env

echo "Step 4: Moving configuration..."
mv /app/compose/installed/threadfin_proxy /app/compose/not_installed/

echo -e "\n✅ Threadfin Proxy removal completed!"