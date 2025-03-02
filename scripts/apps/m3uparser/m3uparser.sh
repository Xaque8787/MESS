#!/bin/bash

echo "=== M3U Parser Installation Script ==="
echo "Received configuration:"
#echo "$APP_CONFIG" | jq '.'

# Write configuration to .env file in compose directory
echo "Writing configuration to .env file..."
echo "$APP_CONFIG" | /app/scripts/utils/format_env.sh > /app/compose/not_installed/m3uparser/.env

echo -e "\nStarting installation..."
sleep 2

echo "Step 1: Setting up directories..."
sleep 1

# Move compose directory from not_installed to installed
echo "Moving compose directory to installed..."
mv /app/compose/not_installed/m3uparser /app/compose/installed/

sleep 2
COMPOSE_FILE_PATH="/app/compose/installed/m3uparser/"

# Run docker-compose up in detached mode
env -C "$COMPOSE_FILE_PATH" docker compose up -d --wait
echo "Step 2: Configuring M3U Parser..."
sleep 15
# source /app/virt_env/bin/activate
# python3 -m server_setup.m3uparser.add_vod_library
# deactivate
echo "Step 3: Starting services..."
sleep 1

echo -e "\n✅ M3U Parser installation completed!"