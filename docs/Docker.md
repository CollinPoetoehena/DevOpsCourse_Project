# Docker
This document explains how Docker can be used to containerize the applications in this project.

## Docker Compose to run all services
You can use Docker Compose to run both the backend and the frontend as containers:
```sh
# Login to docker with your Docker hub username (needs to be done once)
docker login -u <username>
# Then enter the password when prompted

# Build and start the services from the Docker Compose file
# This uses the local docker-compose file and builds the containers with the --build flag
docker-compose -f docker-compose.local.yml up --build
# Stop the services:
# Ctrl+C in the same terminal, or in a new WSL terminal:
docker-compose down
```

## Separate Docker containers (for local testing for example)
To run Docker containers of services separately (e.g. for local development), you can follow these steps:
```sh
# Navigate to the scripts folder
cd scripts

# Login to docker with your Docker hub username (needs to be done once)
docker login -u <username>
# Then enter the password when prompted

# In the scripts folder, an automated script for this is present. Examples:
./buildNRunDockerSeparate.sh -s backend -p /mnt/c/Users/cpoet/IdeaProjects/DevOpsCourse_Project/backend
./buildNRunDockerSeparate.sh -s frontend -p /mnt/c/Users/cpoet/IdeaProjects/DevOpsCourse_Project/frontend
```