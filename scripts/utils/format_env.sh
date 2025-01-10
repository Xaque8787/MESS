#!/bin/bash

source /app/scripts/utils/shared_env.sh
load_shared_vars

clean_key() {
  echo "$1" | sed 's/ //g' | sed 's/[^a-zA-Z0-9_]//g'
}

encrypt_password() {
  local value="$1"
  local key="$MASTER_KEY"
  local value_bytes=($(echo -n "$value" | hexdump -v -e '/1 "%u "'))
  local key_bytes=($(echo -n "$key" | hexdump -v -e '/1 "%u "'))
  local result=""
  
  for i in "${!value_bytes[@]}"; do
    local key_idx=$((i % ${#key_bytes[@]}))
    local xored=$((value_bytes[i] ^ key_bytes[key_idx]))
    result+=$(printf "\\$(printf '%03o' "$xored")")
  done
  
  echo -n "$result" | base64
}

format_env_vars() {
  local json_input=$(cat)
  
  local password_fields=$(echo "$json_input" | jq -r '
    [.inputs[] | 
      select(.isPassword == true or .dependentField.isPassword == true) |
      if .isPassword then .title
      else .dependentField.title
      end
    ] | join(" ")
  ')
  
  local json_output=$(echo "$json_input" | jq -r '
    .inputs[] | 
    if .type != "conditional-text" then
      select(.value != null and .value != "") |
      "\(.title)=\(.value)"
    else
      if .value == true then
        "\(.title)=\(.value)",
        if .dependentField.value != null and .dependentField.value != "" then
          "\(.dependentField.title)=\(.dependentField.value)"
        else
          empty
        end
      else
        empty
      end
    end
  ')

  while IFS= read -r line; do
    if [[ -n "$line" ]]; then
      key="${line%%=*}"
      value="${line#*=}"
      
      # Clean the key
      cleaned_key=$(clean_key "$key")
      
      # Check if this is a password field
      if [[ " $password_fields " == *" $key "* ]]; then
        value="${value#\"}"
        value="${value%\"}"
        encrypted_value=$(encrypt_password "$value")
        echo "${cleaned_key}=${encrypted_value}"
      else
        echo "${cleaned_key}=${value}"
      fi
    fi
  done <<< "$json_output"

  if [ -n "$HOST_VOLUME_MAPPING" ]; then
    echo "HOST_PATH=$HOST_VOLUME_MAPPING"
  fi
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  format_env_vars
fi