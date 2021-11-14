#!/usr/bin/env bash
set -e
set -x

tag=$1
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 397766053761.dkr.ecr.us-east-2.amazonaws.com
cd ..
docker build -t $tag .
docker push ${tag}

