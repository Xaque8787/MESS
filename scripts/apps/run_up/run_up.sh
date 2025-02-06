#!/bin/bash

# Exit on error
set -e

echo "=== UP Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

echo -e "\nPerforming initial setup..."
sleep 2

echo "Step 1: Setting up environment..."
sleep 1

docker network connect --ip 192.168.1.100 messnet mess
sleep 2
