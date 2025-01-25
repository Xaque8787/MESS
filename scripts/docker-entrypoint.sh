#!/bin/bash

# Ensure the directory exists
mkdir -p /app/compose/installed/resourcemng

# Write PUID and PGID to the resourcemng .env file
echo "PUID=${PUID:-1000}" > /app/compose/installed/resourcemng/.env
echo "PGID=${PGID:-1000}" >> /app/compose/installed/resourcemng/.env

# Export PUID and PGID so they're available to all scripts
export PUID=${PUID:-1000}
export PGID=${PGID:-1000}

# Start the main application
exec "$@"