/*
Capture and display useful outputs
*/

output "elastic_beanstalk_environment_url" {
  description = "URL of the deployed Elastic Beanstalk environment"
  value       = aws_elastic_beanstalk_environment.env.endpoint_url
}
