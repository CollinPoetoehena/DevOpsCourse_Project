# Docker
This document explains how Docker can be used to containerize the applications in this project.

## Backend
```sh
# Navigate to the backend folder
cd backend

# Login to docker with your Docker hub username
docker login -u <username>
# Then enter the password when prompted

# In the following commands, the <username> is replaced with an example: poetoecuva
# Build the docker container
docker build -t poetoecuva/rac-backend .
# Push the image to the Docker hub repository
docker push poetoecuva/rac-backend

# Run Docker locally with the .env file
docker run -p 4001:4001 --env-file .env --name rac-backend poetoecuva/rac-backend:latest

# In the scripts folder, an automated script for this is present
```