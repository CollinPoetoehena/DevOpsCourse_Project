# DevOps course project

## Main prerequisites
These installation guides assume a Linux environment (with WSL for Windows for example). Before each instruction, it is expected to have a Linux environment op, which can be opened in Windows with the following steps with WSL:
```sh
# (Open WSL on Windows in a terminal)
wsl 
```

### Backend and frontend
```sh
# You can run the files as containers using Docker, see the scripts folder and the docs/Docker.md file.
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
For full information and guide see: https://docs.ansible.com/ansible/latest/installation_guide/installation_distros.html#installing-ansible-on-ubuntu 

Ansible documentation: https://docs.ansible.com/ansible/latest/index.html

```sh
# Update apt
sudo apt update

# Install necessary software, add ansible to apt and install ansible:
sudo apt install software-properties-common
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt install ansible --yes
# Alternatively, you can use the default installation setup, such as using pip or pipx: https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html

# Verify installation:
ansible --version
```

## Environment variables
See the dummy.env file for an example, use these variables in a .env file.

In GitHub, you can create secrets and variables for GitHub Actions in Settings > Security > Secrets and variables > Actions for example:
- https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions
- https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables 

For the secrets and variables:
- Do not add quotes around values (only for strings with spaces for example, but not with URLs). This can cause problems in GitHub Actions, such as:
```
getaddrinfo ENOTFOUND 'http
```
This happened because the BACKEND_URL was inside '' in the GitHub environment variables. However, when removing the '' around it, it worked without problems.

### Required variables for GitHub Actions
The following repository secrets need to be created:
- DOCKER_USERNAME: Docker Hub username
- DOCKER_ACCESS_TOKEN: Docker personal access token (with read, write and delete permission): https://docs.docker.com/security/for-developers/access-tokens/

For the environment secrets, create an environment called backend and add the following secrets (see backend/dummy.env):
- MONGO_URI: MongoDB connection string
- SECRET_KEY: bcrypt secret key
- FACTOR: bcrypt factor
- ROLE: bcrypt role
And add the following environment variables:
- API_NAME: Name of the API
- API_PORT: Port of the API
- API_VERSION: Version of the API
- FRONTEND_URL: Frontend URL
- BACKEND_URL: Backend URL
- VEHICLE_URL: URL of the vehicle API

TODO: create environment cloud and add secrets there for deployment:
- AWS_ACCESS_KEY_ID: AWS access key id
- AWS_SECRET_ACCESS_KEY: AWS access key secret
TODO


## Infrastructure Automation (Terraform & Ansible)
We use Terraform for infrastructure provisioning and Ansible for configuration management. For example:
1. Terraform to create AWS services, such as EC2 instances.
2. Ansible to configure those instances with the necessary software and deploy automatically using CI/CD pipelines from GitHub Actions for example.
```
Example project structure (can be changed according to specific project and best practices):
📂 my-project/
│── 📂 terraform/               # Terraform example structure: https://developer.hashicorp.com/terraform/language/modules/develop/structure
│   │── 📂 modules/             # (Optional) Reusable Terraform modules
│   │   │── 📂 networking/      # Example: VPC, subnets, security groups
│   │   │── 📂 compute/         # Example: EC2, Auto Scaling
│   │   │── 📂 database/        # Example: RDS, DynamoDB
│   │── 📄 main.tf              # Main Terraform configuration
│   │── 📄 variables.tf         # Variable definitions
│   │── 📄 outputs.tf           # Outputs definitions
│   │── 📄 terraform.tfvars     # Input variables (e.g., AWS region)
│   │── 📄 provider.tf          # Provider configurations (AWS, Azure, GCP)
│   │── 📄 versions.tf          # Terraform version constraints
│
│── 📂 ansible/                 # Ansible example structure: https://docs.ansible.com/ansible/2.8/user_guide/playbooks_best_practices.html#content-organization
│   │── 📂 roles/               # Role-based configurations (modular)
│   │   │── 📂 webserver/       # Example: Webserver role
│   │   │── 📂 database/        # Example: Database role
│   │── 📂 inventory/           # Hosts inventory files
│   │   │── 📄 prod             # List of managed servers (IP addresses or domain names, etc.). Can be per environment, such as prod, dev, etc.
│   │── 📂 vars/                # Variables for different playbooks (different than inventory files (mainly used for hosts))
│   │   │── 📄 vars.yml         # Variables (e.g., region)
│   │── 📂 playbooks/           # Playbooks to execute tasks
│   │   │── 📄 deploy.yml       # Example: Deploying an application
│   │   │── 📄 configure.yml    # Example: Configuring a server
│   │── 📄 ansible.cfg          # Ansible configuration file (for global configurations)
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
This project structure can be changed if improvements can be made. For example, when the project gets larger more files will be present and the project structure can be changed to a more modular structure, such as splitting some files for Ansible and Terraform per environment (e.g. prod, dev, etc.)