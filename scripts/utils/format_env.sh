#!/bin/bash

source /app/scripts/utils/shared_env.sh
load_shared_vars

clean_key() {
  echo "$1" | sed 's/ //g' | sed 's/[^a-zA-Z0-9_]//g'
}

encrypt_password() {
  local value="$1"
  local key="$MASTER_KEY"
  # Remove null bytes before processing
  value=$(echo -n "$value" | tr -d '\0')
  key=$(echo -n "$key" | tr -d '\0')

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

mask_json_passwords() {
  local env_file="/app/data/env.json"
  local selections_file="/app/data/selections.json"

  if [ -f "$env_file" ]; then
    jq '
      walk(
        if type == "object" and .config then
          .config |= with_entries(
            if .value != null and .value != "" and
               (.key | test("(?i).*password.*|.*api.*key.*")) then
              .value = "********"
            else
              .
            end
          )
        else
          .
        end
      )
    ' "$env_file" > "${env_file}.tmp" && mv "${env_file}.tmp" "$env_file"
  fi

  if [ -f "$selections_file" ]; then
    jq '
      walk(
        if type == "object" then
          if .isPassword == true and .value != null and .value != "" then
            .value = "********"
          elif .type == "conditional-text" and .dependentField then
            .dependentField |= map(
              if .isPassword == true and .value != null and .value != "" then
                .value = "********"
              else
                .
              end
            )
          else
            .
          end
        else
          .
        end
      )
    ' "$selections_file" > "${selections_file}.tmp" && mv "${selections_file}.tmp" "$selections_file"
  fi
}

format_env_vars() {
  local json_input=$(cat)
  local needs_override=false
  local override_files=()

  # Check for enable_override in both top-level inputs and dependent fields
  if echo "$json_input" | jq -e '.inputs' > /dev/null 2>&1; then
    # First check top-level inputs
    echo "$json_input" | jq -c '.inputs[]' | while IFS= read -r input; do
      local enable_override=$(echo "$input" | jq -r '.enable_override // false')
      local input_type=$(echo "$input" | jq -r '.type')
      local value=$(echo "$input" | jq -r '.value')

      if [ "$enable_override" = "true" ]; then
        needs_override=true
      fi

      # Check dependent fields if this is a conditional input and it's enabled
      if [ "$input_type" = "conditional-text" ] && [ "$value" = "true" ]; then
        echo "$input" | jq -c '.dependentField[]?' 2>/dev/null | while IFS= read -r dep_field; do
          if [ -n "$dep_field" ]; then
            local dep_enable_override=$(echo "$dep_field" | jq -r '.enable_override // false')
            if [ "$dep_enable_override" = "true" ]; then
              needs_override=true
            fi
          fi
        done
      fi
    done
  fi

  # Write system environment variables first
  get_system_env_vars

  # Write HOST_PATH if available
  if [ -n "$HOST_VOLUME_MAPPING" ]; then
    echo "HOST_PATH=$HOST_VOLUME_MAPPING"
  fi

  # Write COMPOSE_FILE if override is needed
  if [ "$needs_override" = "true" ]; then
    echo "COMPOSE_FILE=docker-compose.yaml:docker-compose.override.yaml"
  fi

  # Process inputs and write environment variables
  echo "$json_input" | jq -r '
    def process_value:
      if type == "boolean" then
        tostring
      elif type == "number" then
        tostring
      else
        .
      end;

    if .inputs then
      .inputs[] |
      if .type != "conditional-text" then
        select(.value != null and .value != "") |
        {
          key: .envName,
          value: (.value | process_value),
          isPassword: .isPassword,
          quoteValue: .quoteValue
        }
      else
        if .value == true then
          {
            key: .envName,
            value: .value,
            isPassword: false,
            quoteValue: false
          },
          (.dependentField[]? | select(.value != null and .value != "") |
          {
            key: .envName,
            value: (.value | process_value),
            isPassword: .isPassword,
            quoteValue: .quoteValue
          })
        else
          empty
        end
      end
    else
      empty
    end | @json' | while IFS= read -r line; do
    if [[ -n "$line" ]]; then
      key=$(echo "$line" | jq -r '.key')
      value=$(echo "$line" | jq -r '.value')
      isPassword=$(echo "$line" | jq -r '.isPassword')
      quoteValue=$(echo "$line" | jq -r '.quoteValue')

      if [[ -n "$key" ]]; then
        cleaned_key=$(clean_key "$key")

        if [[ "$isPassword" == "true" ]]; then
          value="${value#\"}"
          value="${value%\"}"
          encrypted_value=$(encrypt_password "$value")
          echo "${cleaned_key}=${encrypted_value}"
        else
          if [[ "$quoteValue" == "true" ]]; then
            value="${value#\"}"
            value="${value%\"}"
            echo "${cleaned_key}=\"${value}\""
          else
            if [[ "$value" == "true" || "$value" == "false" ]]; then
              echo "${cleaned_key}=${value}"
            else
              echo "${cleaned_key}=${value}"
            fi
          fi
        fi
      fi
    fi
  done

  mask_json_passwords
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  format_env_vars
fi
