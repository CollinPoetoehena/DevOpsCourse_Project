# Debugging

This document explains some helpful debugging tips.

## Logs in AWS EB Management Console
In the AWS Management Console, you can go to your AWS Elastic Beanstalk environment and request the logs under the logs tab: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.logging.html

## Viewing logs manually
Sometimes the above approach does not work and it will say something like "Failed to retrieve requested logs.". To view the logs, you can also do it manually:
```sh
# Make sure the AWS CLI is installed: see docs/Prerequisites.md
# All below commands use a specific name, this may be a different name for your environment

# Check status of EC2 instance from the application:
aws elasticbeanstalk describe-environments --application-name rac-app --query "Environments[0].Status"

# Request logs using AWS EB CLI: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb3-logs.html
# (Execute this command from the root of the project directory for correct paths)
eb logs rac-app-env --zip
# Then copy the path displayed and unzip it
unzip 
TODO
```