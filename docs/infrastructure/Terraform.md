# Terraform
Terraform is used for provisioning and managing the cloud infrastructure. See main README.md > Prerequisites for how to install Terraform in a Linux environment.

Terraform documentation: https://www.terraform.io/

## Using Terraform
```sh
# Make sure you followed the Credentials.md to load the environment variables in the terminal session!

# Navigate to the terraform directory
cd infrastructure/terraform

# Initialize: Prepares Terraform and downloads provider plugins
terraform init
# Plan: Shows a preview of what Terraform will do (might take some time)
terraform plan
# Apply: Provisions the infrastructure as defined (might take some time)
terraform apply
# Destroy: Removes the infrastructure when no longer needed (might take some time)
terraform destroy

# Run with auto approve (avoids manual required prompt)
terraform apply -auto-approve
terraform destroy -auto-approve

# To remove specific infrastructure resources, you can at a target to destroy, such as only the aws eb environment:
terraform destroy \
  -target="module.elastic_beanstalk.aws_elastic_beanstalk_environment.app_env" \
  -auto-approve
# The whole module
terraform destroy \
  -target="module.elastic_beanstalk" \
  -auto-approve
# The targets are referenced by main.tf in the root of Terraform, from there you can select the targets (you can add more targets)
# OR: you can comment out parts of your infrastructure and do apply (it will remove the commented parts)
# For example, you can comment out whole modules, or just a part of a module in its main.tf, such as aws_elastic_beanstalk_environment.app_env
terraform apply -auto-approve

# You can do the same with apply, such as only applying a specific module
terraform apply \
  -target="module.cognito" \
  -auto-approve
```

After creating your resources, you can view and monitor them in the AWS Management Console for example. You can also see potential errors there that might not be reported by Terraform, such as when creating the AWS Elastic Beanstalk environment, etc. Also, you can see the exact configuration of the resources there. You can use this to see if you might need to change some things in the Terraform code for example.

Something that might help is reading the documentation of the resources extensively to get a good overview of how everything works. Also, manually following some steps in the AWS Management Console might also help you understand the creation and configuration steps (do NOT forget to cancel/delete afterwards). For example, if you first manually create and test some resources, you can understand how it works and then when it works you can make the same resources and configuration of those resources with Terraform (this is what I did with Route 53 and ACM for certification with the Elastic Load Balancer for the AWS Elastic Beanstalk environment for example).

**VERY IMPORTANT:** Try to always destroy the infrastructure after you are done, such as at the end of each day (or more often after testing an application deployment for example, as these also use resources in the background, or you can stop the instance running in the Management Console, etc.), to avoid unexpected and unnecessary costs! The only exceptions is if you are sure that resources are free and you need them multiple days after each other, such as for a presentation, etc. You can comment out resources in the main.tf file to exclude some resources, e.g., when you only want to test one or a selection of resources.

What you can also do is empty/clean resources that are not priced per usage time for example. For example, the AWS Elastic Beanstalk environment uses an EC2 instance, which (at the time of writing) is priced per usage time and storage. So, these ones you should delete each time. However, the AWS S3 and AWS Cognito user pools resources are (at the time of writing) priced mostly per storage and Monthly Active Users (MAU), which you can also just clean/empty each time to avoid having to delete all of them every time. See above commands for only destroying a selection of resources. You can empty/clean those resources in the AWS Management Console for example. So, look at the pricing and keep an eye on your Bills/Costs in the AWS Management Console and find a sweet spot for this what works best for you. But still delete them when you are completely done with them, this is more when you are developing with them for multiple days for example, etc. When you are done with it you should always delete it to avoid unexpected costs!

If costs are less important or you are not in the situation where you need to personally develop and pay for the resources, you can omit this step and instead stop the resources when not used or always keep them on, depending on your specific situation.


## Additional Manual Steps
Unfortunately, not all steps can be automated. The following manual steps can still be done:

### AWS Route 53 purchase domain name
The first step is to purchase a domain name. See Domains_Cerficiation.md and then the first step, where a domain name is created with AWS Route 53. The second and all subsequent sections and steps can be skipped, since the rest is created with Terraform. Create a domain name (if not done already) for: rent-a-car-cloud.click

This has to be done before running the Terraform command to create the infrastructure, since this is used by the Terraform modules.

Terraform further creates the record for Route 53, certificate and listener for the load balancer, among other things.


### AWS Cognito Domain Setup
The AWS Cognito resource is setup with a domain for the login page, however, this is not the best design. To add a new design using the new Managed Login feature, follow these steps:

1. Go to the user pool > Branding > Domain
2. Select the Actions dropdown > Edit cognito domain branding version > Select "Managed Login - Recommended" > Save changes.
3. Go to Branding > Managed Login > Create a style > Select the App client created with Terraform > create.
This should now use the default Managed Login page, with your configured attributes, such as email. This should be good enough, so you can leave it like this!
4. To view the login page, Go to Applications > App clients > select the App client created with Terraform > click "View login page" at the top right of the screen.

Now you should be able to see the new login page. The default is more than good enough for this. This new setup is not required, but this is a way better design than the old "Hosted UI (classic)" one, which is the default. This cannot be changed in Terraform as of right now, but maybe in the future.

When you destroy the infrastructure now with Terraform you should manually delete this domain as Terraform will otherwise give an error saying the configured environment cannot be deleted:
- Go to Branding > Domain > select the Actions dropdown > Select "Delete Cognito domain".
Now the Terraform destroy command should work.
