#!/bin/bash

echo "=== Jellyseerr Removal Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nStarting removal..."
sleep 2

# Define compose file path
COMPOSE_FILE_PATH="/app/compose/installed/jellyseerr_app/docker-compose.yaml"

echo "Step 1: Stopping services..."
env -C "$COMPOSE_FILE_PATH" docker compose down

echo "Step 3: Removing environment file..."
rm /app/compose/installed/jellyseerr_app/.env
rm -rf /app/compose/installed/jellyseerr_app/config
echo "Step 4: Moving configuration..."
mv /app/compose/installed/jellyseerr_app /app/compose/not_installed/

echo -e "\n✅ Jellyseerr removal completed!"