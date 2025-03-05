# Terraform
Terraform is used for provisioning and managing the cloud infrastructure. See main README.md > Prerequisites for how to install Terraform in a Linux environment.

Terraform documentation: https://www.terraform.io/

## Using Terraform
```sh
# Make sure you followed the Credentials.md to load the environment variables in the terminal session!

# Navigate to the terraform directory
cd infrastructure/terraform

# Initialize: Prepares Terraform and downloads provider plugins
terraform init
# Plan: Shows a preview of what Terraform will do (might take some time)
terraform plan
# Apply: Provisions the infrastructure as defined (might take some time)
terraform apply
# Destroy: Removes the infrastructure when no longer needed (might take some time)
terraform destroy

# Run with auto approve (avoids manual required prompt)
terraform apply -auto-approve
terraform destroy -auto-approve

# To remove specific infrastructure resources, you can at a target to destroy, such as only the aws eb environment:
terraform destroy \
  -target="module.elastic_beanstalk.aws_elastic_beanstalk_environment.app_env" \
  -auto-approve
# The targets are referenced by main.tf in the root of Terraform, from there you can select the targets (you can add more targets)
# OR: you can comment out parts of your infrastructure and do apply (it will remove the commented parts)
# For example, you can comment out whole modules, or just a part of a module in its main.tf, such as aws_elastic_beanstalk_environment.app_env
terraform apply -auto-approve
```

After creating your resources, you can view and monitor them in the AWS Management Console for example. You can also see potential errors there that might not be reported by Terraform, such as when creating the AWS Elastic Beanstalk environment, etc. Also, you can see the exact configuration of the resources there. You can use this to see if you might need to change some things in the Terraform code for example.

Something that might help is reading the documentation of the resources extensively to get a good overview of how everything works. Also, manually following some steps in the AWS Management Console might also help you understand the creation and configuration steps (do NOT forget to cancel/delete afterwards).

**VERY IMPORTANT:** Try to always destroy the infrastructure after you are done, such as at the end of each day (or more often after testing an application deployment for example, as these also use resources in the background, or you can stop the instance running in the Management Console, etc.), to avoid unexpected and unnecessary costs! The only exceptions is if you are sure that resources are free and you need them multiple days after each other, such as for a presentation, etc. You can comment out resources in the main.tf file to exclude some resources, e.g., when you only want to test one or a selection of resources.
If costs are less important or you are not in the situation where you need to personally develop and pay for the resources, you can omit this step and instead stop the resources when not used or always keep them on, depending on your specific situation.