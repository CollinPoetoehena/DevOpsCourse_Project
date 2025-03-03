#!/bin/bash

# Script to login to Docker (to ensure Docker Compose can pull the images). Environment variables should be present
# For documentation see: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/platforms-linux-extend.hooks.html 

echo "Logging into Docker Hub during prebuild from custom docker-login.sh script..."
# Use specific script with echo, since AWS EB uses a non-interactive terminal, and will otherwise error with:
# Stderr:Error: Cannot perform an interactive login from a non TTY (interactive) device
echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin
