# Infrastructure Automation (Terraform & Ansible)
We use Terraform for infrastructure provisioning and Ansible for configuration management. For example:
1. Terraform to create AWS services, such as EC2 instances.
2. Ansible to configure those instances with the necessary software and deploy automatically using CI/CD pipelines from GitHub Actions for example.
```
Example project structure (can be changed according to specific project and best practices):
📂 my-project/
│── 📂 infrastructure/           # Centralized folder for infrastructure automation
│   │── 📂 terraform/            # Terraform example structure
│   │   │── 📂 modules/          # (Optional) Reusable Terraform modules
│   │   │   │── 📂 networking/   # Example: VPC, subnets, security groups
│   │   │   │── 📂 compute/      # Example: EC2, Auto Scaling
│   │   │   │── 📂 database/     # Example: RDS, DynamoDB
│   │   │── 📄 main.tf           # Main Terraform configuration
│   │   │── 📄 variables.tf      # Variable definitions
│   │   │── 📄 outputs.tf        # Outputs definitions
│   │   │── 📄 terraform.tfvars  # Input variables (e.g., AWS region)
│   │   │── 📄 provider.tf       # Provider configurations (AWS, Azure, GCP)
│   │   │── 📄 versions.tf       # Terraform version constraints
│   │
│   │── 📂 ansible/              # Ansible example structure
│   │   │── 📂 roles/            # Role-based configurations (modular)
│   │   │   │── 📂 webserver/    # Example: Webserver role
│   │   │   │── 📂 database/     # Example: Database role
│   │   │── 📂 inventory/        # Hosts inventory files
│   │   │   │── 📄 prod          # List of managed servers (IP addresses or domain names, etc.). Can be per environment, such as prod, dev, etc.
│   │   │── 📂 vars/             # Variables for different playbooks (different than inventory files (mainly used for hosts))
│   │   │   │── 📄 vars.yml      # Variables (e.g., region)
│   │   │── 📂 playbooks/        # Playbooks to execute tasks
│   │   │   │── 📄 deploy.yml    # Example: Deploying an application
│   │   │   │── 📄 configure.yml # Example: Configuring a server
│   │   │── 📄 ansible.cfg       # Ansible configuration file
│   │   │── 📄 requirements.yml  # Ansible dependencies
│   │
│   │── 📂 scripts/              # Optional helper scripts
│   │   │── 📄 init.sh           # Example: Initialization script
│   │
│   │── 📂 docs/                 # Documentation specifically related to infrastructure
│
│── 📂 scripts/                 # Optional helper scripts
│   │── 📄 init.sh              # Example: Initialization script
|
│── 📂 docs/                     # Documentation related to infrastructure
|
│── 📄 README.md                 # Project documentation
│── 📄 .gitignore                # Ignore Terraform state, Ansible logs, etc.
```
This project structure can be changed if improvements can be made. For example, when the project gets larger more files will be present and the project structure can be changed to a more modular structure, such as splitting some files for Ansible and Terraform per environment (e.g. prod, dev, etc.).
- Terraform best practices example: https://developer.hashicorp.com/terraform/language/modules/develop/structure
- Ansible best practices example: https://docs.ansible.com/ansible/2.8/user_guide/playbooks_best_practices.html#content-organization

See other documentation files for additional information.