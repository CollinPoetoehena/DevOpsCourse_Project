# AWS Cognito resource: https://docs.aws.amazon.com/cognito/
# See provider.tf documentation link for these specific resources in Terraform

resource "aws_cognito_user_pool" "main_user_pool" {
  name                     = var.cog_user_pool_name
  auto_verified_attributes = ["email"]
}

# resource "aws_cognito_identity_provider" "main_provider" {
#   user_pool_id  = aws_cognito_user_pool.main_user_pool.id
#   # Use Google as possible provider
#   provider_name = "Google"
#   provider_type = "Google"

#   provider_details = {
#     authorize_scopes = "email"
#     client_id        = "your client_id"
#     client_secret    = "your client_secret"
#   }

#   attribute_mapping = {
#     email    = "email"
#     username = "sub"
#   }
# }