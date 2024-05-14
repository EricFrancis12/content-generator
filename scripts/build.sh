#!/bin/bash

# Path to the build config files
BUILD_CONFIG_PATH="./services/_shared/build.config.json"
DEFAULT_BUILD_CONFIG_PATH="./services/_shared/build.config.default.json"

# Generate a random UUID for the service token
SERVICE_TOKEN=$RANDOM-$RANDOM-$RANDOM-$RANDOM

# Function to remove the existing SERVICE_TOKEN from the JSON
remove_service_token() {
    local json=$1
    echo "$json" | sed -E 's/,\s*"SERVICE_TOKEN":\s*"[^"]*"//;s/"SERVICE_TOKEN":\s*"[^"]*"\s*,?//'
}

# Check if the default build config file exists
if [ -f "$DEFAULT_BUILD_CONFIG_PATH" ]; then
    # Read the default build config file
    DEFAULT_BUILD_CONFIG=$(cat "$DEFAULT_BUILD_CONFIG_PATH")
    # Remove the old SERVICE_TOKEN if it exists
    DEFAULT_BUILD_CONFIG=$(remove_service_token "$DEFAULT_BUILD_CONFIG")
else
    # Use an empty JSON object if the default build config file does not exist
    DEFAULT_BUILD_CONFIG="{}"
fi

# Add the SERVICE_TOKEN to the config
if [ "$DEFAULT_BUILD_CONFIG" != "{}" ]; then
    # If the config is not empty, add a comma before adding SERVICE_TOKEN
    BUILD_CONFIG="${DEFAULT_BUILD_CONFIG%?}, \"SERVICE_TOKEN\": \"$SERVICE_TOKEN\"}"
else
    # If the config is empty, just add SERVICE_TOKEN
    BUILD_CONFIG="{ \"SERVICE_TOKEN\": \"$SERVICE_TOKEN\" }"
fi

# Write the build config to the file
echo "$BUILD_CONFIG" > "$BUILD_CONFIG_PATH"

echo "Build config file created at $BUILD_CONFIG_PATH"
