#!/bin/bash

echo "=== Blackhole Installation Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

# Write configuration to .env file in compose directory
echo "Writing configuration to .env file..."
echo "$APP_CONFIG" | /app/scripts/utils/format_env.sh > /app/compose/not_installed/blackhole_app/.env

echo -e "\nStarting installation..."
sleep 2
echo "Moving compose directory to installed..."
mv /app/compose/not_installed/blackhole_app /app/compose/installed/
echo "Step 1: Setting up directories..."
sleep 1
COMPOSE_FILE_PATH="/app/compose/installed/blackhole_app/"
DEBRID_USER=$(echo "$APP_CONFIG" | jq -r '.inputs[] | select(.title=="RealDebrid") | .dependentField[] | select(.title=="RealDebrid Webdav Username") | .value // ""')
DEBRID_API=$(echo "$APP_CONFIG" | jq -r '.inputs[] | select(.title=="RealDebrid") | .dependentField[] | select(.title=="RealDebrid API Key") | .value // ""')
DEBRID_PASS=$(echo "$APP_CONFIG" | jq -r '.inputs[] | select(.title=="RealDebrid") | .dependentField[] | select(.title=="RealDebrid Webdav Password") | .value // ""')
echo "API Key: $DEBRID_API"
echo "PASS: $DEBRID_PASS"
echo "User: $DEBRID_USER"
env -C "$COMPOSE_FILE_PATH" docker compose -f rclone_pass.yaml up -d --wait
RCLONE_CONF_PATH="/app/compose/installed/blackhole_app/rclone.conf"
# Capture the obscured password
OBSCURED_PASS=$(docker exec -it rclone rclone obscure "$DEBRID_PASS" | tr -d '\r')

# Append or create the config file
cat <<EOF > "$RCLONE_CONF_PATH"
[wdav-remote]
type = webdav
url = https://dav.real-debrid.com/
vendor = other
pacer_min_sleep = 0
user = $DEBRID_USER
pass = $OBSCURED_PASS
EOF

sed -i "s|\"api_key\": \"[^\"]*\"|\"api_key\": \"$DEBRID_API\"|" /app/compose/installed/blackhole_app/config/config.json

env -C "$COMPOSE_FILE_PATH" docker compose -f rclone_pass.yaml down
# Move compose directory from not_installed to installed


echo "Step 2: Configuring Radarr..."
sleep 1

echo "Step 3: Starting services..."
sleep 1
env -C "$COMPOSE_FILE_PATH" docker compose up -d --wait
echo "Step 3: Starting services..."
sleep 1

echo -e "\n✅ Blackhole installation completed!"