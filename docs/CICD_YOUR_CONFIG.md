# CI/CD Pipeline Setup - Your Configuration

This document is specific to your team's setup. Share this with your platform engineer.

## Your Setup Summary

✅ **Branch Strategy**: `deployment` branch for all deployments  
✅ **Database**: Docker container on EC2 (PostgreSQL)  
✅ **Registry**: Docker Hub  
✅ **Environment**: Single production EC2 instance  
✅ **Notifications**: MS Teams  
✅ **Terraform**: AWS S3 backend for state management  
✅ **Approval**: Required before production deployment  

---

## Required GitHub Secrets

### Standard Secrets (Always Required)

```
DOCKER_USERNAME           Docker Hub username
DOCKER_PASSWORD           Docker Hub access token (not password!)
AWS_ACCESS_KEY_ID         AWS IAM access key
AWS_SECRET_ACCESS_KEY     AWS IAM secret key
EC2_HOST                  EC2 public IP or domain
EC2_USER                  SSH user (ec2-user or ubuntu)
EC2_SSH_KEY               EC2 SSH private key content
DATABASE_URL              PostgreSQL connection string
JWT_SECRET                JWT secret (32+ characters)
```

### New Secrets (For Your Configuration)

```
MSTEAMS_WEBHOOK           MS Teams Incoming Webhook URL
TF_STATE_BUCKET           S3 bucket name for Terraform state
```

### How to Create MS Teams Webhook

1. Go to Microsoft Teams → Your team/channel
2. Click **⋯ More options** → **Connectors**
3. Search "Incoming Webhook"
4. Configure and copy the webhook URL
5. Add to GitHub Secrets as `MSTEAMS_WEBHOOK`

### How to Create S3 Backend Bucket

```bash
# Ask your platform engineer to run:
aws s3api create-bucket \
  --bucket feedback-terraform-state-prod \
  --region us-west-2 \
  --create-bucket-configuration LocationConstraint=us-west-2

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket feedback-terraform-state-prod \
  --versioning-configuration Status=Enabled

# Enable server-side encryption
aws s3api put-bucket-encryption \
  --bucket feedback-terraform-state-prod \
  --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'

# Block public access
aws s3api put-public-access-block \
  --bucket feedback-terraform-state-prod \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

Then add the bucket name to GitHub Secrets as `TF_STATE_BUCKET`.

---

## Workflow Details

### deploy.yml - Main CI/CD Pipeline

**Triggers on:**
- Push to `deployment` branch
- Pull request to `deployment` branch

**Auto-Deploys Only On:** Push to `deployment` (not on PRs)

**Deployment Steps:**
1. ✅ Client lint & build
2. ✅ Server type check & Prisma validation
3. ✅ Terraform validation
4. 🐳 Docker image build & push
5. ⏳ Await approval (if environment protected)
6. 🚀 EC2 deployment
7. 💬 Send MS Teams notification

### infrastructure.yml - Terraform Management

**Triggers on:**
- Push to `deployment` with changes to `feedback-infra/` folder
- Manual workflow dispatch

**Manages:**
- EC2 instance creation/updates
- Network configuration
- Security groups (optional)
- Uses S3 backend for state

---

## EC2 Setup Instructions

### For Your Platform Engineer

**Step 1: Run EC2 setup script**

```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Download and run setup script
curl https://raw.githubusercontent.com/YOUR_ORG/feedback-repo/dev/scripts/setup-ec2.sh -o setup-ec2.sh
bash setup-ec2.sh
```

**Step 2: Configure environment**

```bash
cd /opt/feedback-app

# Copy and edit environment file
cp .env.example .env
nano .env

# Update with your values:
# - POSTGRES_PASSWORD: Strong password
# - JWT_SECRET: openssl rand -base64 32
# - CORS_ORIGIN: http://your-ec2-ip
# - VITE_API_BASE_URL: http://your-ec2-ip:8080/api
```

**Step 3: Get docker-compose.yml**

The file is in the repository root. Copy to `/opt/feedback-app/`:

```bash
cd /opt/feedback-app
# Get docker-compose.yml from repo (will be deployed via CI/CD)
```

**Step 4: Start services**

```bash
cd /opt/feedback-app
docker-compose up -d
docker-compose ps
docker-compose logs -f
```

---

## Database Management

PostgreSQL runs in Docker on EC2.

### Connect to Database

```bash
# From EC2 instance
docker-compose exec postgres psql -U feedback_user -d feedback_db

# Run queries
SELECT version();
\dt  # List tables
\q   # Quit
```

### Backup Database

```bash
docker-compose exec postgres pg_dump -U feedback_user feedback_db > backup-$(date +%Y%m%d).sql
```

### Restore Database

```bash
cat backup-20260311.sql | docker-compose exec -T postgres psql -U feedback_user -d feedback_db
```

### Access Database Remotely (from dev machine)

```bash
# If security group allows port 5432
psql postgresql://feedback_user:password@your-ec2-ip:5432/feedback_db

# Or via SSH tunnel
ssh -i your-key.pem -L 5432:localhost:5432 ec2-user@your-ec2-ip
psql postgresql://feedback_user:password@localhost:5432/feedback_db
```

---

## Checking Deployment Status

### Via GitHub Actions

1. Go to **Actions** tab
2. Find the latest run
3. Check each job status:
   - ✅ Green = Success
   - ❌ Red = Failed
   - ⏳ Yellow = Running

### Via EC2

```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Check running containers
docker-compose ps

# View logs
docker-compose logs -f feedback-server    # API logs
docker-compose logs -f feedback-client    # Frontend logs
docker-compose logs -f postgres           # Database logs

# Check system resources
docker stats
free -h
df -h
```

### Test Application

```bash
# Frontend health
curl -I http://your-ec2-ip

# Backend health
curl -X POST http://your-ec2-ip:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Database connection (from EC2)
docker-compose exec postgres pg_isready -U feedback_user
```

---

## Common Tasks

### Update Application (New Deployment)

Push code to `dev` branch:

```bash
git checkout dev
git pull
# Make your changes
git commit -am "feat: add new feature"
git push origin dev
```

GitHub Actions will:
1. Run tests and checks
2. Build Docker images
3. Request approval (if configured)
4. Deploy to EC2

### Manual Docker Update on EC2

```bash
cd /opt/feedback-app

# Pull latest images
docker-compose pull

# Restart services
docker-compose up -d

# Check status
docker-compose ps
```

### Rollback to Previous Version

```bash
cd /opt/feedback-app

# Stop current services
docker-compose down

# Get previous image tags from Docker Hub
docker run feedback-server:git-dev-COMMIT_HASH

# Update docker-compose.yml with old tag
nano docker-compose.yml

# Restart
docker-compose up -d
```

### View Network Configuration

```bash
docker network ls
docker network inspect feedback-net
```

### Check Database Migrations

```bash
docker-compose logs postgres | grep -i migration
```

---

## Troubleshooting

### Deployment Failed

1. Check GitHub Actions logs for error
2. Verify all secrets are set: `gh secret list`
3. Test EC2 SSH access: `ssh -i key.pem ec2-user@host`
4. Check EC2 Docker: `docker ps`

### Services Not Starting

```bash
# Check logs
docker-compose logs --tail=50

# Restart services
docker-compose restart

# Full restart
docker-compose down
docker-compose up -d
```

### Database Connection Issues

```bash
# Test database from EC2
docker-compose exec postgres pg_isready -U feedback_user

# Check connection string format
grep DATABASE_URL /opt/feedback-app/.env
# Should be: postgresql://feedback_user:PASSWORD@postgres:5432/feedback_db
```

### Port Already in Use

```bash
# Find process using port 80
sudo lsof -i :80

# Kill the process
sudo kill -9 PID

# Or change port in docker-compose.yml
nano docker-compose.yml
docker-compose up -d
```

### MS Teams Notification Not Working

1. Verify webhook URL is correct: `echo $MSTEAMS_WEBHOOK`
2. Check webhook is still active in Teams
3. Review GitHub Actions logs for notification step

---

## Security Considerations

### .env File

⚠️ **NEVER commit .env to GitHub!**

- Already in `.gitignore`
- Contains sensitive data
- Each EC2 instance has its own copy

### SSH Key

⚠️ **NEVER share EC2_SSH_KEY!**

- Store in GitHub Secrets only
- Rotate periodically
- Use minimal permissions

### Database Password

⚠️ **NEVER hardcode passwords!**

- Use strong passwords (32+ characters)
- Store in GitHub Secrets only
- Change periodically

### AWS Credentials

⚠️ **NEVER commit AWS keys!**

- Use IAM roles when possible
- Store in GitHub Secrets only
- Rotate regularly
- Monitor AWS CloudTrail

---

## Environment Variables Reference

### For EC2 (.env file)

```
POSTGRES_USER=feedback_user
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=feedback_db
JWT_SECRET=<32-char-secret>
CORS_ORIGIN=http://your-ip
VITE_API_BASE_URL=http://your-ip:8080/api
```

### For GitHub Secrets

```
DOCKER_USERNAME=<your-dockerhub-user>
DOCKER_PASSWORD=<dockerhub-token>
AWS_ACCESS_KEY_ID=<aws-key>
AWS_SECRET_ACCESS_KEY=<aws-secret>
EC2_HOST=<ec2-public-ip>
EC2_USER=ec2-user
EC2_SSH_KEY=<4000-char-private-key>
DATABASE_URL=postgresql://feedback_user:<password>@<host>:5432/feedback_db
JWT_SECRET=<32-char-secret>
MSTEAMS_WEBHOOK=https://outlook.webhook.office.com/...
TF_STATE_BUCKET=feedback-terraform-state-prod
```

---

## Support Checklist

Before asking for help:

- [ ] Checked GitHub Actions logs
- [ ] Verified EC2 instance is running
- [ ] Confirmed all secrets are set
- [ ] Tested SSH access to EC2
- [ ] Ran `docker-compose ps` on EC2
- [ ] Checked Docker logs
- [ ] Verified security group rules
- [ ] Confirmed database connectivity

---

## Useful Links

- GitHub Actions Docs: https://docs.github.com/en/actions
- Docker Compose: https://docs.docker.com/compose
- PostgreSQL: https://www.postgresql.org/docs
- AWS EC2: https://docs.aws.amazon.com/ec2
- Terraform: https://www.terraform.io/docs

