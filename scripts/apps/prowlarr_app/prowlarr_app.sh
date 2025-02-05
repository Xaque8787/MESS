#!/bin/bash

echo "=== Prowlarr Installation Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

# Write configuration to .env file in compose directory
echo "Writing configuration to .env file..."
echo "$APP_CONFIG" | /app/scripts/utils/format_env.sh > /app/compose/not_installed/prowlarr_app/.env

echo -e "\nStarting installation..."
sleep 2

echo "Step 1: Setting up directories..."
sleep 1

# Move compose directory from not_installed to installed
echo "Moving compose directory to installed..."
mv -v /app/compose/not_installed/prowlarr_app /app/compose/installed/

echo "Step 2: Configuring Prowlarr..."
sleep 1
COMPOSE_FILE_PATH="/app/compose/installed/prowlarr_app/"

# Run docker-compose up in detached mode
env -C "$COMPOSE_FILE_PATH" docker compose up -d --wait
echo "Step 3: Starting services..."
sleep 9
sed -n 's:.*<ApiKey>\(.*\)</ApiKey>.*:PROWLARR_APIKEY=\1:p' /app/compose/installed/prowlarr_app/config/config.xml >> /app/compose/installed/prowlarr_app/.env
git clone https://github.com/dreulavelle/Prowlarr-Indexers.git
sleep 9
mv -v ./Prowlarr-Indexers/Custom /app/compose/installed/prowlarr_app/config/Definitions/
source /app/virt_env/bin/activate
python3 -m server_setup.arrs.prowlarr.prowlarr_setup
deactivate


echo -e "\n✅ Prowlarr installation completed!"