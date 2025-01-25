#!/bin/bash

# Ensure the directory exists
mkdir -p /app/compose/installed/resourcemng

# Write PUID and PGID to the .env file
echo "PUID=${PUID:-1000}" > /app/compose/installed/resourcemng/.env
echo "PGID=${PGID:-1000}" >> /app/compose/installed/resourcemng/.env

# Start the main application
exec "$@"