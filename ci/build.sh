#!/usr/bin/env bash
set -e
set -x

tag=$1
repo=$2
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin $repo
cd ..

docker build -t $tag .
docker push $tag