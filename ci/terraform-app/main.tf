terraform {
  backend "remote" {
    organization = "alex4108"

    workspaces {
      name = "comet-commute-app"
    }
  }
}

provider "aws" {
    region = "us-east-2"
}

locals { 
    app_name = "comet-commute"
}

module "vpc" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-vpc.git?ref=v3.3.0"

  name = local.app_name
  cidr = "10.10.0.0/16" # 10.0.0.0/8 is reserved for EC2-Classic

  azs                   = ["us-east-2a", "us-east-2b", "us-east-2c"]

  private_subnets           = ["10.10.0.0/19", "10.10.64.0/19", "10.10.128.0/19"]
  private_subnet_suffix     = "private"
  private_subnet_tags       = {
    Type  = "private"
  }


  public_subnets            = ["10.10.32.0/19", "10.10.96.0/19", "10.10.160.0/19"]
  public_subnet_suffix      = "public"
  public_subnet_tags       = {
    Type  = "public"
  }

  create_database_subnet_group = false

  manage_default_route_table = true
  default_route_table_tags   = { DefaultRouteTable = true }

  enable_dns_hostnames = true
  enable_dns_support   = true

  enable_classiclink             = false
  enable_classiclink_dns_support = false

  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true

  enable_vpn_gateway = false

  enable_dhcp_options              = false

  # Default security group - ingress/egress rules cleared to deny all
  manage_default_security_group  = true
  default_security_group_ingress = []
  default_security_group_egress  = []

  # VPC Flow Logs (Cloudwatch log group and IAM role will be created)
  enable_flow_log                      = false
}

resource "aws_ecs_cluster" "this" { 
    name                 = local.app_name
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${local.app_name}-ecsTaskExecutionRole"
 
  assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": "sts:AssumeRole",
     "Principal": {
       "Service": "ecs-tasks.amazonaws.com"
     },
     "Effect": "Allow",
     "Sid": ""
   }
 ]
}
EOF
}
 
resource "aws_iam_role_policy_attachment" "ecs-task-execution-role-policy-attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# resource "aws_iam_role" "ecs_task_role" {
#   name = "${local.app_name}-ecsTaskRole"
 
#   assume_role_policy = <<EOF
# {
#  "Version": "2012-10-17",
#  "Statement": [
#    {
#      "Action": "sts:AssumeRole",
#      "Principal": {
#        "Service": "ecs-tasks.amazonaws.com"
#      },
#      "Effect": "Allow",
#      "Sid": ""
#    }
#  ]
# }
# EOF
# }

# resource "aws_iam_role_policy_attachment" "ecs-task-role-policy-attachment" {
#   role       = aws_iam_role.ecs_task_role.name
# }

resource "aws_ecs_task_definition" "this" {
  network_mode             = "awsvpc"
  family                   = "service"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  //task_role_arn            = aws_iam_role.ecs_task_role.arn
  container_definitions = jsonencode([{
   name        = "${local.app_name}"
   image       = "${var.container_image}"
   essential   = true
}])
}


resource "aws_security_group" "this" {
  vpc_id = module.vpc.vpc_id
  name = "${local.app_name}"
  description = "Security group for ${local.app_name}"

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow egress to world"
  }
}



resource "aws_ecs_service" "main" {
 //depends_on                         = [ aws_security_group.this ]
 name                               = "${local.app_name}-service"
 cluster                            = aws_ecs_cluster.this.id
 task_definition                    = aws_ecs_task_definition.this.arn
 desired_count                      = var.desired_count
 deployment_minimum_healthy_percent = 0
 deployment_maximum_percent         = 100
 launch_type                        = "FARGATE"
 scheduling_strategy                = "REPLICA"
 
 network_configuration {
   security_groups  = [aws_security_group.this.id]
   subnets          = module.vpc.private_subnets
   assign_public_ip = false
 }
 
}