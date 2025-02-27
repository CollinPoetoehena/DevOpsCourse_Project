# Credentials

To use the infrastructure tools, credentials should be configured. 

## AWS 
For this tutorials we will use AWS, since this is the main provider we use in this project.

### Loading credentials from .env file
```sh
# Load/export environment variables from the .env file in the infrastructure folder
cd infrastructure
# grep searches through the .env file.
# -v means invert match (i.e., exclude lines that match the pattern).
# '^#' filters out commented lines (lines that start with #).
# sed -e 's/\r//g' -> Removes Windows-style line endings (^M).
# sed -e 's/[[:space:]]*$//' -> Removes trailing spaces.
# xargs takes the filtered output from grep and converts it into a single-line argument to be able to execute it
# Or with additional cleanups:
export $(grep -v '^#' .env | sed -e 's/\r//g' -e 's/[[:space:]]*$//' | xargs)
# Verify variables have been loaded
printenv | grep AWS
# REMEMBER: this only loads it in the current terminal session, so this has to be done in the same terminal session you use Terraform with!


# If something fails due to authentication, such as terraform plan:
# Verify loaded environment variables with one of the variables in the .env file (-A shows hidden characters):
printenv | grep AWS | cat -A
# The normal format is for example: AWS_REGION=eu-central-1$
# But other characters like ^M should not be present
# This was a problem that occurred before, where terraform plan failed:
Error: Retrieving AWS account details: validating provider credentials: retrieving caller identity from STS: operation error STS: GetCallerIdentity, decomposing request: net/http: invalid header field value for "Authorization"
# This was caused due to the special character ^M (Windows style line endings in the .env file), which was loaded by:
export $(grep -v '^#' .env | xargs)
# However, this did not filter that out (what the new above command does), which caused Terraform to fail authentication with AWS.
```