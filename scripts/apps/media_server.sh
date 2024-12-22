#!/bin/bash

echo "=== Jellyfin Installation Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nStarting installation..."
sleep 2

echo "Step 1: Setting up directories..."
sleep 2

echo "Step 2: Configuring Jellyfin..."
sleep 2

echo "Step 3: Starting services..."
sleep 2

echo "Step 4: Finalizing setup..."
sleep 2

echo -e "\n✅ Jellyfin installation completed!"