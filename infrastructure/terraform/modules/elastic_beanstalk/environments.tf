# Environments 
# TODO: change to without template, now just two environments.


# Environment for the frontend application to run
# For possible configuration options (settings): https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/beanstalk-environment-configuration-advanced.html
# Specifically: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
resource "aws_elastic_beanstalk_environment" "frontend" {
  name                = var.app_frontend_env_name
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = var.app_sol_stack_name

  # Ensure security group exists before using it to avoid error of it not existing
  depends_on = [aws_security_group.eb_sg]

  # Use LoadBalanced environment for AWS EB
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "LoadBalanced"
  }
  # Set min and max number of instances to 1 to always have 1 instance to avoid high costs for more instances, 
  # but still the capabilities of a load balancer (e.g. HTTPS)
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = 1
  }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = 1
  }

  # Security groups
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = "${module.security_groups.frontend_sg},${module.security_groups.elb_sg}"
  }

  # Add additional listener for the Load Balancer
  # HTTPS traffic for the load balancer
  setting {
    namespace = "aws:elb:listener:443"
    name      = "ListenerProtocol"
    value     = "HTTPS"
  }
  setting {
    namespace = "aws:elb:listener:443"
    name      = "InstancePort"
    value     = "80"
  }
  setting {
    namespace = "aws:elb:listener:443"
    name      = "InstanceProtocol"
    value     = "HTTP"
  }
  # Certificate from ACM
  setting {
    namespace = "aws:elb:listener:443"
    name      = "SSLCertificateId"
    value     = var.app_certificate_arn
  }
}

# TODO: make backend environment and the rest

resource "aws_elastic_beanstalk_environment" "backend" {
  name                = "${var.app_name}-backend-env"
  application         = aws_elastic_beanstalk_application.backend.name
  solution_stack_name = "64bit Amazon Linux 2 v5.8.0 running Docker"

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = module.security_groups.backend_sg
  }
}
