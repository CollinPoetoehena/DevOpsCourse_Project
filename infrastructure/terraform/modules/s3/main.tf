# AWS S3 resource: https://aws.amazon.com/s3/

resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}