#!/bin/bash

# Exit on error
set -e

echo "=== Down Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nPerforming initial setup..."
sleep 2

echo "Step 1: Setting up environment..."
sleep 1
docker network disconnect -f messnet mess
sleep 2