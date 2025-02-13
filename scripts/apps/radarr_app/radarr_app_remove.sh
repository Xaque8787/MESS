#!/bin/bash

echo "=== Radarr Removal Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nStarting removal..."
sleep 2

# Define compose file path
COMPOSE_FILE_PATH="/app/compose/installed/radarr_app/"

echo "Step 1: Stopping services..."
env -C "$COMPOSE_FILE_PATH" docker compose down

echo "Step 2: Removing container..."

echo "Step 3: Removing environment file..."
rm /app/compose/installed/radarr_app/.env
rm -rf /app/compose/installed/radarr_app/config
echo "Step 4: Moving configuration..."
mv /app/compose/installed/radarr_app /app/compose/not_installed/

echo -e "\n✅ Radarr removal completed!"