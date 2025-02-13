#!/bin/bash

echo "=== Sonarr Removal Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nStarting removal..."
sleep 2

# Define compose file path
COMPOSE_FILE_PATH="/app/compose/installed/sonarr_app/"

echo "Step 1: Stopping services..."
env -C "$COMPOSE_FILE_PATH" docker compose down

echo "Step 2: Removing container..."
echo "Step 3: Removing environment file..."
rm /app/compose/installed/sonarr_app/.env
rm /app/compose/installed/sonarr_app/config
echo "Step 4: Moving configuration..."
mv /app/compose/installed/sonarr_app /app/compose/not_installed/

echo -e "\n✅ Sonarr removal completed!"