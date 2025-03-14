# AWS S3 resource: https://docs.aws.amazon.com/s3/
# See provider.tf documentation link for these specific resources in Terraform

# Record for the frontend DNS to attach a record to the domain for the load balancer from the frontend
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record
resource "aws_route53_record" "frontend_dns" {
  zone_id = var.route53_zone_id  # The Hosted Zone ID of your domain (e.g., example.com)
  name    = var.route53_subdomain_fe
  type    = "A" # Type of the record, A is used for AWS resources, such as an ELB: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html

  # Use an alias, i.e., an alias to let you route to AWS resources: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html
  alias {
    # Use the DNS name of the frontend 
    name                   = var.frontend_lb_dns_name
    # Use the Zond ID of the load balancer
    zone_id                = var.frontend_lb_zone_id
    evaluate_target_health = true
  }
}
# Same for the backend
resource "aws_route53_record" "backend_dns" {
  zone_id = var.route53_zone_id
  name    = var.route53_subdomain_be
  type    = "A"

  alias {
    # Use the DNS name of the backend 
    name                   = var.backend_lb_dns_name
    # Use the Zond ID of the load balancer
    zone_id                = var.backend_lb_zone_id
    evaluate_target_health = true
  }
}
