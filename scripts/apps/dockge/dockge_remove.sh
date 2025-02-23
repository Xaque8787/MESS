#!/bin/bash

echo "=== Dockge Removal Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nStarting removal..."
sleep 2

# Define compose file path
COMPOSE_FILE_PATH="/app/compose/dockge/"

echo "Step 1: Stopping services..."
env -C "$COMPOSE_FILE_PATH" docker compose down

echo "Step 2: Removing container..."

echo "Step 3: Removing environment file..."
rm /app/compose/dockge/.env
rm -rf /app/compose/dockge/config
echo "Step 4: Moving configuration..."
mv /app/compose/dockge /app/compose/not_installed/

echo -e "\n✅ Dockge removal completed!"