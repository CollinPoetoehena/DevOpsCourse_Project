# Output variable for usage in other modules
output "eb_instance_profile_name" {
  description = "The name of EB instance profile created"
  value       = aws_iam_instance_profile.eb_instance_profile.name
}