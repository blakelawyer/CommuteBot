# CommuteBot
 
[![Build Status](https://app.travis-ci.com/blakelawyer/CommuteBot.svg?token=MyN3vGLjp8SzdckebFqZ&branch=main)](https://app.travis-ci.com/blakelawyer/CommuteBot)

CommuteBot requires Node 16.

Install dependencies: `npm install`

Start the app: `node .`

## Architecture

### Docker

We package the app as a docker conatiner for easy deployment.

### Terraform

We use Terraform to manage state of the AWS environment, including the VPC and ECS Service + Task Definition.

### Travis-CI

We use Travis-CI to automatically deploy the latest image of CommetCommute.

### AWS

We run CometCommute using ECS Fargate.