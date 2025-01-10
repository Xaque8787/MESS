#!/bin/bash

echo "=== Jellyfin Installation Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

# Write configuration to .env file in compose directory
echo "Writing configuration to .env file..."
echo "$APP_CONFIG" | /app/scripts/utils/format_env.sh > /app/compose/not_installed/media_server/.env

echo -e "\nStarting installation..."
sleep 2

echo "Step 1: Setting up directories..."
sleep 2

# Move compose directory from not_installed to installed
echo "Moving compose directory to installed..."
mv /app/compose/not_installed/media_server /app/compose/installed/

echo "Step 2: Configuring Jellyfin..."
sleep 2
echo "Step 2: Configuring Jellyfin..."
sleep 2
COMPOSE_FILE_PATH="/app/compose/installed/media_server/docker-compose.yaml"

# Run docker-compose up in detached mode
docker compose -f "$COMPOSE_FILE_PATH" up -d --wait
sleep 10
# Activate the virtual environment
source /app/virt_env/bin/activate

sleep 45
# Execute the Python script as a module
python3 -m server_setup.setup_server

deactivate
echo "Step 3: Starting services..."
sleep 2

echo "Step 4: Finalizing setup..."
sleep 2

echo -e "\n✅ Jellyfin installation completed!"