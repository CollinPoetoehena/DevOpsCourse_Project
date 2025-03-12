# AWS Cognito resource: https://docs.aws.amazon.com/cognito/
# See provider.tf documentation link for these specific resources in Terraform

# AWS Cognito user pool: https://registry.terraform.io/providers/hashicorp/aws/5.88.0/docs/resources/cognito_user_pool
resource "aws_cognito_user_pool" "main_user_pool" {
  name                     = var.cog_user_pool_name
  # Configure email to be verified automatically
  auto_verified_attributes = ["email"]

  # Set username to case sensitive (this is the username used for sign-in and might be a bit confusing, since below
  # sets the username that can be used to email)
  username_configuration {
    case_sensitive = true
  }
  # Users can sign in using aliases, such as email, this basically says that the email can be used as username for sign-in
  # However, this is not used here to allow multiple users with the same email address (but different usernames). 
  # The code is left here for potential future changes, since it is already tested with this option previously when it was still used 
  # alias_attributes = ["email"]

  # Require email for sign-up (username and password should already be included automatically)
  schema {
    attribute_data_type = "String"
    name               = "email"
    required           = true
    mutable            = false
  }
  
  # MFA (Multi-Factor Authentication) Settings
  mfa_configuration = "OFF"
  # Tier of Cognito: https://aws.amazon.com/cognito/pricing/
  user_pool_tier = "ESSENTIALS" # Use Essentials to allow managed login page
}

# User pool domain for the managed login page: 
resource "aws_cognito_user_pool_domain" "main_user_pool_domain" {
  # Domain name should be unique globally, so errors like "Domain already associated with another user pool" mean it already exists
  domain       = var.cog_user_pool_domain
  user_pool_id = aws_cognito_user_pool.main_user_pool.id

  # Make explicitely dependent on main user pool
  depends_on = [
    aws_cognito_user_pool.main_user_pool
  ]
}

# App client for the user pool that can be used by the frontend (and backend): https://registry.terraform.io/providers/hashicorp/aws/5.88.0/docs/resources/cognito_user_pool_client
resource "aws_cognito_user_pool_client" "main_user_pool_client" {
  name = var.cog_user_pool_client
  user_pool_id = aws_cognito_user_pool.main_user_pool.id
  # Set to true so that callback urls, etc. can be set by this app client later in the frontend and/or backend code
  allowed_oauth_flows_user_pool_client = true
  # Allow several oauth flows and scopes (required if allowed oauth flows is set to true) for the client
  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_scopes = ["email", "openid", "phone", "profile", "aws.cognito.signin.user.admin"]
  # Callback urls cannot be empty with above settings, so use this default one for now, can be edited in code later
  callback_urls = ["http://localhost:3000/auth/callback"]
  # Do the same for logout urls, can be changed later
  logout_urls = ["http://localhost:3000/auth/logout"]
  # Add Cognito as an identity provider to allow the login page to have a provider (will otherwise not work without providers)
  supported_identity_providers = ["COGNITO"]

  # Make explicitely dependent on main user pool
  depends_on = [
    aws_cognito_user_pool.main_user_pool
  ]
}

# User groups in the user pool (used for assigning roles in our application). 
# No need to add custom AWS IAM roles, these are just used inside our application
resource "aws_cognito_user_group" "cog_user_group_maintainer" {
  name         = var.cog_user_group_maintainer
  user_pool_id = aws_cognito_user_pool.main_user_pool.id
  description  = "Maintainer role in our application"
}

resource "aws_cognito_user_group" "cog_user_group_admin" {
  name         = var.cog_user_group_admin
  user_pool_id = aws_cognito_user_pool.main_user_pool.id
  description  = "Admin role in our application"
}

# Create initial users for development (this can be skipped for production environments or the password can be changed)
# https://registry.terraform.io/providers/hashicorp/aws/5.88.0/docs/resources/cognito_user
# This is a user with the maintainer role
resource "aws_cognito_user" "user_maintainer" {
  user_pool_id = aws_cognito_user_pool.main_user_pool.id
  username     = "maintainer"

  # Set attributes, including email (where the welcome message will be send to)
  attributes = {
    email          = "collin.poetoehena@student.uva.nl"
    # Set email verified to true to skip manual verification step for this automatically created user
    email_verified = true
  }

  # Set temporary password. In Development this can stay the same (fill in same password on first sign-in), 
  # in production this can be changed on first sign-in or these users can be skipped completely for example 
  temporary_password = "Dev123dev#"
}
# Add the user to the maintainer group, assigning a maintainer role: https://registry.terraform.io/providers/hashicorp/aws/5.88.0/docs/resources/cognito_user_in_group
resource "aws_cognito_user_in_group" "add_user_maintainer" {
  user_pool_id = aws_cognito_user_pool.main_user_pool.id
  group_name   = aws_cognito_user_group.cog_user_group_maintainer.name
  username     = aws_cognito_user.user_maintainer.username
}

# This is a user with the admin role
resource "aws_cognito_user" "user_admin" {
  user_pool_id = aws_cognito_user_pool.main_user_pool.id
  username     = "admin"

  # Set attributes, including email (where the welcome message will be send to)
  attributes = {
    email          = "collin.poetoehena@student.uva.nl"
    # Set email verified to true to skip manual verification step for this automatically created user
    email_verified = true
  }

  # Set temporary password. In Development this can stay the same (fill in same password on first sign-in), 
  # in production this can be changed on first sign-in or these users can be skipped completely for example 
  temporary_password = "Dev123dev#"
}
# Add the user to the admin group, assigning an admin role
resource "aws_cognito_user_in_group" "add_user_admin" {
  user_pool_id = aws_cognito_user_pool.main_user_pool.id
  group_name   = aws_cognito_user_group.cog_user_group_admin.name
  username     = aws_cognito_user.user_admin.username
}

# Add normal user (does not have to be added to a group, since no group means the role is normal user)
resource "aws_cognito_user" "user_normal_user" {
  user_pool_id = aws_cognito_user_pool.main_user_pool.id
  username     = "user"

  # Set attributes, including email (where the welcome message will be send to)
  attributes = {
    email          = "collin.poetoehena@student.uva.nl"
    # Set email verified to true to skip manual verification step for this automatically created user
    email_verified = true
  }

  # Set temporary password. In Development this can stay the same (fill in same password on first sign-in), 
  # in production this can be changed on first sign-in or these users can be skipped completely for example 
  temporary_password = "Dev123dev#"
}