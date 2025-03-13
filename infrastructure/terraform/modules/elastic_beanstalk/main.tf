# AWS EB resource: https://docs.aws.amazon.com/elastic-beanstalk/
# See provider.tf documentation link for these specific resources in Terraform












resource "aws_elastic_beanstalk_configuration_template" "app_template" {
  name                = var.app_conf_templ_name
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = var.app_sol_stack_name

  # Ensure security group exists before using it to avoid error of it not existing
  depends_on = [aws_security_group.eb_sg]

  
  # Old single instance before moving to LoadBalanced:
  # The load balancer is not necessary, and we can suffice with a single (VM) instance 
  # setting {
  #   namespace = "aws:elasticbeanstalk:environment"
  #   name      = "EnvironmentType"
  #   value     = "SingleInstance"
  # }

  # Use instance profile for IAM
  # Required for EB environment (will otherwise give error: Environment must have instance profile associated with it)
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    # Provide name instead of id of the security group (id caused error "The security group 'sg-...' does not exist")
    value     = aws_iam_instance_profile.eb_instance_profile.name
  }

  # Set InstanceType for free tier eligible
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }

  # Attach the custom security groups
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    # Can use single string with multiple security groups
    # value     = aws_security_group.eb_sg.name
    value     = "${aws_security_group.eb_sg.name},${aws_security_group.elb_sg.name}"
  }

  
}

# Environment (uses the template), used to run the actual application
resource "aws_elastic_beanstalk_environment" "app_env" {
  name                = var.app_env_name
  application         = aws_elastic_beanstalk_application.app.name
  # Use the earlier created template for the environment
  template_name = aws_elastic_beanstalk_configuration_template.app_template.name
}