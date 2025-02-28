/*
Defines the core infrastructure

For AWS resources, see documentation: https://registry.terraform.io/providers/hashicorp/aws/latest/docs
For example S3 buckets: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket
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
  # https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.platforms.html
  app_sol_stack_name = "64bit Amazon Linux 2023 v4.4.4 running Docker"
}

# References Cognito module
module "cognito" {
  source = "./modules/cognito"
  # Variables with values passed to the module
  cog_user_pool_name = "main_user_pool"
}


# resource "aws_elastic_beanstalk_application" "app" {
#   name = var.app_name
# }

# resource "aws_elastic_beanstalk_environment" "env" {
#   name = var.env_name
#   application = aws_elastic_beanstalk_application.app.name
#   # Default stack
#   solution_stack_name = "64bit Amazon Linux 2 v5.8.5 running Node.js 14"

#   # Optional: Additional configuration settings
#   setting {
#     namespace = "aws:elasticbeanstalk:environment"
#     name = "EnvironmentType"
#     value = "LoadBalanced"
#   }
# }
