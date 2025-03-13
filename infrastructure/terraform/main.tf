/*
Defines the core infrastructure

For AWS resources, see documentation: https://docs.aws.amazon.com/
For Terraform provider documentation, see provider.tf in this project
*/

# References S3 module
module "s3" {
  source = "./modules/s3"
  # Variables with values passed to the module
  bucket_name = "rac-main-bucket"
}

# References Elastic Beanstalk module
module "elastic_beanstalk" {
  source = "./modules/elastic_beanstalk"
  # Variables with values passed to the module
  app_name = var.app_name
  app_env_name = var.app_env_name
  app_desc = "Elastic Beanstalk Application for Rent a Car (including frontend and backend)"
  # https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.platforms.html
  app_sol_stack_name = "64bit Amazon Linux 2023 v4.4.4 running Docker"
  # ARN of the certificate from ACM, see in AWS Management Console
  app_certificate_arn = "arn:aws:acm:eu-central-1:650251718669:certificate/319cab6b-0cca-4a09-ae35-219f325e246f"
  # Hosted zone of Route 53 domain
  route53_zone_id = var.route53_zone_id
  # Main domain name
  route53_domain_name = var.route53_domain_name
}

# References Cognito module
module "cognito" {
  source = "./modules/cognito"
  # Variables with values passed to the module
  cog_user_pool_name = "rac-main-user-pool"
  cog_user_pool_domain = "rac-main-user-pool-domain"
  cog_user_pool_client = "rac-main-user-pool-app-client"
  cog_user_group_maintainer = "maintainer"
  cog_user_group_admin = "admin"
}