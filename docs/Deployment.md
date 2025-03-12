# Deployment

TODO: explain how the application is deployed using Docker

TODO: explain that AWS EB automatically runs the docker-compose.yml, which pulls the images. 
TODO: explain: a custom prebuild script 01-docker-login.sh is executed beforehand to login to docker with the necessary credentials to allow docker-compose.yml to pull images from the private Docker Hub repository.
TODO: also explain added security group rule to allow TCP port 4001 inbound traffic to allow frontend to access backend.
TODO: The user automatically becomes a user. We manage this by only having a maintainer and admin group in AWS Cognito, where if the user is part of the maintainer group, the maintainer role is assigned for example. If not part of any of those groups, the user has the user role. This optimizes storage and efficiency, since we now only have two groups, and all other users automatically get the user role.


## Cost Comparison: Single vs. Separate Elastic Beanstalk Services for Frontend and Backend
You can use Docker Compose to run both services in a single AWS EB service, or you can use two separate AWS EB services. Both have their advantages and disadvantages:

| Factor | **Single EB Service (Multi-Container in One EB Env)** | **Two Separate EB Services (Frontend & Backend in Different Envs)** |
|--------|--------------------------------------------------|------------------------------------------------------|
| **EC2 Instances** | ✅ **Shares the same EC2 instance** → Uses fewer resources. | ❌ **Each service gets its own EC2 instance** → More expensive. |
| **Load Balancer** | ✅ **One ELB (Elastic Load Balancer) for both** → Lower cost. | ❌ **Each service may require a separate ELB** → Doubles the cost. |
| **Scaling** | ❌ Both frontend and backend scale **together**, which may not be efficient. | ✅ Each service scales independently, optimizing costs for traffic patterns. |
| **Data Transfer** | ✅ Inter-service communication **is internal** (free inside AWS VPC). | ❌ Services communicate over the internet (potentially extra cost). |
| **Elastic IPs & DNS** | ✅ Only one Elastic Beanstalk domain. | ❌ Two separate Elastic Beanstalk domains. |
| **Operational Costs** | ✅ Easier to manage and deploy → Less maintenance overhead. | ❌ More complex → More DevOps work, possible higher labor costs. |

In summary:
| Deployment Method | Pros | Cons |
|------------------|------|------|
| **Single EB Service (Docker Compose via `Dockerrun.aws.json`)** | ✅ Easier deployment, both services scale together, simple setup. | ❌ Less flexibility, both services share resources. |
| **Separate EB Services (One for Frontend, One for Backend)** | ✅ Can scale frontend & backend independently, better fault isolation. | ❌ More complex, needs manual service linking. |

Therefore: 

✅ **Using a single Elastic Beanstalk service with Docker Compose is more cost-effective**, especially for small applications.

❌ **Using two separate services is better for scaling independently but increases costs significantly** due to additional EC2 instances, load balancers, and potential inter-service data transfer costs.

It is a best practice to separate them, however, depending on the specific application it can also be possible to combine them into one service to optimize costs and simplicity for example.



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