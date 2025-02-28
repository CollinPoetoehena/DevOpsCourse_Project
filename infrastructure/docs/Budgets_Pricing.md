# Budgest & Pricing
This project is maintained by students and executed for the DevOps course project. Therefore, all costs are payed by the students, which is why the aim is to avoid all costs, i.e. have zero costs.

After creating an AWS account, the free tier can be used: https://aws.amazon.com/free/free-tier-faqs/. This free tier allows you to use a service for free up to a specific limit for the free tier (different for each service). If you extend this limit, you will get charged the normal rate, so it is very important to be careful when using these services to avoid (unexpected) costs! 

To avoid costs, these are some helpful tips:
1. Only use AWS resources that are covered by the free tier (see the documentation from the specific AWS resource to see if it is free tier eligible). If they are not eligible for the free tier usage, it means you will get charged for them.

2. Monitor costs in the "Billing and Cost Management" in the AWS Management Console.

3. Add Budgets to get notified when costs reach above a set budge (e.g. set it to $0.1): https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html. Specifically: https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html

4. Manage your infrastructure with a tool such as Terraform to automatically create and manage your infrastructure. This allows you to automatically remove all resources created, which can be helpful for the following step.
With Terraform you just create and manage the infrastructure, but there is not really any real configuration, such as just creating the AWS Elastic Beanstalk application. When configuring them and deploying the actual applications, you need to be careful! For example, when using Ansible for this, make sure you select the free tiers (see the documentation of each specific service for which tiers/configurations are free), etc.

5. Try to always destroy the infrastructure after you are done, such as at the end of each day, to avoid unexpected and unnecessary costs! The only exceptions is if you are sure that resources are free and you need them multiple days after each other, such as for a presentation, etc., then you can remove them afterwards. If you are using Terraform for example, you can also comment out resources in the main.tf file to exclude some resources, e.g., when you only want to test one or a selection of resources.
Also, keep in mind that for some resources you will be charged for the number of resources you currently have open/running. For example, for the AWS S3 general purpose buckets it stated this on the pricing page:
```
First 2,000 general purpose buckets per account / Month	-> Free
Over 2,000 general purpose buckets per account / Month	-> $0.02 per additional general purpose bucket
```
So, if you have more than 2000 general purpose buckets open at an account, you will not get charged. However, if you have 2001 or more buckets open at one point in time on your account, you will be charged $0.02 per month per bucket you have open over 2000. This does not mean the total number of buckets created, this is about the total number of buckets currently open for an account, so not the total number of buckets created (verified by chatbot from AWS). So, if you have created more than 2000 buckets in your account and also deleted them (so you do not have more than 2000 general purpose buckets currently open in your account), you will not be charged. 