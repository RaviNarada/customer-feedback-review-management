# 🚀 CI/CD Pipeline Team Setup Guide

**For: Customer Feedback Review Management Team**  
**Last Updated: March 11, 2026**

---

## 📋 Overview

This guide helps your team set up the GitHub Actions CI/CD pipeline. The pipeline automates building, testing, containerizing, and deploying your application to AWS EC2.

**What this does:**
- ✅ Builds & tests React frontend and Node.js backend
- ✅ Validates infrastructure code (Terraform)
- ✅ Builds Docker images and pushes to Docker Hub
- ✅ Automatically deploys to EC2 when you push to `deployment` branch
- ✅ Sends Slack/MS Teams notifications on success/failure
- ✅ Runs security scanning (CodeQL, Snyk, Trivy)

---

## 🎯 Quick Start (5 minutes)

**Developer Role:** Push code to `deployment` branch → Automatic deployment happens ✨

**Platform Engineer Role:** Set up secrets, EC2, and AWS → Pipeline works smoothly 🔧

---

## 📝 Step 1: GitHub Repository Setup

### Clone the repository
```bash
git clone https://github.com/YOUR_GITHUB_ORG/customer-feedback-review-management.git
cd customer-feedback-review-management
```

### Verify workflow files exist
```bash
ls -la .github/workflows/
# You should see:
# - deploy.yml
# - infrastructure.yml
# - pr-checks.yml
# - security.yml
# - dependabot.yml
```

---

## 🔑 Step 2: Create GitHub Secrets

**Who does this:** Your DevOps/Platform Engineer

**How:**
1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** for each item below:

### Required Secrets (10 total)

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `DOCKER_USERNAME` | `shivayogesh` | Your Docker Hub username |
| `DOCKER_PASSWORD` | `[token]` | Docker Hub access token (NOT password) |
| `EC2_HOST` | `54.123.456.789` | EC2 instance public IP |
| `EC2_USER` | `ec2-user` | EC2 user (Amazon Linux: `ec2-user`, Ubuntu: `ubuntu`) |
| `EC2_SSH_KEY` | `[private key]` | **Full content** of EC2 SSH private key |
| `AWS_ACCESS_KEY_ID` | `AKIA...` | AWS IAM Access Key |
| `AWS_SECRET_ACCESS_KEY` | `wJal...` | AWS IAM Secret Access Key |
| `DATABASE_URL` | `mysql://user:pass@host:3306/db` | MySQL connection string |
| `JWT_SECRET` | Generate using: `openssl rand -base64 32` | JWT secret for authentication |
| `MSTEAMS_WEBHOOK` | `https://outlook.webhook.office...` | MS Teams notification webhook URL |

### Optional Secret
| Secret Name | Value | Description |
|-------------|-------|-------------|
| `SNYK_TOKEN` | `[token]` | Snyk.io token for dependency scanning |

---

## ⚙️ Step 3: Create GitHub Public Variable

**Who does this:** Your DevOps/Platform Engineer

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Variables**
2. Click **New repository variable**:

| Variable Name | Value |
|--------------|-------|
| `EC2_HOST_URL` | `http://54.123.456.789:8080` |

---

## 🖥️ Step 4: AWS Setup

### Create IAM User for Terraform

```bash
# In AWS Console → IAM → Users → Create User
# Username: terraform-deployer
# Attach policies: 
#   - AmazonEC2FullAccess
#   - AmazonVPCFullAccess
#   - AmazonS3FullAccess (for Terraform state)
#   - CloudFormationFullAccess
#
# Create Access Key → Save Access Key ID and Secret Access Key
# These become: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY secrets
```

### Create SSH Key Pair for EC2

```bash
# In AWS Console → EC2 → Key Pairs → Create Key Pair
# Name: feedback-key
# Type: RSA
# Download: feedback-key.pem

# Save the file, then display it for GitHub:
cat feedback-key.pem
# Copy entire content → PASTE INTO EC2_SSH_KEY SECRET (including BEGIN/END lines)
```

---

## 🚀 Step 5: EC2 Instance Setup

### Launch EC2 Instance

```bash
# AWS Console → EC2 → Instances → Launch Instance
# Configuration:
#   - AMI: Amazon Linux 2 (free tier eligible)
#   - Instance Type: t3.micro
#   - Key Pair: feedback-key (created above)
#   - Security Group: Allow HTTP (80), HTTPS (443), SSH (22)
#   - Storage: 20 GB
#   - Tag Name: feedback-app
```

### Setup EC2 Instance (Run once after launch)

```bash
# SSH into instance
ssh -i feedback-key.pem ec2-user@YOUR_EC2_IP

# Run setup script
curl -fsSL https://raw.githubusercontent.com/YOUR_ORG/customer-feedback-review-management/deployment/scripts/setup-ec2.sh | bash

# Verify installations
docker --version
docker-compose --version
mysql --version

# Login to Docker
docker login -u shivayogesh

# Create .env file
mkdir -p /home/ec2-user/feedback-app
cd /home/ec2-user/feedback-app
cat > .env << 'EOF'
# MySQL Database
MYSQL_ROOT_PASSWORD=strong_root_password_here
MYSQL_USER=feedback
MYSQL_PASSWORD=strong_user_password_here
MYSQL_DATABASE=feedback_db

# Application
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
PORT=8080
CORS_ORIGIN=http://YOUR_EC2_IP

# API URLs (for frontend)
VITE_API_URL=http://YOUR_EC2_IP:8080
EOF

chmod 600 .env
```

---

## 🐳 Step 6: Docker Hub Setup

### Create Docker Hub Account (if needed)

1. Go to [Docker Hub](https://hub.docker.com)
2. Sign up for free account
3. Create access token:
   - Click Profile → Account Settings → Security
   - New Access Token
   - Name: `github-actions`
   - Permissions: Read, Write, Delete
   - **Save this as `DOCKER_PASSWORD` secret**

---

## 💬 Step 7: MS Teams Notification Setup (Optional)

### Create Incoming Webhook

1. In MS Teams, go to your channel
2. Click **⋯** (more options) → **Connectors**
3. Search for "Incoming Webhook"
4. Configure → Name: `GitHub Actions`
5. Copy webhook URL → **Save as `MSTEAMS_WEBHOOK` secret**

---

## ✅ Step 8: Verify Everything Works

### Test 1: Run workflow manually
```bash
# Push to cicd branch for testing
git checkout cicd
git add .
git commit -m "test: verify CI/CD pipeline"
git push origin cicd
```

Monitor: **Actions** tab → Watch workflow run

### Test 2: Check job logs
1. Go to **Actions** tab
2. Click on latest workflow run
3. Expand each job to verify:
   - ✅ Client lint & build
   - ✅ Server lint & build
   - ✅ Terraform validation
   - ✅ Docker build & push
   - ✅ (Skip EC2 deployment on cicd branch)

### Test 3: Production deployment
```bash
# Merge to deployment and watch it deploy automatically
git checkout deployment
git merge cicd
git push origin deployment
```

Check:
- ✅ EC2 instance receives new containers
- ✅ MS Teams gets notification
- ✅ Application is accessible at `http://YOUR_EC2_IP`

---

## 🔍 Troubleshooting

### Workflow Fails: "Secret not found"
**Cause:** Secret not added to GitHub  
**Fix:** Go to Settings → Secrets → Add missing secret

### Docker Login Fails
**Cause:** Wrong DOCKER_PASSWORD  
**Fix:** Use personal access token, NOT Docker Hub password

### EC2 Deployment Fails: "Permission denied"
**Cause:** Invalid EC2_SSH_KEY  
**Fix:** Make sure you copied the ENTIRE private key (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)

### Terraform Plan Fails
**Cause:** AWS credentials missing or invalid  
**Fix:** Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct

### Application won't start on EC2
**SSH into EC2 and check:**
```bash
# View running containers
docker ps -a

# Check logs
docker logs feedback-server
docker logs feedback-client

# Check .env file
cat /home/ec2-user/feedback-app/.env

# Restart containers
docker-compose -f /home/ec2-user/feedback-app/docker-compose.yml restart
```

---

## 📊 Branch Strategy

| Branch | Purpose | Deployment |
|--------|---------|-----------|
| `cicd` | Test CI/CD changes before merging | ❌ No (for testing only) |
| `deployment` | Main production branch | ✅ Auto-deploys on push |
| `feature/*` | Feature development | ❌ No |

**Workflow:**
1. Create feature branch from `deployment`
2. Make changes, test locally
3. Create PR to `deployment`
4. Merge → **Auto-deploys to EC2** 🚀

---

## 📚 Additional Resources

- **Full Setup Guide:** See [CICD_SETUP_GUIDE.md](./CICD_SETUP_GUIDE.md)
- **Architecture Details:** See [CICD_ARCHITECTURE.md](./CICD_ARCHITECTURE.md)
- **Troubleshooting:** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Quick Reference:** See [CICD_QUICKSTART.md](./CICD_QUICKSTART.md)

---

## ❓ Quick Reference Checklist

### Before First Deployment ✅

```
☐ GitHub Secrets created (10 total)
☐ GitHub Variable created (EC2_HOST_URL)
☐ AWS IAM user created with access keys
☐ EC2 instance launched and running
☐ EC2 setup script executed
☐ Docker Hub account set up
☐ SSH key stored securely
☐ MS Teams webhook (if using notifications)
☐ .env file created on EC2
☐ docker-compose files in place
```

### For Each Deployment ✅

```
☐ Code committed and pushed
☐ Branch is 'deployment' or PR to 'deployment'
☐ Workflow passes all checks
☐ MS Teams notification received (success/failure)
☐ Application accessible at EC2 IP
```

---

## 👥 Team Roles & Responsibilities

### Platform Engineer 🔧
- [ ] Set up AWS account and IAM
- [ ] Create and launch EC2 instance
- [ ] Add all GitHub Secrets
- [ ] Run setup-ec2.sh script
- [ ] Monitor AWS costs and infrastructure

### Developer 👨‍💻
- [ ] Clone repository
- [ ] Create feature branches from `deployment`
- [ ] Make code changes
- [ ] Push to `deployment` (or merge PR)
- [ ] Check workflow status in Actions
- [ ] Verify deployment on EC2

### DevOps 🚀
- [ ] Monitor CI/CD pipeline health
- [ ] Update workflows as needed
- [ ] Manage secrets rotation
- [ ] Handle deployment issues
- [ ] Optimize build times

---

## 📞 Support

**Issues?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) first.

**Questions?** Review the detailed guides:
- Technical deep dive: [CICD_ARCHITECTURE.md](./CICD_ARCHITECTURE.md)
- Step-by-step instructions: [CICD_SETUP_GUIDE.md](./CICD_SETUP_GUIDE.md)

---

**Happy Deploying! 🎉**
