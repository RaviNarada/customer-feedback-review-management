# CI/CD Architecture and Workflow Documentation

## Table of Contents

1. [Overview](#overview)
2. [Pipeline Architecture](#pipeline-architecture)
3. [Workflow Files](#workflow-files)
4. [Execution Flow](#execution-flow)
5. [Branch Strategy](#branch-strategy)
6. [Deployment Strategy](#deployment-strategy)
7. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)

## Overview

This project uses GitHub Actions to automate:
- **Code Quality**: Linting, type checking, testing
- **Infrastructure**: Terraform validation and deployment
- **Containerization**: Docker image building and pushing
- **Deployment**: Automated EC2 deployment
- **Security**: Code analysis, vulnerability scanning, secret detection

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PULL REQUEST WORKFLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. PR VALIDATION                                         │   │
│  │    - Semantic commit messages                           │   │
│  │    - File size checks                                  │   │
│  │    - No hardcoded secrets                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 2. PARALLEL CHECKS                                       │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ • Client: Lint & Build     │ • Server: Type Check      │   │
│  │ • Terraform Validation     │ • Security Scanning       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 3. RESULT                                                │   │
│  │    ✅ Approve & Merge   OR   ❌ Fix Issues & Retry     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    PUSH TO MAIN WORKFLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐                   │
│  │ Linting  │→ │ Building │→ │ Terraform   │                   │
│  │ & Tests  │  │ & Pushing│  │ Validation  │                   │
│  └──────────┘  └──────────┘  └─────────────┘                   │
│        ↓             ↓              ↓                            │
│     Client      Docker Push     Infrastructure                  │
│     Server      to Registry      Planning                       │
│        ↓             ↓              ↓                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 4. APPROVAL GATE (Protected Environment)                │   │
│  │    Requires human review before deployment              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 5. EC2 DEPLOYMENT                                        │   │
│  │    - Pull Docker images                                 │   │
│  │    - Stop old containers                                │   │
│  │    - Start new containers                               │   │
│  │    - Health checks                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Workflow Files

### 1. **deploy.yml** - Main CI/CD Pipeline

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs:**
| Job Name | Purpose | Triggers On | Duration |
|----------|---------|-------------|----------|
| `client-lint-and-test` | ESLint, TypeScript, build | All events | ~2 min |
| `server-lint-and-test` | Type checking, Prisma setup | All events | ~2 min |
| `terraform-validate` | Infrastructure validation | All events | ~1 min |
| `docker-build-push` | Docker image build and push | Push & open PRs | ~5 min |
| `deploy-to-ec2` | EC2 deployment | Main branch only | ~3 min |

### 2. **infrastructure.yml** - Infrastructure Management

**Triggers:**
- Changes to `feedback-infra/` on main branch
- Manual workflow dispatch

**Jobs:**
| Job Name | Purpose | Requires |
|----------|---------|----------|
| `terraform-plan` | Show infrastructure changes | None |
| `terraform-apply` | Apply infrastructure changes | Manual approval |

### 3. **security.yml** - Security Scanning

**Triggers:**
- Push to main/develop
- Pull requests
- Daily schedule (2 AM UTC)

**Jobs:**
| Job Name | Purpose |
|----------|---------|
| `codeql` | JavaScript/TypeScript static analysis |
| `dependency-scanning` | npm vulnerability detection |
| `container-scanning` | Docker image vulnerability scan |
| `terraform-security` | Infrastructure security checks |
| `secret-scanning` | Detect hardcoded secrets |

### 4. **pr-checks.yml** - Pull Request Validation

**Triggers:**
- PR opened/edited/synchronized

**Jobs:**
| Job Name | Purpose |
|----------|---------|
| `pr-validation` | Semantic commit validation |
| `file-validation` | Dangerous files, size limits |
| `diff-review` | Changed files summary |

### 5. **dependabot.yml** - Automated Dependency Updates

Automatically creates PRs for:
- npm package updates (weekly)
- Docker base image updates (weekly)
- Terraform provider updates (weekly)

## Execution Flow

### For Pull Requests

```
1. Developer creates PR from feature branch to main/develop
2. GitHub Actions triggers:
   ├─ PR validation (commit message, files)
   ├─ Client lint & build
   ├─ Server type check
   ├─ Terraform validation
   ├─ Security scanning
   └─ Display results as checks
3. Developer sees results:
   ├─ ✅ All pass → Ready to merge
   └─ ❌ Some fail → Fix issues and push
4. Repository maintainer:
   ├─ Reviews code changes
   ├─ Approves when satisfied
   └─ Merges to target branch
```

### For Main Branch Pushes

```
1. Developer merges PR to main
2. GitHub Actions triggers deploy.yml:
   ├─ Run all checks (3 min)
   ├─ Build Docker images (5 min)
   ├─ Push to Docker Hub/GHCR
   ├─ Create production environment
   └─ Wait for approval
3. Approved reviewer:
   ├─ Reviews deployment request
   ├─ Clicks "Approve" in GitHub
4. Deployment begins:
   ├─ SSH into EC2
   ├─ Pull latest Docker images
   ├─ Stop old containers
   ├─ Start new containers
   ├─ Verify health
   └─ Complete
```

## Branch Strategy

### Main Branch (`main`)

- **Protection**: 
  - Requires PR reviews (1 approved)
  - Requires branch to be up-to-date
  - Requires status checks to pass
  - Requires approval for deployment

- **Deployment**: 
  - Auto-triggers production deployment
  - Requires environment approval

- **Policy**:
  - Only merge tested PRs from develop
  - Use semantic versioning for releases
  - Tag releases as `v1.0.0`, `v1.0.1`, etc.

### Develop Branch (`develop`)

- **Purpose**: Integration branch for features

- **Protection**:
  - Requires PR reviews (1 approved)
  - Requires status checks to pass
  - No auto-deployment

- **Policy**:
  - Merge feature branches here first
  - Test thoroughly before main

### Feature Branches

- **Naming**: `feature/`, `fix/`, `docs/` prefixes
- **From**: Develop branch
- **Into**: Develop via PR

## Deployment Strategy

### Environments

#### Development
- Branch: `develop`
- Deployment: Manual (via workflow dispatch)
- Approval: None

#### Staging
- Branch: None configured
- Deployment: Can be manual via workflow dispatch
- Approval: None

#### Production
- Branch: `main`
- Deployment: Automatic after merge
- Approval: Required (configured in GitHub)

### Zero-Downtime Deployment

The deployment process ensures zero downtime:

1. New Docker images are built and pushed
2. EC2 server pulls images
3. Both old and new containers run briefly
4. Docker network routes traffic gradually
5. Old containers are removed
6. Health checks verify everything works

## Monitoring and Troubleshooting

### View Workflow Status

1. Go to **Actions** tab
2. Select workflow (deploy, infrastructure, security, etc.)
3. Click on specific run
4. Click on job to see detailed logs

### Common Failure Scenarios

#### Client Build Fails
```
Error: npm run build failed
Solution:
1. Check TypeScript errors: npm run build locally
2. Verify package-lock.json is committed
3. Check eslint configuration
4. Run: npm ci && npm run build
```

#### Server Type Check Fails
```
Error: TypeScript compilation error
Solution:
1. Run: cd server && npx tsc --noEmit
2. Fix type errors
3. Verify tsconfig.json
4. Check Prisma schema generation
```

#### Docker Build Fails
```
Error: Docker build failed
Solution:
1. Reproduce locally: docker build -t test ./server
2. Check Dockerfile syntax
3. Verify all files are copied correctly
4. Check base image availability
```

#### Terraform Validation Fails
```
Error: terraform validate failed
Solution:
1. Check HCL syntax: cd feedback-infra && terraform fmt
2. Verify variable definitions
3. Check AWS provider configuration
4. Run: terraform init && terraform validate
```

#### EC2 Deployment Fails
```
Error: SSH connection failed
Solution:
1. Verify EC2 instance is running
2. Check security group allows port 22
3. Verify SSH key in secrets is correct
4. Test manually: ssh -i key.pem ec2-user@host
```

### Performance Optimization

#### Reduce Build Time

**Problem**: Builds are slow

**Solutions**:
1. **Enable caching**:
   - GitHub Actions cache is enabled by default
   - Docker layer caching is enabled

2. **Parallelize jobs**:
   - Client, Server, Terraform jobs run in parallel
   - Docker builds only start after all validation

3. **Use smaller dependencies**:
   - Audit npm dependencies: `npm audit --production`
   - Remove unused packages

#### Reduce Artifact Size

**Problem**: Artifacts are large

**Solutions**:
1. **Clean before uploading**:
   - Don't upload node_modules
   - Only upload dist/ folders

2. **Set retention**:
   - Client build: 1 day
   - Terraform plan: 7 days

### Debugging Tips

#### Enable verbosity
```yaml
- name: Verbose logging
  run: npm run build -- --verbose
```

#### Run locally
```bash
# Test client build
cd client
npm ci
npm run lint
npm run build

# Test server
cd ../server
npm ci
npx tsc --noEmit
npx prisma generate

# Test Terraform
cd ../feedback-infra
terraform init
terraform validate
terraform plan
```

#### Check secrets
```bash
# SSH into EC2 and verify environment
docker inspect feedback-server | grep -A 20 Env
```

## Best Practices

1. **Always test locally** before pushing
2. **Keep secrets** in GitHub Secrets, not code
3. **Use semantic commits** for better history
4. **Review changes** before merging to main
5. **Monitor deployments** in Actions tab
6. **Keep dependencies** up to date via Dependabot
7. **Document changes** in commit messages and PRs
8. **Use branch protection** for main branch
9. **Test database migrations** before deploying
10. **Keep Docker images** lean and secure

## Security

### Secrets Protection

All secrets are encrypted and only available to authorized workflows:

```yaml
# Secrets used (never logged)
- DOCKER_USERNAME
- DOCKER_PASSWORD
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- EC2_HOST
- EC2_USER
- EC2_SSH_KEY
- DATABASE_URL
- JWT_SECRET
```

### Code Scanning

Multiple scanners run on every push:
- CodeQL for code vulnerabilities
- Snyk for dependency vulnerabilities
- Trivy for container vulnerabilities
- TruffleHog for secret detection
- tfsec for Terraform issues

## Support and Next Steps

1. **First deployment**: Manual workflow dispatch to test
2. **Automate gradually**: Start with develop branch
3. **Monitor failures**: Check workflow logs closely
4. **Update documentation**: Keep setup guide current
5. **Regular reviews**: Check Actions section monthly

