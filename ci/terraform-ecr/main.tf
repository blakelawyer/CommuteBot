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
    image_tag_mutability = "IMMUTABLE"
    image_scanning_configuration {
        scan_on_push = true
    }
}


resource "aws_ecr_lifecycle_policy" "this" {
  repository = aws_ecr_repository.ecr_repo.name

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Keep last 5 images",
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": ["v"],
                "countType": "imageCountMoreThan",
                "countNumber": 5
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}
