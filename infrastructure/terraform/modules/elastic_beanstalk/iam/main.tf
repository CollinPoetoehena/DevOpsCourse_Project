# IAM roles, policies, and instance profiles

# Resource to create an IAM role
resource "aws_iam_role" "eb_instance_role" {
  name = "elasticbeanstalk-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Resource to attach a policy to a role
resource "aws_iam_policy_attachment" "eb_instance_role_policy" {
  name       = "eb-instance-role-attachment"
  roles      = [aws_iam_role.eb_instance_role.name]
  # Role specific for Elastic Beanstalk WebTier, can be used for the EC2 instance
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

# Resource to create an instance profile for EC2
resource "aws_iam_instance_profile" "eb_instance_profile" {
  name = "elasticbeanstalk-ec2-profile"
  # Use above created role
  role = aws_iam_role.eb_instance_role.name
}