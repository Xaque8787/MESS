#!/bin/bash

echo "=== Jellyfin Removal Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nStarting removal..."
sleep 2

# Define compose file path
COMPOSE_FILE_PATH="/app/compose/installed/media_server/"

echo "Step 1: Stopping services..."
env -C "$COMPOSE_FILE_PATH" docker compose down

echo "Step 2: Removing container..."
docker rm jellyfin

echo "Step 3: Removing environment file..."
rm /app/compose/installed/media_server/.env
rm -rf /app/compose/installed/media_server/config
echo "Step 4: Moving configuration..."
mv /app/compose/installed/media_server /app/compose/not_installed/

echo -e "\n✅ Jellyfin removal completed!"