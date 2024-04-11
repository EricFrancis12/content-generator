#!/bin/bash

# Generate a random UUID for the service token
SERVICE_TOKEN=$RANDOM-$RANDOM-$RANDOM-$RANDOM

# Define the build config
BUILD_CONFIG="{ \"SERVICE_TOKEN\": \"$SERVICE_TOKEN\" }"

# Path to the build config file
BUILD_CONFIG_PATH="./services/_shared/build.config.json"

# Write the build config to the file
echo "$BUILD_CONFIG" > "$BUILD_CONFIG_PATH"

echo "Build config file created at $BUILD_CONFIG_PATH"
