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
}

# module "load_balancer" {
#   source = "./load_balancer"
# }
# TODO: above load balancer module can be removed, add route 53 for attaching the load balancer.

# Elastic Beanstalk application
resource "aws_elastic_beanstalk_application" "app" {
  name        = var.app_name
  description = var.app_desc
}

# Elastic Beanstalk environments for the application
module "environments" {
  source = "./environments"
  app_backend_env_name = "${var.app_env_name}-be"
  app_frontend_env_name = "${var.app_env_name}-fe"
  app_sol_stack_name = var.app_sol_stack_name
  app_certificate_arn = var.app_certificate_arn

  # Pass AWS EB app name
  aws_created_eb_app_name = aws_elastic_beanstalk_application.app.name
  # Passing security groups from security_groups module
  app_elb_sg_name       = module.security_groups.elb_sg_name
  app_frontend_sg_name  = module.security_groups.frontend_sg_name
  app_backend_sg_name   = module.security_groups.backend_sg_name
  # Pass IAM value
  eb_instance_profile_name = module.iam.eb_instance_profile_name
}