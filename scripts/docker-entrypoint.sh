#!/bin/bash

# Ensure the resourcemng directory exists
mkdir -p /app/compose/installed/resourcemng

# Write PUID and PGID to the resourcemng .env file
echo "PUID=${PUID:-1000}" > /app/compose/installed/resourcemng/.env
echo "PGID=${PGID:-1000}" >> /app/compose/installed/resourcemng/.env

# Export PUID and PGID so they're available to all scripts
export PUID=${PUID:-1000}
export PGID=${PGID:-1000}

# Create required directories if they don't exist
mkdir -p /app/data
mkdir -p /app/media/jellyfin/symlinks
mkdir -p /app/media/jellyfin/symlinks/movie-radarr
mkdir -p /app/media/jellyfin/symlinks/tv-sonarr
mkdir -p /app/media/jellyfin/movies
mkdir -p /app/media/jellyfin/tv
mkdir -p /app/media/remote/cache
mkdir -p /app/media/remote/realdebrid/torrents
mkdir -p /app/media/remote/torbox/torrents

# Update ownership of all directories
chown -R ${PUID}:${PGID} /app/data
chown -R ${PUID}:${PGID} /app/media
chown -R ${PUID}:${PGID} /app/compose

# Start the main application
exec "$@"