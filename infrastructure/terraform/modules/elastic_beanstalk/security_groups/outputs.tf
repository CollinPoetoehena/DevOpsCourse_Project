# Output security group values so that they can be used in other modules
output "elb_sg" {
  description = "The id of the ELB security group"
  value       = aws_security_group.eb_sg_elb.id
}

output "frontend_sg" {
  description = "The name of the frontend security group"
  value       = aws_security_group.eb_sg_frontend.name
}

output "backend_sg" {
  description = "The name of the backend security group"
  value       = aws_security_group.eb_sg_backend.name
}
