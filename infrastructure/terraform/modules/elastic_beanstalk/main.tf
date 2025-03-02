# AWS EB resource: https://docs.aws.amazon.com/elastic-beanstalk/
# See provider.tf documentation link for these specific resources in Terraform

# Resource to create an IAM role
resource "aws_iam_role" "eb_instance_role" {
  name = "elasticbeanstalk-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Resource to attach a policy to a role
resource "aws_iam_policy_attachment" "eb_instance_role_policy" {
  name       = "eb-instance-role-attachment"
  roles      = [aws_iam_role.eb_instance_role.name]
  # Role specific for Elastic Beanstalk WebTier, can be used for the EC2 instance
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

# Resource to create an instance profile for EC2
resource "aws_iam_instance_profile" "eb_instance_profile" {
  name = "elasticbeanstalk-ec2-profile"
  # Use above created role
  role = aws_iam_role.eb_instance_role.name
}

# Application
resource "aws_elastic_beanstalk_application" "app" {
  name        = var.app_name
  description = var.app_desc
}

# Configuration template (will be used for the environment)
# For possible configuration options (settings): https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/beanstalk-environment-configuration-advanced.html
# Specifically: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
resource "aws_elastic_beanstalk_configuration_template" "app_template" {
  name                = var.app_conf_templ_name
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = var.app_sol_stack_name

  # By default, AWS EB uses a LoadBalanced environment, which creates additional resources
  # However, this is not necessary, and we can suffice with a single (VM) instance 
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
    value     = aws_iam_instance_profile.eb_instance_profile.name
  }

  # Set InstanceType for free tier eligible
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }
}

# Environment (uses the template), used to run the actual application
resource "aws_elastic_beanstalk_environment" "app_env" {
  name                = var.app_env_name
  application         = aws_elastic_beanstalk_application.app.name
  # Use the earlier created template for the environment
  template_name = aws_elastic_beanstalk_configuration_template.app_template.name
}