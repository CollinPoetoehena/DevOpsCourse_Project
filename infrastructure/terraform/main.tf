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
  app_name = "rac-app"
  app_desc = "rent a car application"
  app_conf_templ_name = "rac-app-conf-templ"
  # https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.platforms.html
  app_sol_stack_name = "64bit Amazon Linux 2023 v4.4.4 running Docker"
  app_env_name = "rac-app-env"
  app_sg_name = "rac-app-env-sg"
}

# References Cognito module
module "cognito" {
  source = "./modules/cognito"
  # Variables with values passed to the module
  cog_user_pool_name = "main_user_pool"
}