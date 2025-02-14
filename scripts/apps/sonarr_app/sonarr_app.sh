#!/bin/bash

echo "=== Sonarr Installation Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

# Write configuration to .env file in compose directory
echo "Writing configuration to .env file..."
echo "$APP_CONFIG" | /app/scripts/utils/format_env.sh > /app/compose/not_installed/sonarr_app/.env

echo -e "\nStarting installation..."
sleep 2

echo "Step 1: Setting up directories..."
sleep 1

# Move compose directory from not_installed to installed
echo "Moving compose directory to installed..."
mv /app/compose/not_installed/sonarr_app /app/compose/installed/

echo "Step 2: Configuring Sonarr..."
sleep 1
COMPOSE_FILE_PATH="/app/compose/installed/sonarr_app/"
echo "Step 3: Starting services..."
sleep 1
env -C "$COMPOSE_FILE_PATH" docker compose up -d --wait
echo "Step 3: Starting services..."
sleep 10
while [ ! -f "/app/compose/installed/sonarr_app/config/config.xml" ]; do
    echo "Waiting for config.xml to be created..."
    sleep 5  # Check every 5 seconds
done
# Run the sed command once config.xml is detected
sed -n 's:.*<ApiKey>\(.*\)</ApiKey>.*:SONARR_APIKEY=\1:p' /app/compose/installed/sonarr_app/config/config.xml >> /app/compose/installed/sonarr_app/.env
echo "API key extracted and saved to .env"
sleep 20
source /app/virt_env/bin/activate
python3 -m server_setup.arrs.prowlarr.connect_sonarr
deactivate
echo -e "\n✅ Sonarr installation completed!"