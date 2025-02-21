# DevOps course project

## Prerequisites
These installation guides assume a Linux environment (with WSL for Windows for example). Before each instruction, it is expected to have a Linux environment op, which can be opened in Windows with the following steps with WSL:
```sh
# (Open WSL on Windows in a terminal)
wsl 
```

### Homebrew on Linux
Follow this guide: https://docs.brew.sh/Homebrew-on-Linux. The command for linux can be found here: https://brew.sh/

At the time of making this it was the following command (but see the guide for the latest version, as this might have changed):
```sh
# Install homebrew on linux
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# After installing it, follow the next steps shown in the terminal
# Verify installation 
brew install hello
```

### Terraform
For full information and guide see: https://developer.hashicorp.com/terraform/install?product_intent=terraform#linux 

Terraform documentation: https://www.terraform.io/

```sh
# Use Homebrew on Linux for installation
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Then test the installation:
terraform -version
``` 

### Ansible
For full information and guide see: https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible 

Ansible documentation: https://docs.ansible.com/ansible/latest/index.html

```sh
# Update apt
sudo apt update && sudo apt upgrade -y

# Install Ansible
sudo apt install ansible -y
# Verify installation:
ansible --version

# [web-server1]
# ec2-xx-xx-xxx-xxx.compute-1.amazonaws.com

# [web-server2]
# ec2-xx-xxx-xxx-xxx.compute-1.amazonaws.com

# [cluster:children]
# web-server1
# web-server2

# [cluster:vars]
# ansible_ssh_user=ubuntu
# ansible_ssh_private_key_file=/home/ubuntu/lab_user.pem
# ansible_ssh_common_args='-o StrictHostKeyChecking=no'
```