# 🚀 CI/CD Pipeline - Quick Reference for Developers

## Your Setup

```
Branch: deployment → Docker Hub → EC2 → MS Teams Notification
```

## Key Files Created

```
.github/workflows/
  ├── deploy.yml              # Main CI/CD pipeline (deployment branch)
  ├── infrastructure.yml      # Terraform management (S3 backend)
  ├── security.yml            # Security scanning (daily)
  └── pr-checks.yml           # PR validation
  
feedback-infra/
  ├── README.md               # Infrastructure setup guide
  ├── backend.tf              # S3 Terraform backend config
  ├── main.tf, variables.tf, outputs.tf, ec2.tf
  
scripts/
  ├── setup-ec2.sh            # EC2 instance initialization
  ├── setup-github-secrets.sh # Automated secret setup
  
docs/
  ├── CICD_YOUR_CONFIG.md     # Your specific setup details
  ├── CICD_SETUP_GUIDE.md     # Comprehensive setup guide
  ├── CICD_ARCHITECTURE.md    # Architecture overview
  ├── CICD_QUICKSTART.md      # Quick start guide
  └── TROUBLESHOOTING.md      # Troubleshooting guide
  
Root:
  ├── docker-compose.yml      # Local and EC2 deployment
  ├── .env.docker-example     # Environment template for docker-compose
  
client/
  └── .env.example            # Frontend env template
  
server/
  └── .env.example            # Backend env template
```

## What Happens When You Push to `deployment`

```
1. You push code to deployment branch
   ↓
2. GitHub Actions automatically runs:
   • ESLint (frontend)
   • TypeScript checks (backend)
   • Terraform validation
   ↓
3. If all checks pass:
   • Build Docker images
   • Push to Docker Hub
   ↓
4. Deployment to EC2:
   • Wait for approval (if configured)
   • SSH into EC2
   • Pull new Docker images
   • Stop old containers
   • Start new containers
   ↓
5. Send notification to MS Teams:
   • "✅ Deployment Successful" (green)
   • "❌ Deployment Failed" (red)
```

## Development Workflow

### 1. Clone Repository (You Already Did This ✅)

```bash
git clone <repo-url>
cd customer-feedback-review-management
```

### 2. Create Feature Branch (from deployment)

```bash
git checkout deployment
git pull origin deployment
git checkout -b feature/your-feature-name
```

### 3. Make Changes & Test Locally

**Frontend:**
```bash
cd client
npm install
npm run dev              # Start dev server
npm run build           # Test build
npm run lint            # Check code
```

**Backend:**
```bash
cd ../server
npm install
npx tsc --noEmit       # Check types
npm run dev            # Start dev server
```

### 4. Commit with Semantic Messages

```bash
git add .
git commit -m "feat: add user authentication feature"
# or
git commit -m "fix: resolve database connection issue"
git commit -m "docs: update README"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then on GitHub, create a PR to `deployment` branch.

### 6. Automated Checks Run

GitHub will automatically:
- ✅ Run ESLint
- ✅ Check TypeScript
- ✅ Validate Terraform
- ✅ Run security scans
- Show results as check marks

### 7. Address Any Failures

If checks fail:
1. Fix the issues locally
2. Commit and push
3. Checks run again automatically

### 8. After PR Approval

```bash
# Merge PR to deployment (click on GitHub or):
git checkout deployment
git merge feature/your-feature-name
git push origin deployment
```

### 9. Automatic Deployment Starts

Once you push to deployment:
1. CI/CD runs all tests
2. Docker images are built
3. Deployment to EC2 starts
4. MS Teams gets notified

---

## Testing Locally Before Deploying

### Test Client Build

```bash
cd client
npm run build
npm run preview
```

### Test Server Build

```bash
cd server
npx tsc --noEmit
npm run build
```

### Test Full Stack with Docker Compose

```bash
# Build images locally
docker build -t feedback-server:local ./server
docker build -t feedback-client:local ./client

# Update docker-compose.yml to use local images
# Then run:
docker-compose up -d

# View logs
docker-compose logs -f

# Test endpoints
curl http://localhost              # Frontend
curl http://localhost:8080/api/*   # Backend
```

---

## Checking Pipeline Status

### While Development

View the Actions tab in GitHub:
```
GitHub → Actions → Select workflow → Click latest run
```

Color indicators:
- 🟢 **Green**: All passed
- 🔴 **Red**: Failed (check logs)
- 🟡 **Yellow**: Running

### After Deployment

Check MS Teams:
- ✅ Green card: Deployment succeeded
- ❌ Red card: Deployment failed

Or SSH into EC2:
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
docker-compose ps
docker-compose logs -f
```

---

## Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| **Client lint fails** | Run `cd client && npm run lint -- --fix` |
| **TypeScript errors** | Run `cd server && npx tsc --noEmit` |
| **Docker push fails** | Check DOCKER_PASSWORD (should be token, not password) |
| **EC2 SSH fails** | Verify EC2_SSH_KEY in GitHub Secrets |
| **Database connection fails** | Check DATABASE_URL in GitHub Secrets |
| **Security check fails** | Check no hardcoded secrets in code |

---

## GitHub Secrets You Need

Ask platform engineer to add:

```
DOCKER_USERNAME         (your Docker Hub username)
DOCKER_PASSWORD         (your Docker Hub access token)
AWS_ACCESS_KEY_ID       (from platform engineer)
AWS_SECRET_ACCESS_KEY   (from platform engineer)
EC2_HOST                (EC2 public IP)
EC2_USER                (usually: ec2-user)
EC2_SSH_KEY             (EC2 private key content)
DATABASE_URL            (PostgreSQL connection)
JWT_SECRET              (32-char secret key)
MSTEAMS_WEBHOOK         (MS Teams webhook URL)
TF_STATE_BUCKET         (S3 bucket name for Terraform)
```

---

## Environment Files

### For Local Development

Create `.env` files in client and server:

```bash
# client/.env
VITE_API_BASE_URL=http://localhost:5000/api

# server/.env
DATABASE_URL=postgresql://user:password@localhost:5432/feedback_db
JWT_SECRET=your-secret-key-here
```

Use the `.env.example` files as template.

### For EC2 (docker-compose)

Copy `.env.docker-example` to EC2 as `.env`:

```bash
POSTGRES_USER=feedback_user
POSTGRES_PASSWORD=<strong-password>
JWT_SECRET=<32-char-key>
CORS_ORIGIN=http://your-ec2-ip
```

---

## Useful Commands

### Git

```bash
git status                          # See current status
git log --oneline -5                # See recent commits
git diff                            # See your changes
git checkout deployment             # Switch to deployment branch
git pull origin deployment          # Get latest changes
```

### Docker (Local Testing)

```bash
docker ps                           # List running containers
docker logs <container-name>        # View container logs
docker-compose up -d                # Start all services
docker-compose down                 # Stop all services
docker-compose restart              # Restart services
```

### GitHub CLI (If Installed)

```bash
gh run list                         # View workflow runs
gh secret list                      # View secrets
gh pr create                        # Create PR
```

---

## Commit Message Format

✅ **Good**:
- `feat: add login page`
- `fix: resolve database connection timeout`
- `docs: update API documentation`
- `refactor: optimize API response handling`
- `test: add unit tests for auth`
- `chore: update dependencies`

❌ **Bad**:
- `update`
- `fix bug`
- `changes`
- `WIP`

---

## Before Pushing Code

Quick checklist:

```bash
# 1. Test builds
npm run build              # client
cd ../server && npx tsc --noEmit

# 2. Run linting
npm run lint              # client
cd ../server && npm run lint

# 3. No hardcoded secrets
grep -r "password\|secret\|key" . --exclude-dir=node_modules

# 4. Commit message is semantic
git log --oneline -1

# 5. Push safely
git push origin feature-branch
```

---

## Documentation References

For more details:

- **Quick Start**: Read `docs/CICD_QUICKSTART.md`
- **Your Configuration**: Read `docs/CICD_YOUR_CONFIG.md`
- **Troubleshooting**: Read `docs/TROUBLESHOOTING.md`
- **Architecture**: Read `docs/CICD_ARCHITECTURE.md`
- **Full Setup**: Read `docs/CICD_SETUP_GUIDE.md`
- **Infrastructure**: Read `feedback-infra/README.md`

---

## When Things Go Wrong

### GitHub Actions Failed

1. Go to **Actions** tab
2. Click the failed run
3. Click the failed job (red)
4. Scroll down to see error message
5. Fix the issue locally
6. Commit and push again

### Local Build Works, But CI Fails

Usually means:
- Missing dependencies in package.json
- Different Node version
- Hardcoded paths or environment values
- Missing environment variables

### EC2 Deployment Failed

1. SSH into EC2: `ssh -i key.pem ec2-user@host`
2. Check containers: `docker-compose ps`
3. View logs: `docker-compose logs -f`
4. Restart services: `docker-compose restart`

---

## Getting Help

**Questions?** Ask:
1. Check docs/ folder first
2. Search in TROUBLESHOOTING.md
3. Ask platform engineer (infrastructure questions)
4. Ask team lead (business logic questions)

---

## What to Do Next

✅ You're done with pipeline setup!

Next steps:

1. **Understand the pipeline**: Read `docs/CICD_QUICKSTART.md`
2. **Try it out**: Create a small PR to dev
3. **Watch deployment**: Check Actions tab
4. **Verify on EC2**: SSH and check containers
5. **Check MS Teams**: Confirm notifications work
6. **Start coding**: Create your feature branches!

---

**Last Updated**: March 2026  
**Pipeline Version**: 2.0  
**Your Configuration**: Deployment branch + Docker + EC2 + MS Teams
