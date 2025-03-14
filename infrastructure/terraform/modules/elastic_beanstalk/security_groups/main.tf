# Security groups
# Full explanation security groups: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html
# For full rules explanation, see: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-rules-reference.html

# Security group: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group
# Security group for elastic beanstalk environment for the frontend
resource "aws_security_group" "eb_sg_frontend" {
  name        = var.app_frontend_sg_name
  description = "Security group for Elastic Beanstalk Frontend environment"
  # Leave vpc_id empty, it will then default to the default VPC of the region, which is what we want

  tags = {
    Name = var.app_frontend_sg_name
  }
}
# Rule for security group to allow inbound HTTP traffic on port 80 (frontend).
# This is where the open internet accesses the application as well
# This should also allow the load balancer to communicate with the EB environment (goes through port 80)
# Ingress rules: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_security_group_ingress_rule
resource "aws_vpc_security_group_ingress_rule" "fe_inbound" {
  security_group_id = aws_security_group.eb_sg_frontend.id
  # Allow inbound HTTP traffic on port 80 (frontend)
  cidr_ipv4   = "0.0.0.0/0" # Open to all
  from_port   = 80
  ip_protocol = "tcp"
  to_port     = 80
}
# Allow all outbound traffic from the frontend
# Egress rules: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_security_group_egress_rule
resource "aws_vpc_security_group_egress_rule" "fe_all_outbound" {
  security_group_id = aws_security_group.eb_sg_frontend.id
  cidr_ipv4         = "0.0.0.0/0" # Open to all
  ip_protocol       = "-1" # Allow all protocols
}

# Security group for the backend
resource "aws_security_group" "eb_sg_backend" {
  name        = var.app_backend_sg_name
  description = "Security group for Elastic Beanstalk Backend environment"
  # Leave vpc_id empty, it will then default to the default VPC of the region, which is what we want

  tags = {
    Name = var.app_backend_sg_name
  }
}
# Rule for security group to allow all outbound traffic (not best for security, but ok for now)
resource "aws_vpc_security_group_ingress_rule" "be_all_tcp_inbound" {
  security_group_id = aws_security_group.eb_sg_backend.id
  # Allow all traffic
  cidr_ipv4   = "0.0.0.0/0" # Open to all
  # Allow all ports manually
  from_port   = 1
  to_port     = 65535
  ip_protocol = "tcp"
}
# Allow all outbound traffic from the backend
resource "aws_vpc_security_group_egress_rule" "be_all_outbound" {
  security_group_id = aws_security_group.eb_sg_backend.id
  cidr_ipv4         = "0.0.0.0/0" # Open to all
  ip_protocol       = "-1" # Allow all protocols
}

# Security group for the Elastic Load Balancer (ELB)
resource "aws_security_group" "eb_sg_elb" {
  name        = var.app_elb_sg_name
  description = "Security group for Elastic Beanstalk Load Balancer"
  # Leave vpc_id empty, it will then default to the default VPC of the region, which is what we want

  tags = {
    Name = var.app_elb_sg_name
  }
}
# Rule for inbound HTTPS traffic to the load balancer
resource "aws_vpc_security_group_ingress_rule" "inbound_https" {
  security_group_id = aws_security_group.eb_sg_elb.id
  # Allow inbound HTTP traffic on port 80 (frontend and backend)
  cidr_ipv4   = "0.0.0.0/0" # Open to all
  from_port   = 443
  ip_protocol = "tcp"
  to_port     = 443
}
# Allow all outbound traffic from the Load Balancer
resource "aws_vpc_security_group_egress_rule" "elb_all_outbound" {
  security_group_id = aws_security_group.eb_sg_elb.id
  cidr_ipv4         = "0.0.0.0/0" # Open to all
  ip_protocol       = "-1" # Allow all protocols
}

# Old rules:
# # Rule for security group to allow inbound backend traffic on port 4001 (ensure the frontend and others can access the backend)
# # Without this rule, the frontend would not be able to access the backend and it would time out or say not accessible in the console, this fixed that problem
# resource "aws_vpc_security_group_ingress_rule" "inbound_backend" {
#   security_group_id = aws_security_group.eb_sg.id
#   # Allow inbound HTTP traffic on port 80 (frontend)
#   cidr_ipv4   = "0.0.0.0/0" # Open to all (Can be restricted later for security for example, but good for now)
#   from_port   = 4001
#   ip_protocol = "tcp"
#   to_port     = 4001
# }