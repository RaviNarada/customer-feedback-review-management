# CI/CD Pipeline - Quick Start Guide

## 🚀 5-Minute Setup

### 1. Prerequisites Check

- [ ] GitHub repository created
- [ ] Docker Hub account with access token
- [ ] AWS account with EC2 instance
- [ ] OpenSSH installed locally
- [ ] GitHub CLI (`gh`) installed

### 2. Automatic Setup (Recommended)

```bash
# Make script executable
chmod +x scripts/setup-github-secrets.sh

# Run interactive setup
bash scripts/setup-github-secrets.sh
```

### 3. Manual Setup

Add these secrets to GitHub **Settings → Secrets and variables → Actions**:

#### Docker Credentials
```
DOCKER_USERNAME = your-dockerhub-username
DOCKER_PASSWORD = your-dockerhub-token
```

#### AWS Credentials
```
AWS_ACCESS_KEY_ID = your-aws-access-key
AWS_SECRET_ACCESS_KEY = your-aws-secret-key
```

#### EC2 Connection
```
EC2_HOST = your-ec2-public-ip
EC2_USER = ec2-user (or ubuntu)
EC2_SSH_KEY = <contents of your .pem file>
```

#### Application Config
```
DATABASE_URL = postgresql://user:pass@host:port/database
JWT_SECRET = (run: openssl rand -base64 32)
```

### 4. Configure Branch Protection

1. Go to **Settings → Branches**
2. Select **main** branch protection rule
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Dismiss stale PR approvals
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

### 5. Test the Pipeline

```bash
# Create a test branch
git checkout -b test/cicd

# Make a small change
echo "# CI/CD Testing" >> README.md

# Push and create PR
git push origin test/cicd
```

Then open GitHub and create a Pull Request. Watch the Actions tab!

## 📊 Workflow Status

Check workflow progress in **Actions** tab:

- **Green checkmark**: All checks passed ✅
- **Red X**: Build failed ❌
- **Yellow circle**: Running ⏳

## 🔄 Deployment Process

### For Pull Requests
When you open a PR, the pipeline automatically:
1. ✅ Validates code (linting, types)
2. ✅ Validates infrastructure (Terraform)
3. ✅ Runs security checks
4. Shows results as check marks

### For Main Branch
When you merge to main:
1. ✅ All PR checks run again
2. 🐳 Docker images are built
3. 📤 Images pushed to Docker Hub
4. ⏸️ **Awaits approval** for production
5. 🚀 Deploys to EC2 after approval

## 📋 Common Commands

### View Workflow Runs
```bash
gh run list          # List all runs
gh run view RUN_ID   # View specific run
```

### View Secrets
```bash
gh secret list       # List all secrets
```

### Trigger Manual Workflows
```bash
gh workflow run infrastructure.yml --ref main
```

### Check Deployment Status
```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@your-host

# Check running containers
docker ps

# View logs
docker logs feedback-server
docker logs feedback-client
```

## 🐛 Troubleshooting Quick Tips

| Issue | Solution |
|-------|----------|
| **Client build fails** | Run `cd client && npm ci && npm run build` locally |
| **Server fails** | Run `cd server && npx tsc --noEmit` locally |
| **Docker push fails** | Check DOCKER_PASSWORD is token (not password) |
| **EC2 deploy fails** | Verify EC2 instance is running and SSH key is correct |
| **Terraform fails** | Run `cd feedback-infra && terraform init && terraform validate` |

## 📚 Full Documentation

- **Setup Details**: Read [CICD_SETUP_GUIDE.md](../../docs/CICD_SETUP_GUIDE.md)
- **Architecture**: Read [CICD_ARCHITECTURE.md](../../docs/CICD_ARCHITECTURE.md)
- **Troubleshooting**: Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## ✨ Next Steps

1. ✅ Set up all secrets
2. ✅ Test with a PR
3. ✅ Monitor first deployment
4. ✅ Configure branch protection
5. ✅ Add team members to deployments
6. ✅ Set up monitoring/alerts

## 🎯 Success Criteria

- [ ] First PR successfully builds
- [ ] All checks pass on main branch
- [ ] Docker images appear in Docker Hub
- [ ] EC2 deployment completes
- [ ] Application is accessible at EC2 IP
- [ ] Health checks pass

---

**Questions?** Check the full documentation files in `/docs`
