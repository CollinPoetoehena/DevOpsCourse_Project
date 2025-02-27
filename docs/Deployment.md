# Deployment

TODO: explain how the application is deployed using Docker
TODO: when credit card is delivered, I can make this explanation, since I need credentials.
TODO: test deploying to single Elastic Beanstalk instance with Docker Compose to see if that works. 
As an alternative I can also do two separate frontend and backend Elastic Beanstalk services, but Docker Compose is better, and this eliminates the need for managing two AWS EB services, can be just one now.
TODO: for Docker Compose I probably can use the docker-compose.yml file: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/single-container-docker-configuration.html


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

✅ **Using a single Elastic Beanstalk service with Docker Compose (`Dockerrun.aws.json`) is more cost-effective**, especially for small applications.

❌ **Using two separate services is better for scaling independently but increases costs significantly** due to additional EC2 instances, load balancers, and potential inter-service data transfer costs.

It is a best practice to separate them, however, depending on the specific application it can also be possible to combine them into one service to optimize costs and simplicity for example.


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