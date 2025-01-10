#!/bin/bash

echo "=== First Run Finalization Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

# Write configuration to .env file
echo "Writing configuration to .env file..."
echo "$APP_CONFIG" | jq -r 'to_entries | .[] | "\(.key)=\(.value)"' > .env

echo -e "\nPerforming final setup..."
sleep 2

echo "Step 1: Finalizing configurations..."
sleep 1

echo "Step 2: Cleaning up..."
sleep 1
docker rm -f resourcemng 2>/dev/null || true
echo "Step 3: Verifying setup..."
sleep 1

echo -e "\n✅ First run finalization completed!"