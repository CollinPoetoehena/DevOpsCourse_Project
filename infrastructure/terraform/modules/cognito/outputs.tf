output "cog_user_pool_name" {
  value = aws_cognito_user_pool.main_user_pool.id
}

output "cog_user_pool_domain" {
  value = aws_cognito_user_pool.main_user_pool.domain
}