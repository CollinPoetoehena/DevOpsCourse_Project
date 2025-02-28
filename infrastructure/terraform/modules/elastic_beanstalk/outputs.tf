output "eb_app_name" {
  value = aws_elastic_beanstalk_application.app.id
}

output "eb_app_env_settings" {
  value = aws_elastic_beanstalk_environment.app_env.all_settings
}