#!/bin/bash

echo "=== M3U Parser Removal Script ==="
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
mv /app/compose/installed/m3uparser /app/compose/not_installed/

# Clear the .env file after moving back
echo "Clearing .env file..."
> /app/compose/not_installed/m3uparser/.env

echo "Step 3: Cleanup..."
sleep 1

echo -e "\n✅ M3U Parser removal completed!"