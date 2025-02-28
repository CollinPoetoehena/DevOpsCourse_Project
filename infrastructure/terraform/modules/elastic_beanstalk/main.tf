# AWS EB resource: https://docs.aws.amazon.com/elastic-beanstalk/
# See provider.tf documentation link for these specific resources in Terraform

resource "aws_elastic_beanstalk_application" "app" {
  name        = var.app_name
  description = var.app_desc
}

resource "aws_elastic_beanstalk_configuration_template" "app_template" {
  name                = "app-config"
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = var.app_sol_stack_name
}