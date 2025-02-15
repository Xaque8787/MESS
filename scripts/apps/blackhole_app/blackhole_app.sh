#!/bin/bash

echo "=== Blackhole Installation Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

# Write configuration to .env file in compose directory
echo "Writing configuration to .env file..."
echo "$APP_CONFIG" | /app/scripts/utils/format_env.sh > /app/compose/not_installed/blackhole_app/.env

echo -e "\nStarting installation..."
sleep 2

echo "Step 1: Setting up directories..."
sleep 1

# Move compose directory from not_installed to installed
echo "Moving compose directory to installed..."
mv /app/compose/not_installed/blackhole_app /app/compose/installed/

echo "Step 2: Configuring Radarr..."
sleep 1
COMPOSE_FILE_PATH="/app/compose/installed/blackhole_app/"
echo "Step 3: Starting services..."
sleep 1
env -C "$COMPOSE_FILE_PATH" docker compose up -d --wait
echo "Step 3: Starting services..."
sleep 1

echo -e "\n✅ Blackhole installation completed!"