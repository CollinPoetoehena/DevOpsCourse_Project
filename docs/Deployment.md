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