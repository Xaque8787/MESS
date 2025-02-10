#!/bin/bash

echo "=== Example App Installation Script ==="
echo "Received configuration:"
echo "$APP_CONFIG" | jq '.'

# Write configuration to .env file in compose directory
echo "Writing configuration to .env file..."
echo "$APP_CONFIG" | /app/scripts/utils/format_env.sh > /app/compose/not_installed/example_app/.env

echo -e "\nStarting installation..."
sleep 2

echo "Step 1: Setting up directories..."
sleep 1

# Get top-level input values
FEATURE_ENABLED=$(echo "$APP_CONFIG" | jq -r '.inputs[] | select(.title=="Enable Feature") | .value // false')
BASIC_INPUT=$(echo "$APP_CONFIG" | jq -r '.inputs[] | select(.title=="Basic Input") | .value // ""')
FEATURE_TOGGLE=$(echo "$APP_CONFIG" | jq -r '.inputs[] | select(.title=="Feature Toggle") | .value // false')

# Get dependent field values if feature is enabled
if [ "$FEATURE_ENABLED" = "true" ]; then
    # Extract all dependent field values using jq
    API_KEY=$(echo "$APP_CONFIG" | jq -r '.inputs[] | select(.title=="Enable Feature") | .dependentField[] | select(.title=="API Key") | .value // ""')
    DEBUG_MODE=$(echo "$APP_CONFIG" | jq -r '.inputs[] | select(.title=="Enable Feature") | .dependentField[] | select(.title=="Debug Mode") | .value // false')
    SERVER_URL=$(echo "$APP_CONFIG" | jq -r '.inputs[] | select(.title=="Enable Feature") | .dependentField[] | select(.title=="Server URL") | .value // ""')

    echo "Feature enabled with following values:"
    echo "API Key: ${API_KEY//?/*}"  # Mask API key in logs
    echo "Debug Mode: $DEBUG_MODE"
    echo "Server URL: $SERVER_URL"
fi

# Move compose directory from not_installed to installed
echo "Moving compose directory to installed..."
mv /app/compose/not_installed/example_app /app/compose/installed/

echo "Step 3: Starting services..."
COMPOSE_FILE_PATH="/app/compose/installed/example_app/docker-compose.yaml"

# Run docker-compose with different configurations based on values
if [ "$FEATURE_ENABLED" = "true" ]; then
    echo "Starting with advanced features..."
    docker compose -f "$COMPOSE_FILE_PATH" up -d --wait
else
    echo "Starting with default configuration..."
    docker compose -f "$COMPOSE_FILE_PATH" up -d --wait
fi

echo -e "\n✅ Example App installation completed!"
