# Environments 

# Environment for the frontend application to run
# For possible configuration options (settings): https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/beanstalk-environment-configuration-advanced.html
# Specifically: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
resource "aws_elastic_beanstalk_environment" "frontend" {
  name                = var.app_frontend_env_name
  application         = var.aws_created_eb_app_name
  solution_stack_name = var.app_sol_stack_name

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
  # Use Application load balancer (new generation, this is the elbv2 option)
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }

  # Use instance profile for IAM
  # Required for EB environment (will otherwise give error: Environment must have instance profile associated with it)
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    # Provide name instead of id of the security group (id caused error "The security group 'sg-...' does not exist")
    value     = var.eb_instance_profile_name
  }

  # Set InstanceType for free tier eligible
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }

  # Security groups
  # Add security group to the EB environment
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    # Provide name instead of id (id caused error "The security group 'sg-...' does not exist")
    value     = var.app_frontend_sg
  }
  # Add security group for the load balancer to the load balancer
  setting {
    namespace = "aws:elbv2:loadbalancer"
    name      = "SecurityGroups"
    # However, here we cannot use id of sg, otherwise, it will say something like 'security group not valid'.
    # So, this is different to the security groups of the environments
    value     = var.app_elb_sg
  }

  # Add additional listener for the Load Balancer
  # HTTPS traffic for the load balancer
  setting {
    namespace = "aws:elbv2:listener:443" # Port typically used for HTTPS
    name      = "Protocol"
    value     = "HTTPS"
  }
  # Certificate from ACM
  setting {
    namespace = "aws:elbv2:listener:443"
    name      = "SSLCertificateArns"
    value     = var.app_certificate_arn
  }
}

# Environment for the backend to run
resource "aws_elastic_beanstalk_environment" "backend" {
  name                = var.app_backend_env_name
  application         = var.aws_created_eb_app_name
  solution_stack_name = var.app_sol_stack_name

  # Use a single instance for the backend
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }

  # Use instance profile for IAM
  # Required for EB environment (will otherwise give error: Environment must have instance profile associated with it)
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    # Provide name instead of id (id caused error "The ... does not exist")
    value     = var.eb_instance_profile_name
  }

  # Set InstanceType for free tier eligible
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    # Provide name instead of id (id caused error "The security group 'sg-...' does not exist")
    value     = var.app_backend_sg
  }
}


# Data query to get information of the frontend environment, used for things like attaching the route 53 record
# This gets the load balancer from the frontend environment: https://registry.terraform.io/providers/hashicorp/aws/5.88.0/docs/data-sources/lb
data "aws_lb" "frontend_lb" {
  tags = {
    # The Load Balancer should have automatically the tag of the environment name assigned
    # So, match it with the frontend to get the load balancer
    "elasticbeanstalk:environment-name" = aws_elastic_beanstalk_environment.frontend.name
  }
}
