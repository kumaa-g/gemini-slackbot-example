#!/usr/bin/env sh

CURRENT_SHA=$(git show --format='%H' --no-patch)
IMAGE_URL="us-docker.pkg.dev/${GCP_PROJECT}/gemini-slack/gemini-slackbot-example:${CURRENT_SHA}"
docker build ./ -t ${IMAGE_URL}

export IMAGE_URL
