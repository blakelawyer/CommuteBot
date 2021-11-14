#!/usr/bin/env bash
set -e
set -x

commit_sha=$(git rev-parse --short HEAD)
tag="comet-commute:${commit_sha}"
bash build.sh $tag

if [[ "$TRAVIS_BRANCH" != "main" ]]; then   
    echo "aborting - I only deploy for main!"
    exit 0
fi

bash deploy.sh $tag
