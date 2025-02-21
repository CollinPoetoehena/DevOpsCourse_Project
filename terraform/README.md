# Terraform
Terraform is used for provisioning and managing the cloud infrastructure. See main README.md > Prerequisites for how to install Terraform in a Linux environment.

## Using Terraform
```sh
# Navigate to the terraform directory
cd terraform

# Initialize: Prepares Terraform and downloads provider plugins
terraform init
# Plan: Shows a preview of what Terraform will do
terraform plan
# Apply: Provisions the infrastructure as defined
terraform apply
# Destroy: Removes the infrastructure when no longer needed
terraform destroy
```