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

# Check status of the environment
eb status rac-app-env

# Request logs using AWS EB CLI: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb3-logs.html
eb logs rac-app-env --zip && unzip -o .elasticbeanstalk/logs/*.zip -d .elasticbeanstalk/logs
# eb logs -> Downloads the logs to .elasticbeanstalk/logs/ with a timestamped filename.
# LATEST_ZIP -> Finds the most recent zip file in .elasticbeanstalk/logs/.
# unzip -> Extracts the logs inside .elasticbeanstalk/logs/.
# rm "$LATEST_ZIP" -> Removes the zip file after extraction.

# If you encounter unexpected problems, like:
poetoec@LAPTOP-IA1OBTR5:/mnt/c/Users/cpoet/IdeaProjects/DevOpsCourse_Project$ eb status rac-app-env
ERROR: NotFoundError - Environment "rac-app-env" not Found.
# You can manually remove the .elasticbeanstalk folder in the root of the project and run "eb init" again, then try again
```