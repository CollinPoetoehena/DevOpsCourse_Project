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
  route53_zone_id = var.route53_zone_id

  # Pass AWS EB app name
  aws_created_eb_app_name = aws_elastic_beanstalk_application.app.name
  # Passing security groups from security_groups module
  app_elb_sg       = module.security_groups.elb_sg
  app_frontend_sg  = module.security_groups.frontend_sg
  app_backend_sg   = module.security_groups.backend_sg
  # Pass IAM value
  eb_instance_profile_name = module.iam.eb_instance_profile_name

  # Ensures security groups & IAM exist before creating the EB environments to avoid error of it not existing
  depends_on = [
    module.security_groups,
    module.iam
  ]
}

# Module to attach a domain record to the created load balancer
module "domain_record" {
  source = "./domain_record"

  # Route 53 Hosted Zone ID (for example: example.com)
  route53_zone_id = var.route53_zone_id
  # Set subdomains using the main domain
  route53_subdomain_fe = "www.${var.route53_domain_name}" # frontend uses www.
  route53_subdomain_be = "api.${var.route53_domain_name}" # backend uses api.

  # Pass ALB DNS Name & Zone ID from environments module
  frontend_lb_dns_name = module.environments.frontend_lb_dns_name
  frontend_lb_zone_id  = module.environments.frontend_lb_zone_id
  backend_lb_dns_name = module.environments.backend_lb_dns_name
  backend_lb_zone_id  = module.environments.backend_lb_zone_id

  # Ensures environments are created first
  depends_on = [
    module.environments
  ]
}
