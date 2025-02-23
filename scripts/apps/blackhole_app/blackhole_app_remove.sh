#!/bin/bash

echo "=== Blackhole Removal Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nStarting removal..."
sleep 2

# Define compose file path
COMPOSE_FILE_PATH="/app/compose/installed/blackhole_app/docker-compose.yaml"

echo "Step 1: Stopping services..."
env -C "$COMPOSE_FILE_PATH" docker compose down

echo "Step 2: Removing file contents..."
> /app/compose/installed/blackhole_app/rclone.conf
> /app/compose/installed/blackhole_app/config/config.yaml
echo "Step 3: Removing environment file..."
rm /app/compose/installed/blackhole_app/.env
echo "Step 4: Moving configuration..."
mv /app/compose/installed/blackhole_app /app/compose/not_installed/

echo -e "\n✅ Blackhole removal completed!"