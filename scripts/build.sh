#!/usr/bin/env sh

CURRENT_SHA=$(git show --format='%H' --no-patch)
IMAGE_URL="us-docker.pkg.dev/$(gcloud config get-value project)/gemini-slack/gemini-slackbot-example:${CURRENT_SHA}"

gcloud builds submit --tag $IMAGE_URL
export IMAGE_URL
