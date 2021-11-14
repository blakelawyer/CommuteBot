# CommuteBot
 
[![Build Status](https://app.travis-ci.com/blakelawyer/CommuteBot.svg?token=MyN3vGLjp8SzdckebFqZ&branch=main)](https://app.travis-ci.com/blakelawyer/CommuteBot)

CommuteBot requires Node 16.

Install dependencies: `npm install`

Start the app: `node .`

## Usage

Riders can request a ride with the `/request` command in discord. Drivers will be able to accept a ride from the designated drivers channel.

Once a driver accepts a ride, a private channel will be created for the Rider and Driver to communicate.  The Driver should be able to mark when they picked up the Rider, and when they dropped off the Rider.

Drivers will be assigned a role by an administrator - there is currently no automated function to handle registration, although this could be added.

## Architecture

### Docker

We package the app as a docker conatiner for easy deployment.

### Terraform

We use Terraform to manage state of the AWS environment, including the VPC and ECS Service + Task Definition.

### Travis-CI

We use Travis-CI to automatically deploy the latest image of CommetCommute.

### AWS

We run CometCommute using ECS Fargate.