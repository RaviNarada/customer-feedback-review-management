terraform {
  backend "s3" {
    # These values should be overridden via -backend-config during terraform init
    # Example: terraform init -backend-config="bucket=my-tf-state" -backend-config="key=production/terraform.tfstate" -backend-config="region=us-west-2" -backend-config="encrypt=true"
    
    # For local development:
    # Uncomment the lines below and update with your bucket name
    # bucket         = "your-company-tf-state-bucket"
    # key            = "production/terraform.tfstate"
    # region         = "us-west-2"
    # encrypt        = true
    # dynamodb_table = "terraform-locks"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
