# Main prerequisites
These installation guides assume a Linux environment (with WSL for Windows for example). Before each instruction, it is expected to have a Linux environment op, which can be opened in Windows with the following steps with WSL:
```sh
# (Open WSL on Windows in a terminal)
wsl 
```

## Docker 
Installing Docker Desktop is the easiest way to install and use Docker: https://docs.docker.com/desktop/

Download Docker Desktop on your main OS, such as the .msi for Windows: https://docs.docker.com/desktop/setup/install/windows-install/

Then enable WSL as the backend for Windows (if not the default already): https://docs.docker.com/desktop/features/wsl/


## Homebrew on Linux
Follow this guide: https://docs.brew.sh/Homebrew-on-Linux. The command for linux can be found here: https://brew.sh/

At the time of making this it was the following command (but see the guide for the latest version, as this might have changed):
```sh
# Install homebrew on linux
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# After installing it, follow the next steps shown in the terminal
# Verify installation 
brew install hello
```

## Terraform
For full information and guide see: https://developer.hashicorp.com/terraform/install?product_intent=terraform#linux 

Terraform documentation: https://www.terraform.io/

```sh
# Use Homebrew on Linux for installation
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Then test the installation:
terraform -version
``` 

## Ansible
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