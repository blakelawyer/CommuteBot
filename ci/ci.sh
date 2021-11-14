#!/usr/bin/env bash
set -e
set -x

commit_sha=$(git rev-parse --short HEAD)
repo="397766053761.dkr.ecr.us-east-2.amazonaws.com/comet-commute"
tag="${repo}:${commit_sha}"
bash build.sh $tag

if [[ "$TRAVIS_BRANCH" != "main" ]]; then   
    echo "aborting - I only deploy for main!"
    exit 0
fi

bash deploy.sh $tag
