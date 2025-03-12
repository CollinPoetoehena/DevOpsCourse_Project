# Deployment

TODO: explain how the application is deployed using Docker

TODO: explain that AWS EB automatically runs the docker-compose.yml, which pulls the images. 
TODO: explain: a custom prebuild script 01-docker-login.sh is executed beforehand to login to docker with the necessary credentials to allow docker-compose.yml to pull images from the private Docker Hub repository.
TODO: also explain added security group rule to allow TCP port 4001 inbound traffic to allow frontend to access backend.
TODO: The user automatically becomes a user. We manage this by only having a maintainer and admin group in AWS Cognito, where if the user is part of the maintainer group, the maintainer role is assigned for example. If not part of any of those groups, the user has the user role. This optimizes storage and efficiency, since we now only have two groups, and all other users automatically get the user role.






## GitHub Secrets and Variables
In GitHub, you can create secrets and variables for GitHub Actions in Settings > Security > Secrets and variables > Actions for example:
- https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions
- https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables 

For the secrets and variables:
- Do not add quotes around values (only for strings with spaces for example, but not with URLs). This can cause problems in GitHub Actions, such as:
```
getaddrinfo ENOTFOUND 'http
```
This happened because the BACKEND_URL was inside '' in the GitHub environment variables. However, when removing the '' around it, it worked without problems.


### Required variables and secrets for GitHub Actions
The following repository secrets need to be created:
- DOCKER_USERNAME: Docker Hub username
- DOCKER_ACCESS_TOKEN: Docker personal access token (with read, write and delete permission): https://docs.docker.com/security/for-developers/access-tokens/

For the environment secrets, create an environment called main and add the following secrets (see backend/dummy.env):
- MONGO_URI: MongoDB connection string
- AWS_ACCESS_KEY_ID: AWS access key id
- AWS_SECRET_ACCESS_KEY: AWS access key secret
And add the following environment variables:
- API_NAME: Name of the API
- API_PORT: Port of the API
- FRONTEND_PORT: Port of the frontend
- API_VERSION: Version of the API
- FRONTEND_URL: Frontend URL
- BACKEND_URL: Backend URL
- VEHICLE_URL: URL of the vehicle API
- AWS_REGION: AWS region used
- S3_BUCKET_NAME: AWS S3 bucket name (created with Terraform)
- EB_APP_NAME: AWS Elastic Beanstalk application name (created with Terraform)
- EB_ENV_NAME: AWS Elastic Beanstalk environment name (created with Terraform)
- COGNITO_APP_CLIENT_ID: client id of the application created with the AWS Cognito user pool
- COGNITO_USER_POOL_ID: AWS Cognito user pool id
- COGNITO_DOMAIN: AWS Cognito user pool domain
- NEXT_PUBLIC_FRONTEND_URL: Frontend base URL including version
- NEXT_PUBLIC_BACKEND_FULL_URL: Backend URL including version
- NEXT_PUBLIC_COGNITO_AUTHORITY: AWS Cognito user pool authority, used for the frontend
- NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN: AWS Cognito user pool sign in redirect URL
- NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT: AWS Cognito user pool sign out redirect URL

Not all environment variables in the dummy.env are present here (such as for the frontend), since some variables are reused. For example, the COGNITO_APP_CLIENT_ID is used in the backend and frontend, but can be only one variable in the GitHub environment, and there the NEXT_PUBLIC_ prefix is specific to the Next.js frontend, since this is required to access the environment variable.

This needs to be in one environment, as GitHub Actions does not support multiple environments being loaded at this time.