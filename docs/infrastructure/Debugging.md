# Debugging

This document explains some helpful debugging tips.

## Logs in AWS EB Management Console
In the AWS Management Console, you can go to your AWS Elastic Beanstalk environment and request the logs under the logs tab: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.logging.html

## Viewing logs manually
Sometimes the above approach does not work and it will say something like "Failed to retrieve requested logs.". To view the logs, you can also do it manually:
```sh
# Make sure the AWS CLI is installed and followed those steps: see docs/Prerequisites.md
# All below commands use a specific name, this may be a different name for your environment
# (Execute these commands from the root of the project directory for correct paths)

# First setup eb in this project at the root of the project (needs to be done once)
eb init
# Select region used and application, and "n" for CodeCommit
# Now you can use eb commands in this project

# Check status of the environment (e.g. frontend env)
eb status rac-app-env-fe

# Request logs using AWS EB CLI: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb3-logs.html
eb logs rac-app-env-fe --zip && unzip -o .elasticbeanstalk/logs/*.zip -d .elasticbeanstalk/logs
# eb logs -> Downloads the logs to .elasticbeanstalk/logs/ with a timestamped filename.
# LATEST_ZIP -> Finds the most recent zip file in .elasticbeanstalk/logs/.
# unzip -> Extracts the logs inside .elasticbeanstalk/logs/.
# rm "$LATEST_ZIP" -> Removes the zip file after extraction.

# If you encounter unexpected problems, like:
poetoec@LAPTOP-IA1OBTR5:/mnt/c/Users/cpoet/IdeaProjects/DevOpsCourse_Project$ eb status rac-app-env-fe
ERROR: NotFoundError - Environment "rac-app-env-fe" not Found.
# You can manually remove the .elasticbeanstalk folder in the root of the project and run "eb init" again, then try again

# You can try accessing the deployed instance with curl as well, such as accessing the deployed backend:
# Replace the rac-app-env... part with the domain of the new AWS EB environment
curl http://rac-app-env.eba-tb7prr3h.eu-central-1.elasticbeanstalk.com:4001/api/v1 
# May return something like "Welcome to RAC"
# Or frontend:
curl http://rac-app-env.eba-tb7prr3h.eu-central-1.elasticbeanstalk.com
# A lot of times it is not working because of security rules. For example, adding an inbound TCP rule for port 4001 with "0.0.0.0/0" in the security group of the AWS EB environment fixed backend not accessible problem (problem was timing out or saying not accessible)

# If you encounter more weird errors with Elastic Beanstalk, such as infinite loading when redeploying, etc., you can try restarting and/or completely removing the environment using Terraform (see infrastructure/docs/Terraform.md) and then try again.
# To restart, go to the environment and select Actions > Restart app server(s)
# To completely remove and recreate, see infrastructure/docs/Terraform.md

# SSH access:
# Alternatively, you can also use SSH to go into the EC2 instance as a last resort to manually look at the logs. For this you need to setup SSH before deploying, you can add that in Terraform by adding a key pair, or you can use eb ssh --setup for example and then redeploy: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb3-ssh.html
# You can then go to /var/log to look at the logs of the EC2 instance for example after accessing the EC2 instance with SSH
# But this is mainly a last resort option to manually look at the logs
```