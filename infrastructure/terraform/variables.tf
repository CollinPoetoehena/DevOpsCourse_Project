/*
Contains all configurable parameters

Reusable variables for Terraform.
Actual values are present in terraform.tfvars
*/

variable "app_name" {
  description = "Elastic Beanstalk Application Name"
  type = string
  default = "rac-app"
}

variable "app_env_name" {
  description = "Elastic Beanstalk Environment Name"
  type = string
  default = "rac-app-env"
}
