# GitHub Actions CI/CD Pipeline Setup Guide

This guide explains how to set up and configure the GitHub Actions CI/CD pipeline for the Customer Feedback Review Management system.

## Overview

The CI/CD pipeline includes:

- **Client Build & Lint**: Tests and builds React frontend
- **Server Build & Lint**: Tests and builds Node.js backend
- **Terraform Validation**: Validates infrastructure code
- **Docker Build & Push**: Builds and pushes Docker images
- **EC2 Deployment**: Deploys to AWS EC2 instances
- **Infrastructure Management**: Plans and applies Terraform changes

## Prerequisites

1. **GitHub Repository**: Push code to GitHub with these workflows in `.github/workflows/`
2. **Docker Hub Account**: For storing Docker images
3. **AWS Account**: For EC2 instances and infrastructure
4. **SSH Key Pair**: For EC2 access

## Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add the following secrets:

### Docker Secrets
```
DOCKER_USERNAME          - Your Docker Hub username
DOCKER_PASSWORD          - Your Docker Hub access token (not password)
```

### AWS Secrets
```
AWS_ACCESS_KEY_ID        - AWS IAM Access Key
AWS_SECRET_ACCESS_KEY    - AWS IAM Secret Key
AWS_REGION               - AWS region (default: us-west-2)
```

### EC2 Deployment Secrets
```
EC2_HOST                 - EC2 Instance public IP or domain
EC2_USER                 - EC2 user (usually 'ec2-user' or 'ubuntu')
EC2_SSH_KEY              - EC2 SSH private key (the full key content)
```

### Application Secrets
```
DATABASE_URL             - PostgreSQL connection string
                          Format: postgresql://user:password@host:port/database
JWT_SECRET               - Secret key for JWT token generation
                          Suggestion: openssl rand -base64 32
```

## Step-by-Step Setup

### 1. Create Docker Hub Access Token

1. Go to [Docker Hub](https://hub.docker.com)
2. Click your profile → Account Settings → Security
3. Create a New Access Token
4. Copy and save as `DOCKER_PASSWORD` in GitHub Secrets

### 2. Create AWS IAM User

1. Go to AWS IAM Console
2. Create a new user with programmatic access
3. Attach policy: `AmazonEC2FullAccess` and `AmazonVPCFullAccess`
4. Save the access key and secret key

### 3. Set Up EC2 Instance

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Update system
sudo yum update -y

# Install Docker
sudo yum install docker -y
sudo systemctl start docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 4. Add SSH Key to GitHub Secrets

```bash
# Display your EC2 SSH private key
cat ~/.ssh/your-key.pem

# Copy the full content (including BEGIN and END lines)
# Add to GitHub Secrets as EC2_SSH_KEY
```

### 5. Create Environment Variables

Add the following GitHub Environments:

**Development Environment:**
- No special protection

**Production Environment:**
- Add protection rule: "Require reviewers before deployment"
- Select team members as required reviewers

### 6. Configure Database

Create a PostgreSQL database and set the connection string:

```
postgresql://username:password@hostname:5432/feedback_db
```

Add as `DATABASE_URL` secret.

### 7. Generate JWT Secret

```bash
# Generate a secure JWT secret
openssl rand -base64 32

# Output will be something like:
# rTu3@kL9#pQ2wXmN5vB8cY1fG4hJ6sDe+zAq7rLpOw=

# Add this as JWT_SECRET secret
```

## Workflow Files

### `deploy.yml` - Main CI/CD Pipeline

**Triggers on:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs:**
1. Client lint and build
2. Server type check
3. Terraform validation
4. Docker build and push (all branches)
5. Deploy to EC2 (main branch only)

### `infrastructure.yml` - Infrastructure Management

**Triggers on:**
- Changes to `feedback-infra/` directory on main branch
- Manual workflow dispatch

**Jobs:**
1. Terraform plan
2. Terraform apply (with approval environment)

## GitHub Environments

### Production Environment

Protect production deployments:

1. Go to **Settings → Environments → Production**
2. Add protection rules:
   - Require reviewers before deployment
   - Select team members
3. Set deployment branches to `main` only

## Deployment Process

### Automatic Deployment (for main branch)

1. **Developer** pushes code to `main` branch
2. **GitHub Actions** runs all tests and checks
3. **Docker images** are built and pushed
4. **Deployment** waits for approval (if environment protected)
5. **EC2** deployment runs automatically after approval

### Manual Infrastructure Changes

1. Go to **Actions → Infrastructure - Plan & Apply**
2. Click **Run workflow**
3. Select action: `plan` or `apply`
4. GitHub will show Terraform plan output
5. Approve manual changes if needed

## Monitoring & Logs

### View Workflow Runs

1. Go to **Actions** tab in GitHub repository
2. Click on the workflow run
3. Click on specific job to see detailed logs

### Common Issues

**Docker login fails:**
- Check `DOCKER_PASSWORD` is a token, not account password
- Verify Docker Hub username is correct

**Terraform init fails:**
- Ensure AWS credentials are correct
- Check AWS region is correct in environment variables

**EC2 deployment fails:**
- Verify EC2 instance is running
- Check SSH key has correct permissions (400)
- Ensure security group allows inbound on ports 80, 8080

**Database connection fails:**
- Verify `DATABASE_URL` format is correct
- Check database server is accessible from EC2
- Ensure Prisma migrations ran successfully

## Rollback Procedures

### Rollback to Previous Docker Image

```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Pull previous image
docker pull YOUR_DOCKER_USERNAME/feedback-server:git-main-PREVIOUS_HASH

# Stop and remove current container
docker stop feedback-server
docker rm feedback-server

# Run previous version
docker run -d \
  --name feedback-server \
  --network feedback-net \
  -p 8080:8080 \
  -e DATABASE_URL="${DATABASE_URL}" \
  -e JWT_SECRET="${JWT_SECRET}" \
  YOUR_DOCKER_USERNAME/feedback-server:git-main-PREVIOUS_HASH
```

### Database Rollback

If Prisma migrations need rollback:

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip

# Enter server container
docker exec -it feedback-server sh

# Reset migrations (careful with production!)
npx prisma migrate reset --force

# Or rollback specific migration
npx prisma migrate resolve --rolled-back 20260310215234_dev
```

## Security Best Practices

1. **Secrets**: Never commit secrets to repository
2. **SSH Keys**: Store EC2 SSH keys securely
3. **Database**: Use strong passwords, limit network access
4. **IAM**: Use least privilege principles for AWS credentials
5. **Branches**: Protect main branch with required status checks
6. **Reviews**: Require PR reviews before merging to main

## Performance Optimization

### Build Caching

The pipeline uses GitHub Actions cache:
- Node modules are cached per branch
- Docker layer caching is enabled
- Builds are around 2-5 minutes

### Parallel Jobs

To speed up the pipeline:
- Client, Server, and Terraform validation run in parallel
- Docker builds start after all validation passes
- Deployment only runs on main branch

## Next Steps

1. Create all GitHub secrets
2. Set up EC2 instance with Docker
3. Push code to main branch
4. Monitor the workflow in Actions tab
5. Review logs and troubleshoot any issues

## Support

For issues or questions:
- Check GitHub Actions logs for detailed error messages
- Verify all secrets are correctly set
- Test EC2 SSH access manually
- Check Docker Hub for pushed images
- Verify Terraform state in AWS

---

**Last Updated**: March 2026
**Pipeline Version**: 2.0
