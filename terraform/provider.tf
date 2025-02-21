// Cloud provider and regiion
provider "aws" {
  region = var.aws_region
  // Terraform should automatically read the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY loaded
  // TODO: test if that works
}