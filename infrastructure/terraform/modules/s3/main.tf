# AWS S3 resource: https://docs.aws.amazon.com/s3/
# See provider.tf documentation link for these specific resources in Terraform

resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}