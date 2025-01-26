#!/bin/bash

echo "=== WG-Easy Installation Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

# Write configuration to .env file in compose directory
echo "Writing configuration to .env file..."
echo "$APP_CONFIG" | /app/scripts/utils/format_env.sh > /app/compose/not_installed/wgeasy/.env

echo -e "\nStarting installation..."
sleep 2

echo "Step 1: Setting up directories..."
sleep 1

# Move compose directory from not_installed to installed
echo "Moving compose directory to installed..."
mv /app/compose/not_installed/wgeasy /app/compose/installed/

echo "Step 2: Configuring WG-Easy..."
sleep 1

echo "Step 3: Starting services..."
sleep 1

echo -e "\n✅ WG-Easy installation completed!"