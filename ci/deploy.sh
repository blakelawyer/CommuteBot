#!/usr/bin/env
set -e
set -x

tag=$1

mkdir -p ~/.terraform.d/
echo "{\"credentials\": {\"app.terraform.io\": {\"token\": \"$TF_API_TOKEN\"}}}" > ~/.terraform.d/credentials.tfrc.json

cd ./terraform-app/
echo "container_image = \"$tag\"" > travis.auto.tfvars

terraform init
terraform apply -auto-approve
