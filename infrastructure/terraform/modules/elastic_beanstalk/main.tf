# AWS EB resource: https://docs.aws.amazon.com/elastic-beanstalk/
# See provider.tf documentation link for these specific resources in Terraform

# IAM module for attaching role to the EB application for example
module "iam" {
  source = "./iam"
}

# Security groups for the application
module "security_groups" {
  source = "./security_groups"
  app_backend_sg_name = "${var.app_env_name}-be-sg"
  app_frontend_sg_name = "${var.app_env_name}-fe-sg"
  app_elb_sg_name  ="${var.app_env_name}-elb-sg"
  app_certificate_arn = var.app_certificate_arn
}

# module "load_balancer" {
#   source = "./load_balancer"
# }
# TODO: above load balancer module can be removed, add route 53 for attaching the load balancer.

# Elastic Beanstalk application
module "application" {
  source = "./security_groups.tf"
}

# Elastic Beanstalk environments for the application
module "environments" {
  source = "./environments"
}