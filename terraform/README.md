# Terraform
Terraform is used for provisioning and managing the cloud infrastructure. See main README.md > Prerequisites for how to install Terraform in a Linux environment.

Terraform documentation: https://www.terraform.io/

## Using Terraform
```sh
# Load environment variables from root of the project
export $(grep -v '^#' .env | xargs)
# Verify loaded environment variables with one of the variables in the .env file, such as
echo $AWS_ACCESS_KEY_ID

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

### AWS Access keys (required for Terraform)
To create an access key, follow these steps:
1. In the AWS Console, select IAM
2. Go to Users and select a user by clicking on their username
3. Select Security credentials tab
4. Scroll to the Access keys section
5. If you don’t have one, click Create access key
6. Copy AWS Access Key ID and AWS Secret Access Key (You won’t be able to see the secret key again after closing this page!) 

TODO: with AWS Sandbox environment, I could not create an access key, so test with real AWS environment.