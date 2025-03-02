output "eb_app_name" {
  value = aws_elastic_beanstalk_application.app.id
}

output "eb_app_env_frontend" {
  value = aws_elastic_beanstalk_environment.app_env_frontend
}

output "eb_app_env_backend" {
  value = aws_elastic_beanstalk_environment.app_env_backend.application
}