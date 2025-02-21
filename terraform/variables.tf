/*
Contains all configurable parameters

Reusable variables for Terraform.
Actual values are present in terraform.tfvars
*/
variable "aws_region" {
  description = "AWS region where resources will be created"
  type = string
  default = "us-east-1"
}

variable "app_name" {
  description = "Elastic Beanstalk Application Name"
  type = string
  default = "my-eb-app"
}

variable "env_name" {
  description = "Elastic Beanstalk Environment Name"
  type = string
  default = "my-eb-env"
}
