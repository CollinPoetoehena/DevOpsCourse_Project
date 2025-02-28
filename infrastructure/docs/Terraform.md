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
# Apply: Provisions the infrastructure as defined
terraform apply
# Destroy: Removes the infrastructure when no longer needed
terraform destroy
```

**VERY IMPORTANT:** Try to always destroy the infrastructure after you are done, such as at the end of each day, to avoid unexpected and unnecessary costs! The only exceptions is if you are sure that resources are free and you need them multiple days after each other, such as for a presentation, etc. You can comment out resources in the main.tf file to exclude some resources, e.g., when you only want to test one or a selection of resources.