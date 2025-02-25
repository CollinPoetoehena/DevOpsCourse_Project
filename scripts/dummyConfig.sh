# Example configuration variables, create a local config.sh file and add the variables there for your local setup

# Docker script variables
CONFIG_VAR_DOCKER_REGISTRY="docker.io/poetoecuva" # Default docker registry
CONFIG_VAR_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD) # Default command that will get current git branch