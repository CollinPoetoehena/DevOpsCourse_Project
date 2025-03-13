# Output security group name values so that they can be used in other modules
output "elb_sg_name" {
  description = "The name of the ELB security group"
  value       = aws_security_group.eb_sg_elb.name
}

output "frontend_sg_name" {
  description = "The name of the frontend security group"
  value       = aws_security_group.eb_sg_frontend.name
}

output "backend_sg_name" {
  description = "The name of the backend security group"
  value       = aws_security_group.eb_sg_backend.name
}
