#!/bin/bash

# Source shared environment utilities
source /app/scripts/utils/shared_env.sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Get the container's ID
container_id=$(hostname)

# Check if Docker is available
if ! command -v docker &>/dev/null; then
    echo "Error: Docker is not available in this container. Please ensure Docker is installed and accessible." >&2
    exit 1
fi

# Get the host path mapped to /app/compose inside the container
volume_mapping=$(docker inspect "$container_id" --format='{{range .Mounts}}{{if eq .Destination "/app/compose"}}{{.Source}}{{end}}{{end}}')

# Check if the volume mapping was found
if [ -z "$volume_mapping" ]; then
    echo "Error: No volume mapping found for /app/compose." >&2
    exit 1
fi

# Save the host path to shared environment
save_shared_var "HOST_VOLUME_MAPPING" "$volume_mapping"

# Export for current session
export HOST_VOLUME_MAPPING="$volume_mapping"

# Output the exported variable for confirmation
echo "The host path for /app/compose has been exported as HOST_VOLUME_MAPPING: $HOST_VOLUME_MAPPING"