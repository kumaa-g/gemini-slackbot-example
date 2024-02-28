#!/usr/bin/env sh

CURRENT_SHA=$(git show --format='%H' --no-patch)
IMAGE_URL="us-docker.pkg.dev/${GCP_PROJECT}/gemini-slack/gemini-slackbot-example:${CURRENT_SHA}"

gcloud builds submit --tag $IMAGE_URL --project=${GCP_PROJECT}
export IMAGE_URL
