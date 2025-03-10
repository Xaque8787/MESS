#!/bin/bash

echo "=== Threadfin Proxy Installation Script ==="
echo "Received configuration:"
#echo "$APP_CONFIG" | jq '.'

# Write configuration to .env file in compose directory
echo "Writing configuration to .env file..."
echo "$APP_CONFIG" | /app/scripts/utils/format_env.sh > /app/compose/not_installed/threadfin_proxy/.env

echo -e "\nStarting installation..."
sleep 2

echo "Step 1: Setting up directories..."
sleep 1

# Move compose directory from not_installed to installed
echo "Moving compose directory to installed..."
mv /app/compose/not_installed/threadfin_proxy /app/compose/installed/

echo "Step 2: Configuring Threadfin Proxy..."
sleep 1
COMPOSE_FILE_PATH="/app/compose/installed/threadfin_proxy/"

# Run docker-compose up in detached mode
env -C "$COMPOSE_FILE_PATH" docker compose up -d --wait
sleep 10
ADD_TUNER=$(echo "$APP_CONFIG" | jq -r '.inputs[] | select(.title=="Enable tuner and epg in Jellyfin") | .value // ""')
# Activate the virtual environment
source /app/virt_env/bin/activate

sleep 15
# Execute the Python script as a module
python3 -m server_setup.threadfin.setup_threadfin

deactivate
if [ "$ADD_TUNER" = "true" ]; then
    source /app/virt_env/bin/activate
    sleep 10
    python3 -m server_setup.jellyfin_api.add_tuner_and_epg
    deactivate
fi
echo "Step 3: Starting services..."
sleep 1

echo -e "\n✅ Threadfin Proxy installation completed!"