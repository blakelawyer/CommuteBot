#!/usr/bin/env
set -e
set -x

tag=$1

docker tag ${tag} 397766053761.dkr.ecr.us-east-2.amazonaws.com/${tag}
docker push 397766053761.dkr.ecr.us-east-2.amazonaws.com/${tag}


mkdir -p ~/.terraform.d/
echo "{\"credentials\": {\"app.terraform.io\": {\"token\": \"$TF_API_TOKEN\"}}}" > ~/.terraform.d/credentials.tfrc.json

cd ./terraform-app/
echo "container_image = \"$tag\"" > travis.auto.tfvars

terraform init
terraform apply -auto-approve
