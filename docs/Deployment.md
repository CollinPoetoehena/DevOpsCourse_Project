# Deployment

TODO: explain how the application is deployed using Docker



In GitHub, you can create secrets and variables for GitHub Actions in Settings > Security > Secrets and variables > Actions for example:
- https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions
- https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables 

For the secrets and variables:
- Do not add quotes around values (only for strings with spaces for example, but not with URLs). This can cause problems in GitHub Actions, such as:
```
getaddrinfo ENOTFOUND 'http
```
This happened because the BACKEND_URL was inside '' in the GitHub environment variables. However, when removing the '' around it, it worked without problems.


## Required variables and secrets for GitHub Actions
The following repository secrets need to be created:
- DOCKER_USERNAME: Docker Hub username
- DOCKER_ACCESS_TOKEN: Docker personal access token (with read, write and delete permission): https://docs.docker.com/security/for-developers/access-tokens/

For the environment secrets, create an environment called backend and add the following secrets (see backend/dummy.env):
- MONGO_URI: MongoDB connection string
- SECRET_KEY: bcrypt secret key
- FACTOR: bcrypt factor
- ROLE: bcrypt role
And add the following environment variables:
- API_NAME: Name of the API
- API_PORT: Port of the API
- API_VERSION: Version of the API
- FRONTEND_URL: Frontend URL
- BACKEND_URL: Backend URL
- VEHICLE_URL: URL of the vehicle API

TODO: create environment cloud and add secrets there for deployment:
- AWS_ACCESS_KEY_ID: AWS access key id
- AWS_SECRET_ACCESS_KEY: AWS access key secret
TODO