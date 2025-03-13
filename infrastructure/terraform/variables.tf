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

# Main domain specified in Route 53
variable "route53_domain_name" {
  description = "The Main domain name used by Route 53 for our application domain name"
  type        = string
  default = "rent-a-car-cloud.click"
}

# Hosted zone can be found in AWS Management Console > Route 53 > Hosted zones > select hosted zone > see zone id in details
variable "route53_zone_id" {
  description = "The Hosted Zone ID for Route 53"
  type        = string
  default = "Z080443796NDC2EE4UR"
}