# Ansible
Ansible is used for configuration management, application deployment, and orchestration. See main README.md > Prerequisites for how to install Ansible in a Linux environment.

Ansible documentation: https://docs.ansible.com/ansible/latest/index.html


## Using Ansible
```sh
# Navigate to the terraform directory
cd infrastructure/ansible

# Install dependencies using Ansible galaxy
ansible-galaxy collection install -r requirements.yml

# Test connection with all connected hosts
ansible all -m ping -u root

# Run a playbook, such as:
ansible-playbook playbooks/x.yml

```

## Additional Explanation for Current Use Case
Currently, we use AWS Elastic Beanstalk, which is basically a managed version of EC2 (VMs). Now, Ansible has been researched and studied for this project, adding AWS libraries and a potential project structure for example. However, in this use case there is no need for Ansible at this time, as it is mainly used for configuration.

Additional explanation from our supervisor:
“If you decide to use AWS EC2s (VMs) over AWS Elastic Beanstalk (a PaaS), then Ansible will really become interesting and has a use-case. For services like AWS Elastic Beanstalk, S3 and Cognito there is no configuration past the initial deployment. So, there is no use-case for Ansible. 

When building a house, you can see Terraform as the builder and Ansible as the decorator. 
If you construct an empty house, you still need to furnish [configure] it. In that case Ansible will do that. You can ask him to add furniture [packages], paint the rooms [configure stuff] or put locks in place on the doors [user management]. 
However, if you buy a prefabricated house [managed services of AWS: S3, Beanstalk, EKS....] you can't choose the furniture or color of the paint. Everything is already done when building it. Therefore, Ansible is not useful and you can solely rely on Terraform.”

So, at this time Ansible is not used in this project, but it is still present in this project since the project structure is studied and set up for AWS for potential future usage.