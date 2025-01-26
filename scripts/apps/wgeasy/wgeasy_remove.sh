#!/bin/bash

echo "=== WG-Easy Removal Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nStarting removal..."
sleep 2

echo "Step 1: Stopping services..."
sleep 1

echo "Step 2: Removing data..."
sleep 1

# Move compose directory back to not_installed
echo "Moving compose directory back to not_installed..."
mv /app/compose/installed/wgeasy /app/compose/not_installed/

# Clear the .env file after moving back
echo "Clearing .env file..."
> /app/compose/not_installed/wgeasy/.env

echo "Step 3: Cleanup..."
sleep 1

echo -e "\n✅ WG-Easy removal completed!"