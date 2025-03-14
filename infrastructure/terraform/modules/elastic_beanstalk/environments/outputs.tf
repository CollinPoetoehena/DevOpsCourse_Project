# Output the frontend load balancer dns name for usage in other modules
output "frontend_lb_dns_name" {
  description = "The DNS name of the frontend Load Balancer"
  # Use the data source in main.tf of this module to get the dns name
  value       = data.aws_lb.frontend_lb.dns_name
}
output "frontend_lb_zone_id" {
  description = "The zone ID of the frontend Load Balancer"
  # Use the data source in main.tf of this module
  value       = data.aws_lb.frontend_lb.zone_id
}

# Same for the backend
output "backend_lb_dns_name" {
  description = "The DNS name of the backend Load Balancer"
  # Use the data source in main.tf of this module to get the dns name
  value       = data.aws_lb.backend_lb.dns_name
}
output "backend_lb_zone_id" {
  description = "The zone ID of the backend Load Balancer"
  # Use the data source in main.tf of this module
  value       = data.aws_lb.backend_lb.zone_id
}