#!/bin/bash

# ==============================================================================
# GitHub Secrets Setup Helper Script
# ==============================================================================
# This script helps you set up GitHub secrets for the CI/CD pipeline
# Usage: bash setup-github-secrets.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  GitHub Actions CI/CD - Secrets Setup Helper              ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
}

print_section() {
    echo -e "\n${YELLOW}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if gh CLI is installed
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI is not installed"
        echo "Install it from: https://cli.github.com"
        exit 1
    fi
    print_success "GitHub CLI found"
}

# Check authentication
check_auth() {
    if ! gh auth status &> /dev/null; then
        print_error "Not authenticated to GitHub"
        echo "Run: gh auth login"
        exit 1
    fi
    print_success "GitHub authentication verified"
}

# Prompt for secret
prompt_secret() {
    local secret_name=$1
    local prompt_text=$2
    local is_sensitive=$3

    echo -e "\n${YELLOW}→ $secret_name${NC}"
    echo "$prompt_text"
    
    if [ "$is_sensitive" = "true" ]; then
        read -sp "Enter value (hidden): " secret_value
        echo ""
    else
        read -p "Enter value: " secret_value
    fi

    if [ -z "$secret_value" ]; then
        print_error "Empty value provided"
        return 1
    fi

    echo "$secret_value"
}

# Set secret via GitHub CLI
set_secret() {
    local secret_name=$1
    local secret_value=$2
    
    echo "$secret_value" | gh secret set "$secret_name" --body -
    print_success "Secret '$secret_name' set"
}

# Main setup flow
setup_docker_secrets() {
    print_section "Docker Hub Secrets"
    
    echo "1. Go to Docker Hub: https://hub.docker.com"
    echo "2. Click Profile → Account Settings → Security"
    echo "3. Create a New Access Token"
    echo "4. Copy the token (not your password!)"
    
    docker_username=$(prompt_secret "DOCKER_USERNAME" \
        "Your Docker Hub username:" false) || return 1
    
    docker_password=$(prompt_secret "DOCKER_PASSWORD" \
        "Your Docker Hub Access Token (created above):" true) || return 1
    
    set_secret "DOCKER_USERNAME" "$docker_username"
    set_secret "DOCKER_PASSWORD" "$docker_password"
}

setup_aws_secrets() {
    print_section "AWS Secrets"
    
    echo "1. Go to AWS IAM Console"
    echo "2. Create a new user with programmatic access"
    echo "3. Attach policies: AmazonEC2FullAccess, AmazonVPCFullAccess"
    echo "4. Generate access keys"
    
    aws_access_key=$(prompt_secret "AWS_ACCESS_KEY_ID" \
        "Your AWS Access Key ID:" true) || return 1
    
    aws_secret_key=$(prompt_secret "AWS_SECRET_ACCESS_KEY" \
        "Your AWS Secret Access Key:" true) || return 1
    
    set_secret "AWS_ACCESS_KEY_ID" "$aws_access_key"
    set_secret "AWS_SECRET_ACCESS_KEY" "$aws_secret_key"
}

setup_ec2_secrets() {
    print_section "EC2 Deployment Secrets"
    
    echo "1. Get your EC2 instance public IP or domain"
    echo "2. Confirm SSH username (usually 'ec2-user' or 'ubuntu')"
    echo "3. Get your SSH private key (.pem file)"
    
    ec2_host=$(prompt_secret "EC2_HOST" \
        "EC2 Instance public IP/domain (e.g., 54.123.45.67):" false) || return 1
    
    ec2_user=$(prompt_secret "EC2_USER" \
        "EC2 SSH username (e.g., ec2-user or ubuntu):" false) || return 1
    
    echo -e "\n${YELLOW}→ EC2_SSH_KEY${NC}"
    echo "Paste the contents of your .pem file (including BEGIN/END lines)"
    echo "Press Ctrl+D when finished:"
    read -d '' ec2_ssh_key << 'EOF' || true
$(cat)
EOF
    if [ -z "$ec2_ssh_key" ]; then
        print_error "Empty SSH key"
        return 1
    fi
    
    set_secret "EC2_HOST" "$ec2_host"
    set_secret "EC2_USER" "$ec2_user"
    set_secret "EC2_SSH_KEY" "$ec2_ssh_key"
}

setup_app_secrets() {
    print_section "Application Secrets"
    
    echo "1. Create a PostgreSQL database"
    echo "2. Generate a strong JWT secret"
    
    database_url=$(prompt_secret "DATABASE_URL" \
        "PostgreSQL connection string (postgresql://user:pass@host:port/db):" true) || return 1
    
    # Generate JWT secret if needed
    print_info "Generating a random JWT secret..."
    jwt_secret=$(openssl rand -base64 32)
    echo "Generated: $jwt_secret"
    read -p "Use this JWT secret? (y/n): " use_generated
    
    if [ "$use_generated" != "y" ] && [ "$use_generated" != "Y" ]; then
        jwt_secret=$(prompt_secret "JWT_SECRET" \
            "Enter your JWT secret (min 32 characters):" true) || return 1
    fi
    
    set_secret "DATABASE_URL" "$database_url"
    set_secret "JWT_SECRET" "$jwt_secret"
}

# Summary
print_summary() {
    print_section "Setup Summary"
    
    echo -e "\n${GREEN}✓ Secrets Configuration Complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Verify secrets: gh secret list"
    echo "2. Push code to GitHub"
    echo "3. Check Actions tab for workflow runs"
    echo "4. Approve production deployments when ready"
    echo ""
    echo "Documentation:"
    echo "- Setup Guide: docs/CICD_SETUP_GUIDE.md"
    echo "- Architecture: docs/CICD_ARCHITECTURE.md"
}

# Main execution
main() {
    print_header
    
    check_gh_cli
    check_auth
    
    read -p "Continue with secret setup? (y/n): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Cancelled"
        exit 0
    fi
    
    # Collect secrets
    setup_docker_secrets || return 1
    setup_aws_secrets || return 1
    setup_ec2_secrets || return 1
    setup_app_secrets || return 1
    
    print_summary
}

# Run main
main
