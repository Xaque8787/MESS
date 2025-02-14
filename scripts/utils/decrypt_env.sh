#!/bin/bash

# Source shared environment utilities
source /app/scripts/utils/shared_env.sh

decrypt_password() {
  local encrypted_value="$1"
  local key="$MASTER_KEY"

  # Decode base64
  local decoded=$(echo "$encrypted_value" | base64 -d)

  # Convert key to bytes
  local key_bytes=($(echo -n "$key" | hexdump -v -e '/1 "%u "'))

  # Convert decoded value to bytes
  local value_bytes=($(echo -n "$decoded" | hexdump -v -e '/1 "%u "'))

  # XOR decrypt
  local result=""
  for i in "${!value_bytes[@]}"; do
    local key_idx=$((i % ${#key_bytes[@]}))
    local xored=$((value_bytes[i] ^ key_bytes[key_idx]))
    result+=$(printf "\\$(printf '%03o' "$xored")")
  done

  echo -n "$result"
}

# If script is run directly, expect env var name as argument
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  if [ -z "$1" ]; then
    echo "Usage: $0 ENV_VAR_NAME"
    exit 1
  fi

  # Get encrypted value from .env file
  encrypted_value=$(grep "^$1=" .env | cut -d'=' -f2)

  if [ -z "$encrypted_value" ]; then
    echo "Environment variable $1 not found in .env file"
    exit 1
  fi

  # Decrypt and output
  decrypted_value=$(decrypt_password "$encrypted_value")
  echo "$decrypted_value"
fi