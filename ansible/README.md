# Ansible
Ansible is used for configuration management, application deployment, and orchestration. See main README.md > Prerequisites for how to install Ansible in a Linux environment.

Ansible documentation: https://docs.ansible.com/ansible/latest/index.html


## Using Ansible
```sh
# Navigate to the terraform directory
cd ansible

# Install dependencies using Ansible galaxy
ansible-galaxy collection install -r requirements.yml

# Test connection with all connected hosts
ansible all -m ping -u root

# Run a playbook, such as:
ansible-playbook playbooks/create-s3.yml

```