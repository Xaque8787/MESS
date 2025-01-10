#!/bin/bash

echo "=== Dashboard Update Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

# Update configuration in installed directory
echo "Updating .env file with new configuration..."
echo "$APP_CONFIG" | /app/scripts/utils/format_env.sh > /app/compose/installed/dashboard/.env

echo -e "\nStarting update..."
sleep 2

echo "Step 1: Backing up configuration..."
sleep 1

echo "Step 2: Updating Dashboard..."
sleep 1

echo "Step 3: Restarting services..."
sleep 1

echo -e "\n✅ Dashboard update completed!"