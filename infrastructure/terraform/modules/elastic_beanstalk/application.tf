# Application
resource "aws_elastic_beanstalk_application" "app" {
  name        = var.app_name
  description = var.app_desc
}
