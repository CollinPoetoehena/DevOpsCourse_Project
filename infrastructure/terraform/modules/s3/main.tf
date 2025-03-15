# AWS Route 53 resource: https://docs.aws.amazon.com/route53/
# See provider.tf documentation link for these specific resources in Terraform

# Create S3 bucket: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket
resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name

  tags = {
    Name        = "Main bucket for the application"
    Environment = "Dev"
  }
}

# Disable public access block settings (Allow public access)
resource "aws_s3_bucket_public_access_block" "allow_public_access" {
  bucket = aws_s3_bucket.bucket.id

  block_public_acls       = false  # Allow ACLs if needed
  block_public_policy     = false  # Allow public bucket policies
  ignore_public_acls      = false  # Ensure ACLs work properly
  restrict_public_buckets = false  # Ensure objects can be accessed publicly
}

# Create IAM Policy Document for Public Read Access to /uploads/*
data "aws_iam_policy_document" "public_read_policy" {
  statement {
    sid       = "PublicReadForUploads"
    effect    = "Allow"
    principals {
      type        = "*"
      identifiers = ["*"]  # Allows access from any user
    }

    actions = ["s3:GetObject"]  # Only allow reading objects, not listing bucket contents

    resources = [
      "${aws_s3_bucket.bucket.arn}/uploads/*"  # Only allow access to files inside /uploads
    ]
  }
}

# Apply the Public Read Policy to the S3 Bucket
resource "aws_s3_bucket_policy" "public_read_policy" {
  bucket = aws_s3_bucket.bucket.id
  # Use above created document for this policy
  policy = data.aws_iam_policy_document.public_read_policy.json

  # Ensures allow_public_access is created first to avoid error "public policies are blocked by the BlockPublicPolicy block public access setting"
  depends_on = [
    aws_s3_bucket_public_access_block.allow_public_access
  ]
}