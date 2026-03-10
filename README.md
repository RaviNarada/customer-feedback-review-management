# Feedback App Infrastructure

## Prerequisites
- AWS CLI configured (`aws configure`)
- Terraform installed
- SSH key generated (`ssh-keygen -t rsa -b 4096 -f feedback-key -N ""`)

## Deploy
```bash
terraform init
terraform apply
```

## SSH into EC2
```bash
ssh -i feedback-key ec2-user@YOUR_EC2_IP
```

## Start App on EC2
```bash
cd feedback-app
docker-compose up -d
```

## Destroy (to avoid AWS charges)
```bash
terraform destroy
```