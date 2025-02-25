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
```

## Environment variables
See the dummy.env file for an example, use these variables in a .env file.


## Infrastructure Automation (Terraform & Ansible)
We use Terraform for infrastructure provisioning and Ansible for configuration management. For example:
1. Terraform to create AWS services, such as EC2 instances.
2. Ansible to configure those instances with the necessary software and deploy automatically using CI/CD pipelines from GitHub Actions for example.
```
Example project structure:
📂 my-project/
│── 📂 terraform/
│   │── 📂 modules/            # (Optional) Reusable Terraform modules
│   │   │── 📂 networking/      # Example: VPC, subnets, security groups
│   │   │── 📂 compute/         # Example: EC2, Auto Scaling
│   │   │── 📂 database/        # Example: RDS, DynamoDB
│   │── 📄 main.tf              # Main Terraform configuration
│   │── 📄 variables.tf         # Variable definitions
│   │── 📄 outputs.tf           # Outputs definitions
│   │── 📄 terraform.tfvars     # Input variables (e.g., AWS region)
│   │── 📄 provider.tf          # Provider configurations (AWS, Azure, GCP)
│   │── 📄 backend.tf           # (Optional) Remote state configuration (S3, Terraform Cloud)
│   │── 📄 versions.tf          # Terraform version constraints
│
│── 📂 ansible/
│   │── 📂 roles/               # Role-based configurations (modular)
│   │   │── 📂 webserver/       # Example: Webserver role
│   │   │── 📂 database/        # Example: Database role
│   │── 📂 inventory/           # Hosts inventory files
│   │   │── 📄 hosts.yml        # List of managed servers (IP addresses or domain names)
│   │── 📂 playbooks/           # Playbooks to execute tasks
│   │   │── 📄 deploy.yml       # Example: Deploying an application
│   │   │── 📄 configure.yml    # Example: Configuring a server
│   │── 📄 ansible.cfg          # Ansible configuration file
│   │── 📄 requirements.yml     # Ansible dependencies (collections)
│
│── 📂 scripts/                 # Optional helper scripts
│   │── 📄 init.sh              # Example: Initialization script
│
│── 📂 docs/                    # Documentation related to infrastructure
│
│── 📄 README.md                # Project documentation
│── 📄 .gitignore                # Ignore Terraform state, Ansible logs, etc.
```
