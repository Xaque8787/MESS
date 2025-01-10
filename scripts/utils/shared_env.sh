#!/bin/bash

# File to store shared environment variables in persistent data directory
SHARED_ENV_FILE="/app/data/shared_env.vars"

# Function to save a variable to shared env file
save_shared_var() {
    local key=$1
    local value=$2
    # Ensure directory exists
    mkdir -p "$(dirname "$SHARED_ENV_FILE")"
    echo "export ${key}=${value}" >> "$SHARED_ENV_FILE"
}

# Function to load shared environment variables
load_shared_vars() {
    if [ -f "$SHARED_ENV_FILE" ]; then
        source "$SHARED_ENV_FILE"
    fi
}