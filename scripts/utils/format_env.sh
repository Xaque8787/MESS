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
  local override_files=()

  # Process all inputs to collect override files
  if echo "$json_input" | jq -e '.inputs' > /dev/null 2>&1; then
    # First, process top-level inputs
    echo "$json_input" | jq -c '.inputs[]' | while IFS= read -r input; do
      local input_type=$(echo "$input" | jq -r '.type')
      local enable_override=$(echo "$input" | jq -r '.enable_override // false')
      local env_name=$(echo "$input" | jq -r '.envName // ""')
      local value=$(echo "$input" | jq -r '.value // false')

      # Handle conditional inputs
      if [ "$input_type" = "conditional-text" ]; then
        # Check if the conditional input itself has enable_override
        if [ "$enable_override" = "true" ] && [ "$value" = "true" ]; then
          override_files+=("docker-compose.${env_name}.yaml")
        fi

        # If conditional input is enabled, check its dependent fields
        if [ "$value" = "true" ]; then
          echo "$input" | jq -c '.dependentField[]?' 2>/dev/null | while IFS= read -r dep_field; do
            if [ -n "$dep_field" ]; then
              local dep_enable_override=$(echo "$dep_field" | jq -r '.enable_override // false')
              local dep_env_name=$(echo "$dep_field" | jq -r '.envName // ""')
              local dep_value=$(echo "$dep_field" | jq -r '.value')

              # Check if dependent field has enable_override and a value
              if [ "$dep_enable_override" = "true" ]; then
                # For checkbox type, check if true
                local dep_type=$(echo "$dep_field" | jq -r '.type // "text"')
                if [ "$dep_type" = "checkbox" ]; then
                  if [ "$dep_value" = "true" ]; then
                    override_files+=("docker-compose.${dep_env_name}.yaml")
                  fi
                # For text type, check if not empty
                else
                  if [ -n "$dep_value" ] && [ "$dep_value" != "null" ]; then
                    override_files+=("docker-compose.${dep_env_name}.yaml")
                  fi
                fi
              fi
            fi
          done
        fi
      # Handle regular inputs
      else
        if [ "$enable_override" = "true" ] && [ "$value" = "true" ]; then
          override_files+=("docker-compose.${env_name}.yaml")
        fi
      fi
    done
  fi

  # Write system environment variables first
  get_system_env_vars

  # Write HOST_PATH if available
  if [ -n "$HOST_VOLUME_MAPPING" ]; then
    echo "HOST_PATH=$HOST_VOLUME_MAPPING"
  fi

  # Write COMPOSE_FILE with all override files if any exist
  if [ ${#override_files[@]} -gt 0 ]; then
    compose_file="docker-compose.yaml"
    # Remove duplicates and sort override files
    readarray -t sorted_unique_overrides < <(printf '%s\n' "${override_files[@]}" | sort -u)
    for override in "${sorted_unique_overrides[@]}"; do
      compose_file="${compose_file}:${override}"
    done
    echo "COMPOSE_FILE=${compose_file}"
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
