# CI/CD Pipeline - Troubleshooting Guide

## How to Debug Pipeline Failures

### 1. View Detailed Logs

1. Go to **Actions** tab in GitHub
2. Click the failed workflow run
3. Click the failed job in red
4. Look at the step that failed
5. Read from the beginning of that step onwards

### 2. Understand Log Sections

Each step shows:
- **Section header**: What the step does
- **Status**: ✅ Success or ❌ Failed
- **Output**: Actual error messages
- **Timing**: How long it took

## Common Failures and Solutions

### ❌ CLIENT BUILD FAILURES

#### Error: `npm ERR! code E404 - npm ERR! 404 Not Found`

**Cause**: Missing npm package or private package not accessible

**Solution**:
```bash
cd client
npm ci        # Clean install
npm audit fix # Fix vulnerabilities
npm run build # Build again
```

#### Error: `eslint: command not found`

**Cause**: Dependencies not installed properly

**Solution**:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run lint
```

#### Error: `SyntaxError: Unexpected token`

**Cause**: TypeScript/JavaScript syntax error

**Solution**:
1. Check the file path in error message
2. Open that file and look for red squiggles
3. Run locally: `npm run build`
4. Fix and commit

### ❌ SERVER BUILD FAILURES

#### Error: `npx prisma generate` fails

**Cause**: Prisma schema is invalid

**Solution**:
```bash
cd server
npx prisma validate
npx prisma generate --skip-engine-check
```

#### Error: `tsc --noEmit` fails with type errors

**Cause**: TypeScript compilation errors

**Solution**:
```bash
cd server
npx tsc --noEmit   # See all errors
npx tsc            # Generate dist/ folder
# Fix errors and retry
```

#### Error: `npm install` takes too long

**Cause**: Poor network or large dependencies

**Solution**:
```bash
cd server
npm cache clean --force
npm install --prefer-offline
```

### ❌ DOCKER BUILD FAILURES

#### Error: `failed to load metadata for image`

**Cause**: Base image doesn't exist or wrong tag

**Solution**:
1. Check the Dockerfile base image tag
2. Verify online: `docker pull node:20-alpine`
3. Update Dockerfile if needed

#### Error: `COPY failed: file not found`

**Cause**: File path in Dockerfile is wrong

**Solution**:
1. Check Dockerfile COPY commands
2. Verify files actually exist in that path
3. Run locally: `docker build -t test ./server`

#### Error: `Docker login failed`

**Cause**: DOCKER_PASSWORD is incorrect

**Solution**:
```bash
# SSH option: Compare with local login
docker login -u your-username

# If that works:
# - Go to Docker Hub → Account Settings → Security
# - Create a NEW access token
# - Update DOCKER_PASSWORD in GitHub secrets
# - Re-run workflow
```

### ❌ TERRAFORM VALIDATION FAILURES

#### Error: `terraform validate` fails

**Cause**: Invalid HCL syntax

**Solution**:
```bash
cd feedback-infra
terraform fmt -recursive     # Format all files
terraform validate           # Check syntax
terraform plan -out=tfplan   # See what would change
```

#### Error: `provider initialization failed`

**Cause**: AWS credentials missing or invalid

**Solution**:
1. Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
2. Verify IAM user has required permissions
3. Check region is correct
4. Test locally:
   ```bash
   cd feedback-infra
   AWS_REGION=us-west-2 terraform init
   ```

#### Error: `resource type ... not supported`

**Cause**: Terraform provider version doesn't support that resource

**Solution**:
1. Check AWS provider version in main.tf
2. Update: `version = "~> 5.50"`
3. Run: `terraform init -upgrade`

### ❌ EC2 DEPLOYMENT FAILURES

#### Error: `Upload artifact failed`

**Cause**: EC2 instance not reachable

**Solution**:
1. Verify EC2 instance is **running**:
   ```bash
   aws ec2 describe-instances --instance-ids i-xxx
   ```

2. Check security group allows SSH (port 22):
   ```bash
   # In AWS Console: Check inbound rules
   ```

3. Test SSH locally:
   ```bash
   ssh -i your-key.pem -T ec2-user@your-ip
   ```

4. If SSH fails:
   - Check key permissions: `chmod 400 your-key.pem`
   - Get new public key: `ssh-keygen -y -f your-key.pem`
   - Update in AWS EC2 console

#### Error: `Docker pull failed`

**Cause**: 
- Docker not installed on EC2
- Docker daemon not running
- Wrong image name/tag

**Solution**:
1. SSH into EC2:
   ```bash
   ssh -i your-key.pem ec2-user@your-ip
   
   # Check Docker
   docker version
   docker ps
   ```

2. If Docker not running:
   ```bash
   sudo systemctl start docker
   sudo systemctl status docker
   ```

3. If Docker not installed:
   ```bash
   sudo yum install docker -y
   sudo systemctl start docker
   sudo usermod -a -G docker ec2-user
   ```

#### Error: `port 8080 already in use`

**Cause**: Old container still running or port conflict

**Solution**:
```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@your-ip

# Stop old containers
docker stop feedback-server feedback-client 2>/dev/null || true
docker rm feedback-server feedback-client 2>/dev/null || true

# Verify port is free
sudo netstat -tlnp | grep 8080

# Try deployment again
```

#### Error: `Database connection refused`

**Cause**: DATABASE_URL is wrong or database unreachable

**Solution**:
1. Verify DATABASE_URL format is correct:
   ```
   postgresql://username:password@hostname:5432/database
   ```

2. Test from EC2:
   ```bash
   ssh -i your-key.pem ec2-user@your-ip
   docker exec -it feedback-server sh
   # Inside container:
   curl -X GET postgresql://$DATABASE_URL
   ```

3. Check database server:
   - Is it running?
   - Is EC2 in same VPC/security group?
   - Can you connect from EC2 manually?

### ❌ GITHUB ACTIONS FAILURES

#### Error: `Workflow file has syntax error`

**Cause**: Invalid YAML in .github/workflows/*.yml

**Solution**:
1. Check the error message for line number
2. Open the workflow file
3. Look at that line and surrounding lines
4. Common issues:
   - Missing colons after keys: `name:` (not `name`)
   - Wrong indentation (use 2 spaces, not tabs)
   - Invalid characters in strings (use quotes)

#### Error: `Secret is not defined`

**Cause**: Secret name is wrong or not set

**Solution**:
```bash
# View all secrets
gh secret list

# Add missing secret
gh secret set SECRET_NAME -b "value"

# Or in GitHub UI:
# Settings → Secrets and variables → Actions
```

#### Error: `rate_limit exceeded`

**Cause**: Too many API calls to Docker Hub or GitHub

**Solution**:
1. Wait a few hours
2. Use GitHub Container Registry instead of Docker Hub
3. Split into smaller jobs
4. Cache more aggressively

### ❌ PR CHECK FAILURES

#### Error: `Semantic Pull Request failed`

**Cause**: PR title doesn't follow semantic commit format

**Solution**:
Use one of these prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Test changes
- `chore:` - Build/deps/etc

Example: `feat: add user authentication`

#### Error: `Dangerous files detected`

**Cause**: File contains secrets or too large

**Solution**:
1. Search for `PRIVATE KEY`, `SECRET`, `API_KEY`
2. Delete any secrets from code
3. Add large files to `.gitignore`
4. Commit and push again

## Advanced Debugging

### Check Specific Secret Value

**⚠️ WARNING: Never share secret values!**

```bash
# This shows if secret is set (but not value)
gh secret list

# To verify secret is correct:
# - Get first 4 chars: echo $SECRET_VALUE | head -c 4
# - Compare with your actual secret's first 4 chars
```

### Download Artifacts

```bash
# List available artifacts from a run
gh run view RUN_ID --log

# Download artifact
gh run download RUN_ID -n artifact-name
```

### Re-run Failed Jobs

```bash
# Re-run entire workflow
gh run rerun RUN_ID

# Re-run failed jobs only
gh run rerun RUN_ID --failed
```

### View Terraform Plan

```bash
# After terraform job runs:
gh run view RUN_ID -j terraform-plan

# Look for "Terraform Plan" section
```

## Prevention Tips

1. **Test locally first**:
   ```bash
   npm run build          # Client
   npx tsc --noEmit       # Server
   terraform plan         # Infrastructure
   docker build .         # Docker
   ```

2. **Validate before pushing**:
   ```bash
   npm run lint           # Find code issues
   git diff origin/main   # See what you changed
   ```

3. **Use a checklist** before merging:
   - ✅ Tests pass locally
   - ✅ No hardcoded secrets
   - ✅ All CI checks green
   - ✅ PR has description
   - ✅ Commit messages are clear

4. **Monitor deployments**:
   - Watch Actions tab during deployment
   - Check EC2 logs after deployment
   - Verify application is accessible

## Getting Help

1. **Check the error message** - it usually tells you what's wrong
2. **Read the full log** - scroll to see context
3. **Test locally** - reproduce the issue locally first
4. **Search known issues** - check GitHub issues
5. **Ask for help** - provide:
   - Workflow name (deploy, security, etc.)
   - Step that failed
   - Error message (full text)
   - What you changed

## Useful Commands

```bash
# Test everything locally
npm run build && npm test              # Client
npm install && npx tsc --noEmit       # Server
terraform init && terraform validate   # Infrastructure

# View workflow status
gh run list --limit 5
gh workflow list

# Check logs locally
npm run build -- --verbose
DEBUG=* npm run command

# Clean before re-running
rm -rf node_modules dist .terraform __pycache__
```

---

**Can't find your error?** 
1. Check GitHub Actions documentation
2. Search the error message on Stack Overflow
3. Check if similar issues exist in the repository
4. Create a GitHub Issue with details
