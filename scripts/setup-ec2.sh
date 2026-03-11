#!/bin/bash

# ==============================================================================
# EC2 Instance Setup Script
# ==============================================================================
# Run this on a fresh EC2 instance to prepare for deployment
# Usage: bash setup-ec2.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  EC2 Instance Setup - Feedback Management System          ║${NC}"
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

# Update system
update_system() {
    print_section "Updating system packages"
    sudo yum update -y
    print_success "System updated"
}

# Install Docker
install_docker() {
    print_section "Installing Docker"
    
    if command -v docker &> /dev/null; then
        print_info "Docker already installed: $(docker --version)"
        return
    fi
    
    sudo yum install docker -y
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -a -G docker ec2-user
    
    print_success "Docker installed and started"
    docker --version
}

# Install Docker Compose
install_docker_compose() {
    print_section "Installing Docker Compose"
    
    if command -v docker-compose &> /dev/null; then
        print_info "Docker Compose already installed: $(docker-compose --version)"
        return
    fi
    
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d'"' -f4)
    sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    print_success "Docker Compose installed"
    docker-compose --version
}

# Install Git
install_git() {
    print_section "Installing Git"
    
    if command -v git &> /dev/null; then
        print_info "Git already installed: $(git --version)"
        return
    fi
    
    sudo yum install git -y
    print_success "Git installed"
}

# Install CloudWatch agent (optional)
install_cloudwatch() {
    print_section "Installing CloudWatch agent (optional)"
    
    read -p "Install CloudWatch agent for monitoring? (y/n): " install_cw
    if [ "$install_cw" != "y" ] && [ "$install_cw" != "Y" ]; then
        print_info "Skipped CloudWatch installation"
        return
    fi
    
    wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
    sudo rpm -U ./amazon-cloudwatch-agent.rpm
    print_success "CloudWatch agent installed"
}

# Create app directory
create_app_directory() {
    print_section "Creating application directory"
    
    sudo mkdir -p /opt/feedback-app
    sudo chown ec2-user:ec2-user /opt/feedback-app
    
    print_success "Application directory created at /opt/feedback-app"
}

# Setup security groups info
setup_security() {
    print_section "Security Configuration"
    
    cat << 'EOF'

${YELLOW}Important: Ensure your EC2 Security Group has these inbound rules:${NC}
  • Port 22 (SSH): 0.0.0.0/0 (or restricted to your IP)
  • Port 80 (HTTP): 0.0.0.0/0
  • Port 8080 (API): 0.0.0.0/0 (or only from frontend)
  • Port 5432 (PostgreSQL): Only from within security group (if needed)

Visit AWS Console → EC2 → Security Groups to configure.

EOF
}

# Setup logrotate
setup_logrotate() {
    print_section "Setting up log rotation"
    
    sudo tee /etc/logrotate.d/docker > /dev/null <<EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    delaycompress
    missingok
    copytruncate
}
EOF
    
    print_success "Log rotation configured"
}

# Generate .env template
generate_env() {
    print_section "Generating .env template"
    
    cat > /opt/feedback-app/.env.example << 'EOF'
# PostgreSQL Configuration
POSTGRES_USER=feedback_user
POSTGRES_PASSWORD=change-this-strong-password
POSTGRES_DB=feedback_db

# Backend Configuration
JWT_SECRET=change-this-to-random-32-chars-secret
CORS_ORIGIN=http://your-domain.com

# Frontend Configuration
VITE_API_BASE_URL=http://your-domain.com/api

# Docker Network (leave as is)
NETWORK_NAME=feedback-net
EOF
    
    print_success ".env template created at /opt/feedback-app/.env.example"
    print_info "Copy to /opt/feedback-app/.env and update with your values:"
    echo "  cp /opt/feedback-app/.env.example /opt/feedback-app/.env"
    echo "  nano /opt/feedback-app/.env"
}

# Setup cron job for container restart on reboot
setup_autostart() {
    print_section "Setting up autostart for containers"
    
    cat > /tmp/docker-compose-restart.sh << 'EOF'
#!/bin/bash
cd /opt/feedback-app
docker-compose up -d
EOF
    
    chmod +x /tmp/docker-compose-restart.sh
    
    # Add to crontab for ec2-user
    (crontab -l 2>/dev/null | grep -v "docker-compose" || true; echo "@reboot /tmp/docker-compose-restart.sh") | crontab -
    
    print_success "Autostart configured (containers will start on EC2 reboot)"
}

# Summary
print_summary() {
    print_section "Setup Complete!"
    
    cat << EOF

${GREEN}✓ EC2 instance is ready for deployment!${NC}

${YELLOW}Next Steps:${NC}

1. ${BLUE}Clone the repository:${NC}
   cd /opt/feedback-app
   git clone <your-repo-url> .
   (or get files from CI/CD deployment)

2. ${BLUE}Configure environment:${NC}
   cp .env.example .env
   nano .env
   
   Update these values:
   - POSTGRES_PASSWORD: Set strong password
   - JWT_SECRET: Run: openssl rand -base64 32
   - CORS_ORIGIN: Your domain (e.g., http://54.123.45.67)
   - VITE_API_BASE_URL: Backend URL (e.g., http://54.123.45.67:8080/api)

3. ${BLUE}Start services:${NC}
   cd /opt/feedback-app
   docker-compose up -d
   
4. ${BLUE}Verify installation:${NC}
   docker-compose ps
   docker-compose logs -f feedback-server

5. ${BLUE}Test application:${NC}
   Frontend: http://your-ec2-ip
   Backend: http://your-ec2-ip:8080/api/auth/login

6. ${BLUE}Configure security groups:${NC}
   AWS Console → EC2 → Security Groups
   Add inbound rules for ports 22, 80, 8080

${YELLOW}Useful Commands:${NC}

View running containers:
  docker-compose ps

View logs:
  docker-compose logs -f feedback-server
  docker-compose logs -f feedback-client
  docker-compose logs -f postgres

Stop services:
  docker-compose down

Restart services:
  docker-compose restart

Update images and restart:
  docker-compose pull
  docker-compose up -d

Access database:
  docker-compose exec postgres psql -U feedback_user -d feedback_db

${YELLOW}Important Files:${NC}
  .env                    - Environment configuration (keep secure!)
  docker-compose.yml      - Service orchestration
  /opt/feedback-app       - Application root

${RED}⚠️  Security Reminders:${NC}
  • Never commit .env to git
  • Use strong passwords (32+ characters)
  • Keep EC2 security group restricted
  • Enable security group egress rules carefully
  • Backup database regularly
  • Monitor EC2 logs and metrics

EOF
}

# Main execution
main() {
    print_header
    
    update_system
    install_git
    install_docker
    install_docker_compose
    create_app_directory
    setup_security
    setup_logrotate
    setup_autostart
    generate_env
    print_summary
}

main
