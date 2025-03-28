# Cloud provider: https://registry.terraform.io/providers/hashicorp/aws/5.88.0/docs
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.88.0"
    }
  }
}

provider "aws" { 
  # Authentication: https://registry.terraform.io/providers/hashicorp/aws/5.88.0/docs#environment-variables
  # Using the variables AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_REGION with export will automatically configure the provider
  # See Terraform.md for how to set these variables
}
