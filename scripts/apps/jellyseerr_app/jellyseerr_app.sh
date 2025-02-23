#!/bin/bash

echo "=== Jellyseerr Installation Script ==="
echo "Received configuration:"
#echo "$APP_CONFIG" | jq '.'

# Write configuration to .env file in compose directory
echo "Writing configuration to .env file..."
echo "$APP_CONFIG" | /app/scripts/utils/format_env.sh > /app/compose/not_installed/jellyseerr_app/.env

echo -e "\nStarting installation..."
sleep 2

echo "Step 1: Setting up directories..."
sleep 1

# Move compose directory from not_installed to installed
echo "Moving compose directory to installed..."
mv /app/compose/not_installed/jellyseerr_app /app/compose/installed/
sleep 1
COMPOSE_FILE_PATH="/app/compose/installed/jellyseerr_app/"
echo "Step 3: Starting services..."
sleep 1
env -C "$COMPOSE_FILE_PATH" docker compose up -d --wait
echo "Step 2: Configuring Jellyseerr..."
sleep 60
source /app/virt_env/bin/activate
python3 -m server_setup.jellyseerr.setup_jellyseerr
deactivate
sleep 10

echo "Step 3: Starting services..."
sleep 1

echo -e "\n✅ Jellyseerr installation completed!"