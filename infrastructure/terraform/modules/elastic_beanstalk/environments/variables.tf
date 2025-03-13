variable "app_sol_stack_name" {
  type = string
}

variable "app_frontend_env_name" {
  type = string
}

variable "app_backend_env_name" {
  type = string
}

variable "app_elb_sg_name" {
  description = "The name of the ELB security group"
  type        = string
}

variable "app_frontend_sg_name" {
  description = "The name of the frontend security group"
  type        = string
}

variable "app_backend_sg_name" {
  description = "The name of the backend security group"
  type        = string
}

variable "app_certificate_arn" {
  description = "ARN of the certificate from AWS Certificate Manager (ACM)"
  type = string
}

variable "eb_instance_profile_name" {
  description = "EB instance profile name"
  type = string
}

variable "aws_created_eb_app_name" {
  description = "Name of the created AWS EB application"
  type = string
}