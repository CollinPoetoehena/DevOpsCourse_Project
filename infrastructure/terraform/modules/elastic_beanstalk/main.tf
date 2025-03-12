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

# Security group: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group
resource "aws_security_group" "eb_sg" {
  name        = var.app_sg_name
  description = "Security group for Elastic Beanstalk to allow HTTP and backend traffic"
  # Leave vpc_id empty, it will then default to the default VPC of the region, which is what we want

  tags = {
    Name = var.app_sg_name
  }
}

# Rule for security group to allow inbound HTTP traffic on port 80 (frontend)
resource "aws_vpc_security_group_ingress_rule" "inbound_frontend" {
  security_group_id = aws_security_group.eb_sg.id
  # Allow inbound HTTP traffic on port 80 (frontend)
  cidr_ipv4   = "0.0.0.0/0" # Open to all
  from_port   = 80
  ip_protocol = "tcp"
  to_port     = 80
}

# Rule for security group to allow inbound backend traffic on port 4001 (ensure the frontend and others can access the backend)
# Without this rule, the frontend would not be able to access the backend and it would time out or say not accessible in the console, this fixed that problem
resource "aws_vpc_security_group_ingress_rule" "inbound_backend" {
  security_group_id = aws_security_group.eb_sg.id
  # Allow inbound HTTP traffic on port 80 (frontend)
  cidr_ipv4   = "0.0.0.0/0" # Open to all (Can be restricted later for security for example, but good for now)
  from_port   = 4001
  ip_protocol = "tcp"
  to_port     = 4001
}

# Rule for security group to allow all outbound traffic
resource "aws_vpc_security_group_egress_rule" "all_outbound" {
  security_group_id = aws_security_group.eb_sg.id
  # Allow all outbound traffic
  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 0
  ip_protocol = "tcp"
  to_port     = 0
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

  # Attach the custom security group
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.eb_sg.name
  }
  # TODO: need to attach security group to load balancer?
}

# Environment (uses the template), used to run the actual application
resource "aws_elastic_beanstalk_environment" "app_env" {
  name                = var.app_env_name
  application         = aws_elastic_beanstalk_application.app.name
  # Use the earlier created template for the environment
  template_name = aws_elastic_beanstalk_configuration_template.app_template.name
}