#!/bin/bash

echo "=== Blackhole Installation Script ==="
echo "Received configuration:"
#echo "$APP_CONFIG" | jq '.'

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
#echo "API Key: $DEBRID_API"
#echo "PASS: $DEBRID_PASS"
#echo "User: $DEBRID_USER"
env -C "$COMPOSE_FILE_PATH" docker compose -f rclone_pass.yaml up -d --wait
if [ -f /app/compose/installed/blackhole_app/.env ]; then
    source /app/compose/installed/blackhole_app/.env
else
    echo ".env file not found!"
    exit 1
fi
RCLONE_CONF_PATH="/app/compose/installed/blackhole_app/rclone.conf"
RC_CONFIG_PATH="/app/compose/installed/blackhole_app/config/config.yaml"
sleep 10
# Capture the obscured password
OBSCURED_PASS=$(docker exec rclone_pass rclone obscure "$DEBRID_PASS" | tr -d '\r')

# Append or create the config file
cat <<EOF > "$RCLONE_CONF_PATH"
[realdebrid]
type = webdav
url = https://dav.real-debrid.com/
vendor = other
pacer_min_sleep = 0
user = $DEBRID_USER
pass = $OBSCURED_PASS
EOF

cat <<EOF >> "$RC_CONFIG_PATH"
mounts:
  - backendName: "realdebrid"
    mountPoint: "/mess_media/remote/realdebrid"

serves: []
EOF

sed -i "s|\"api_key\": \"[^\"]*\"|\"api_key\": \"$DEBRID_API\"|" /app/compose/installed/blackhole_app/config/config.json

env -C "$COMPOSE_FILE_PATH" docker compose -f rclone_pass.yaml down
# Move compose directory from not_installed to installed


echo "Step 2: Configuring..."
sleep 8

echo "Step 3: Starting services..."
sleep 1
env -C "$COMPOSE_FILE_PATH" docker compose up -d --wait
echo "Step 3: Starting services..."
sleep 1

echo -e "\n✅ Blackhole installation completed!"