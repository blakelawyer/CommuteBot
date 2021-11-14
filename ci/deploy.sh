#!/usr/bin/env
set -e
set -x

tag=$1

mkdir -p ~/.terraform.d/
echo "{\"credentials\": {\"app.terraform.io\": {\"token\": \"$TF_API_TOKEN\"}}}" > ~/.terraform.d/credentials.tfrc.json

cd ./terraform-app/
echo -e "container_image = \"$tag\"\nbot_token = \"$DISCORD_TOKEN\"\ndb_name = \"$DATABASE\"\ndb_password = \"$DB_PASSWORD\"\ndb_user = \"$DB_USER\"\ndb_host = \"$DB_HOST\"\n" > travis.auto.tfvars

terraform init
terraform apply -auto-approve
