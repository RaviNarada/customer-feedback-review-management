# Terraform Infrastructure Code

This directory contains the infrastructure-as-code (IaC) for your AWS environment using Terraform.

## Setup Instructions

### For Platform Engineer Only

### Prerequisites

```bash
# Install Terraform
brew install terraform  # macOS
# or
choco install terraform  # Windows
# or
sudo apt-get install terraform  # Ubuntu/Debian

# Verify installation
terraform version

# AWS CLI installed and configured
aws configure
```

### 1. Initialize Terraform with S3 Backend

```bash
# Create S3 bucket for Terraform state (one-time setup)
aws s3api create-bucket \
  --bucket feedback-terraform-state-prod \
  --region us-west-2 \
  --create-bucket-configuration LocationConstraint=us-west-2

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket feedback-terraform-state-prod \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket feedback-terraform-state-prod \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Block public access
aws s3api put-public-access-block \
  --bucket feedback-terraform-state-prod \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 2. Initialize Terraform

```bash
cd feedback-infra

# Initialize with S3 backend
terraform init \
  -backend-config="bucket=feedback-terraform-state-prod" \
  -backend-config="key=production/terraform.tfstate" \
  -backend-config="region=us-west-2" \
  -backend-config="encrypt=true"

# Verify initialization
terraform validate
terraform fmt -recursive
```

### 3. Create terraform.tfvars

```bash
# Copy example variables file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars

# Example content:
# aws_region     = "us-west-2"
# instance_type  = "t3.micro"
# key_pair_name  = "feedback-key"
```

### 4. Plan and Apply

```bash
# View what will be created
terraform plan -out=tfplan

# Apply infrastructure changes
terraform apply tfplan

# View outputs
terraform output
```

## Directory Structure

```
feedback-infra/
├── main.tf              # Provider and main configuration
├── backend.tf           # S3 backend configuration
├── variables.tf         # Variable definitions
├── outputs.tf           # Output values
├── ec2.tf              # EC2 instance definition
├── terraform.tfvars.example  # Example variables
└── README.md           # This file
```

## Files Overview

### main.tf
- AWS provider configuration
- Terraform version requirements

### backend.tf
- S3 backend configuration for state management
- Ensures team collaboration with remote state

### variables.tf
- `aws_region`: AWS region for resources
- `instance_type`: EC2 instance type
- `key_pair_name`: EC2 key pair for SSH access

### outputs.tf
- `instance_id`: EC2 instance ID
- `instance_ip`: EC2 public IP address
- Used by CI/CD to get deployment target

### ec2.tf
- EC2 instance definition
- Security group configuration
- Elastic IP assignment

### terraform.tfvars.example
- Example values for variables
- Copy to terraform.tfvars and customize

## Common Commands

```bash
# Validate configuration
terraform validate

# Format code
terraform fmt -recursive

# Plan changes (dry-run)
terraform plan -out=tfplan

# Apply changes
terraform apply tfplan

# View current state
terraform state list
terraform state show aws_instance.feedback_server

# Destroy all resources (careful!)
terraform destroy

# Get outputs
terraform output
terraform output instance_ip

# Show resource details
terraform show

# Import existing resource
terraform import aws_instance.feedback_server i-1234567890abcdef0
```

## CI/CD Integration

### GitHub Actions Workflow

The pipeline in `.github/workflows/infrastructure.yml`:
1. **Plan**: Shows what changes will be made
2. **Apply**: Creates/updates infrastructure (on main branch only)

### Automatic S3 Backend Configuration

In CI/CD, Terraform initializes with S3 backend:

```bash
terraform init \
  -backend-config="bucket=$TF_STATE_BUCKET" \
  -backend-config="key=production/terraform.tfstate" \
  -backend-config="region=us-west-2" \
  -backend-config="encrypt=true"
```

Where `TF_STATE_BUCKET` is set in GitHub Secrets.

## Variable Values

### aws_region
- Default: `us-west-2`
- Must match EC2 availability zone
- Commonly: `us-east-1`, `us-west-2`, `eu-west-1`, `ap-southeast-1`

### instance_type
- Default: `t3.micro` (eligible for free tier)
- Options for small workloads:
  - `t3.micro`: 1 vCPU, 1 GB RAM
  - `t3.small`: 2 vCPU, 2 GB RAM
  - `t3.medium`: 2 vCPU, 4 GB RAM

### key_pair_name
- Must exist in AWS EC2
- Used for SSH access
- Create in AWS Console: EC2 → Key Pairs

## State Management

### Local State (Development Only)

For local development:
```bash
# Don't use S3 backend, use local state
terraform init  # Without -backend-config
```

⚠️ **WARNING**: Push terraform.tfstate to git only for development!

### Remote State (Production - Required)

The S3 backend provides:
- ✅ Team collaboration
- ✅ Encryption at rest
- ✅ Version history
- ✅ Locking mechanism

## Troubleshooting

### Error: "backend initialization required"

```bash
terraform init \
  -backend-config="bucket=feedback-terraform-state-prod" \
  -backend-config="key=production/terraform.tfstate" \
  -backend-config="region=us-west-2" \
  -backend-config="encrypt=true"
```

### Error: "InvalidKeyPair.NotFound"

The key pair doesn't exist in AWS:
```bash
# List available key pairs
aws ec2 describe-key-pairs --region us-west-2

# Create new key pair
aws ec2 create-key-pair --key-name feedback-key --region us-west-2
```

### Error: "Insufficient capacity"

Try different instance type or availability zone:
```bash
# Edit terraform.tfvars
instance_type = "t3.small"  # Change from t3.micro
```

### State Lock Issues

```bash
# View lock
terraform state lock

# Force unlock (use cautiously)
terraform force-unlock <LOCK_ID>
```

## Updating Infrastructure

### Adding a New Resource

1. Edit `ec2.tf` or create new file (e.g., `rds.tf`)
2. Run `terraform fmt -recursive`
3. Run `terraform validate`
4. Create PR with changes
5. After merge to dev:
   - Pipeline runs terraform plan
   - Review changes in GitHub
   - Pipeline applies changes (with approval)

### Modifying Existing Resource

1. Edit variable in `terraform.tfvars`
2. Or modify resource in `.tf` file
3. Run `terraform plan -out=tfplan` to see changes
4. Apply via `terraform apply tfplan` or PR

### Destroying Resources

```bash
# Destroy specific resource
terraform destroy -target=aws_instance.feedback_server

# Destroy all (careful!)
terraform destroy
```

## Cost Optimization

### Current Configuration
- `t3.micro`: ~$0.01/hour (free tier eligible)
- Monthly estimate: ~$7-10 (if always running)

### To Reduce Costs

1. **Stop instance when not needed**:
   ```bash
   aws ec2 stop-instances --instance-ids i-xxx --region us-west-2
   ```

2. **Use more restrictive security groups**
3. **Remove unused resources** after testing

## Security Practices

### Secrets Management
- ✅ Use GitHub Secrets for credentials
- ✅ Never commit AWS keys to git
- ✅ Rotate AWS credentials monthly
- ❌ Don't hardcode passwords

### Network Security
- ✅ Security groups restrict inbound traffic
- ✅ SSH key protected
- ✅ Enable VPC flow logs (optional)
- ❌ Don't expose database directly

### State File Security
- ✅ S3 encryption enabled
- ✅ Block public access enabled
- ✅ Versioning enabled
- ❌ Never expose terraform.tfvars

## Monitoring

### CloudWatch (Optional)

```bash
# Enable CloudWatch monitoring
# Update instance definition with monitoring = true
terraform plan
terraform apply
```

### EC2 Health Checks

```bash
# Check instance status
aws ec2 describe-instance-status --instance-ids i-xxx --region us-west-2

# Check system logs
aws ec2 get-console-output --instance-id i-xxx --region us-west-2
```

## DR and Backup

### Take AMI Snapshot

```bash
# Create image from instance
aws ec2 create-image --instance-id i-xxx --name "feedback-backup-$(date +%s)"
```

### Restore from Snapshot

```bash
# Use AMI to launch new instance
aws ec2 run-instances --image-id ami-xxx --instance-type t3.micro
```

## Documentation

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Docs](https://www.terraform.io/docs)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [GitHub Actions + Terraform](https://learn.hashicorp.com/tutorials/terraform/github-actions)

## Support

For infrastructure issues:
1. Check Terraform validate output
2. Review terraform plan output
3. Check AWS CloudTrail for API errors
4. Review EC2 system logs
5. Enable Terraform debug: `TF_LOG=DEBUG terraform plan`
