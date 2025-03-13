# Security groups

# Security group: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group
# Security group for elastic beanstalk environment
resource "aws_security_group" "eb_sg" {
  name        = var.app_sg_name
  description = "Security group for Elastic Beanstalk to allow HTTP and backend traffic"
  # Leave vpc_id empty, it will then default to the default VPC of the region, which is what we want

  tags = {
    Name = var.app_sg_name
  }
}
# Rule for security group to allow inbound HTTP traffic on port 80 (frontend)
# This should also allow the load balancer to communicate with the EB environment (goes through port 80)
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
  cidr_ipv4   = "0.0.0.0/0" # Open to all
  from_port   = 0
  ip_protocol = "tcp"
  to_port     = 0
}
# # Allow EB Instances to Respond to Load Balancer
# resource "aws_vpc_security_group_egress_rule" "allow_eb_to_elb" {
#   security_group_id        = aws_security_group.eb_sg.id
#   cidr_ipv4   = "0.0.0.0/0" # Open to all
#   from_port                = 80
#   to_port                  = 80
#   ip_protocol              = "tcp"
# }

# TODO: below for load balancer extras?
# # Security Group for Load Balancer
# resource "aws_security_group" "elb_sg" {
#   name        = var.app_elb_sg_name
#   description = "Security group for Elastic Beanstalk Load Balancer"
#   # Leave vpc_id empty, it will then default to the default VPC of the region, which is what we want

#   tags = {
#     Name = var.app_elb_sg_name
#   }
# }
# # Rule for security group to allow HTTPS traffic to the Load Balancer
# resource "aws_vpc_security_group_ingress_rule" "inbound_allow_https_to_elb" {
#   security_group_id = aws_security_group.elb_sg.id
#   cidr_ipv4   = "0.0.0.0/0" # Open to all
#   from_port   = 443 # HTTPS inbound traffic default port
#   ip_protocol = "tcp"
#   to_port     = 443
# }
# # Rule for security group to allow communication with EB instances
# resource "aws_vpc_security_group_ingress_rule" "allow_http_from_elb_to_instances" {
#   security_group_id = aws_security_group.elb_sg.id
#   cidr_ipv4   = "0.0.0.0/0" # Open to all
#   from_port   = 443 # HTTPS inbound traffic default port
#   ip_protocol = "tcp"
#   to_port     = 443
# }
# # Allow outbound traffic from the Load Balancer
# resource "aws_vpc_security_group_egress_rule" "allow_all_outbound_from_elb" {
#   security_group_id = aws_security_group.elb_sg.id
#   # Allow all outbound traffic
#   cidr_ipv4   = "0.0.0.0/0"
#   # Allows all port ranges and protocols (no need for from and to port to be set anymore)
#   ip_protocol = "-1"
# }