#!/bin/bash

echo "=== M3U Parser Removal Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nStarting removal..."
sleep 2

# Define compose file path
COMPOSE_FILE_PATH="/app/compose/installed/m3uparser/"

echo "Step 1: Stopping services..."
env -C "$COMPOSE_FILE_PATH" docker compose down

echo "Step 3: Removing environment file..."
rm /app/compose/installed/m3uparser/.env

echo "Step 4: Moving configuration..."
mv /app/compose/installed/m3uparser /app/compose/not_installed/

echo -e "\n✅ M3U Parser removal completed!"