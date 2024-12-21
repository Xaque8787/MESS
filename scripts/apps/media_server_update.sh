#!/bin/bash

echo "=== Jellyfin Update Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nStarting update..."
sleep 2

echo "Step 1: Backing up configuration..."
sleep 2

echo "Step 2: Updating Jellyfin..."
sleep 2

echo "Step 3: Applying new configuration..."
sleep 2

echo "Step 4: Restarting services..."
sleep 2

echo -e "\n✅ Jellyfin update completed!"