#!/bin/bash

# Script to build, push and run a docker image for a single service (e.g. frontend or backend)
# Example usage:
# ./buildNRunDockerSeparate.sh -s backend -p /mnt/c/Users/cpoet/IdeaProjects/DevOpsCourse_Project/backend

# Check if the config.sh file exists
if [ ! -f "./config.sh" ]; then
  echo "Error: config.sh file not found."
  exit 1
fi

# Source the configuration file to load configuration variables
source ./config.sh

# Exit on errors
set -e

# Function to display usage instructions
usage() {
  echo "Usage: $0 -s <service-name> -p <service-root-path> [-b <branch-name>] [-r <docker-registry>]"
  echo "  -s: Service name: backend or frontend (required)"
  echo "  -p: Path to service on local machine, such as /mnt/c/Users/cpoet/IdeaProjects/DevOpsCourse_Project/backend (required)"
  echo "  -b: Branch name (default used from scripts/config.sh)"
  echo "  -r: Docker registry (default used from scripts/config.sh)"
  exit 1
}

# Parse arguments
while getopts "s:p:b:r:" opt; do
  case $opt in
    s) SERVICE_NAME="$OPTARG" ;;
    p) SERVICE_PATH="$OPTARG" ;;
    b) BRANCH_NAME="$OPTARG" ;;
    r) DOCKER_REGISTRY="$OPTARG" ;;
    # For any other argument display the usage information
    *) usage ;;
  esac
done

# Validate required arguments
if [ -z "$SERVICE_NAME" ] || [ -z "$SERVICE_PATH" ]; then
  echo "Error: Service name and service path are required."
  usage
fi

# Validate service name
if [ "$SERVICE_NAME" != "frontend" ] && [ "$SERVICE_NAME" != "backend" ]; then
  echo "Error: Service name must be 'frontend' or 'backend'."
  usage
fi

# Ensure the provided path exists
if [ ! -d "$SERVICE_PATH" ]; then
  echo "Error: The provided DYNAMOS root path does not exist: $SERVICE_PATH"
  exit 1
fi

# Set default values if not provided
# ${x:-$y} syntax means: use the value of x if it is set; otherwise, use the value of y
BRANCH_NAME=${BRANCH_NAME:-$CONFIG_VAR_BRANCH_NAME}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-$CONFIG_VAR_DOCKER_REGISTRY}

# Build Docker image tag
IMAGE_TAG="${DOCKER_REGISTRY}/${SERVICE_NAME}:${BRANCH_NAME}"

# Display settings
echo "Service Name: $SERVICE_NAME"
echo "Service Path: $SERVICE_PATH"
echo "Branch Name: $BRANCH_NAME"
echo "Docker Registry: $DOCKER_REGISTRY"
echo "Image Tag: $IMAGE_TAG"

# Change to the service directory
cd "$SERVICE_PATH"

# Ensure the Dockerfile exists
if [ ! -f "Dockerfile" ]; then
  echo "Error: Dockerfile not found in the service path: $SERVICE_PATH"
  exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build --build-arg NAME="${SERVICE_NAME}" -t "${IMAGE_TAG}" .

# Push the Docker image
echo "Pushing Docker image to registry..."
docker push "${IMAGE_TAG}"

# Deployment completion message (exit on errors is enabled, so if errors occur this message will not be shown)
echo "Docker image ${IMAGE_TAG} built and pushed successfully."

# Display the appropriate docker run command based on the service name
echo "Running Docker file locally..."
if [ "$SERVICE_NAME" == "backend" ]; then
  # Check if a container with the same name exists
  if [ "$(docker ps -a -q -f name=rac-backend)" ]; then
    # Remove earlier container with the same name (use force to remove running containers as well)
    docker rm rac-backend --force
  fi
  # Remove earlier container with the same name (use force to remove running containers as well)
  docker rm rac-backend --force
  # Run docker container
  docker run -p 4001:4001 --env-file .env --name rac-backend ${IMAGE_TAG}
else
  # Check if a container with the same name exists
  if [ "$(docker ps -a -q -f name=rac-frontend)" ]; then
    # Remove earlier container with the same name (use force to remove running containers as well)
    docker rm rac-frontend --force
  fi
  # Run docker container
  docker run -p 3000:3000 --name rac-frontend ${IMAGE_TAG}
fi