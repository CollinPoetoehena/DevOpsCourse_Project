#!/bin/bash

# Script to login to Docker (to ensure Docker Compose can pull the images). Environment variables should be present
# For documentation see: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/platforms-linux-extend.hooks.html 

echo "Logging into Docker Hub during prebuild from custom docker-login.sh script..."
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_ACCESS_TOKEN"
