#!/bin/bash

echo "=== Jellyfin Removal Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nStarting removal..."
sleep 2

echo "Step 1: Stopping services..."
sleep 2

echo "Step 2: Backing up data..."
sleep 2

echo "Step 3: Removing Jellyfin..."
sleep 2

# Move compose directory back to not_installed
echo "Moving compose directory back to not_installed..."
mv /app/compose/installed/media_server /app/compose/not_installed/

# Clear the .env file after moving back
echo "Clearing .env file..."
> /app/compose/not_installed/media_server/.env

echo "Step 4: Cleaning up..."
sleep 2

echo -e "\n✅ Jellyfin removal completed!"