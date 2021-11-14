terraform {
  backend "remote" {
    organization = "alex4108"

    workspaces {
      name = "comet-commute"
    }
  }
}

provider "aws" {
    region = "us-east-2"
}

locals { 
    app_name = "comet-commute"
}

resource "aws_ecr_repository" "ecr_repo" { 
    name                 = local.app_name
    image_tag_mutability = "MUTABLE"
    image_scanning_configuration {
        scan_on_push = true
    }
}