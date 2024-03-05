#!/usr/bin/env sh

CURRENT_SHA=$(git show --format='%H' --no-patch)
ARTIFACT_REGISTRY_NAME=gemini-slackbot-example
PROJECT_ID=$1
GCP_REGION=$2
SERVICE_ACCOUNT_EMAIL=$3
SLACK_SIGNING_SECRET=$4
SLACK_OAUTH2_BOT_TOKEN=$5

# artifact registry
gcloud artifacts repositories describe ${ARTIFACT_REGISTRY_NAME} \
  --location=${GCP_REGION} \
  --project=${PROJECT_ID} > /dev/null 2>&1
exists=$?

if [ $exists -ne 0 ]; then
  # not exist case
  gcloud services enable artifactregistry.googleapis.com --project=${PROJECT_ID}
  gcloud artifacts repositories create ${ARTIFACT_REGISTRY_NAME} \
    --repository-format=docker \
    --location=${GCP_REGION} \
    --project=${PROJECT_ID}
fi

DOCKER_IMAGE="${GCP_REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_NAME}/gemini-slackbot:${CURRENT_SHA}"
gcloud builds submit --tag $DOCKER_IMAGE \
  --project=${PROJECT_ID}

gcloud run deploy gemini-slackbot \
  --image=${DOCKER_IMAGE} \
  --min-instances=1 \
  --port=3000 \
  --service-account=${SERVICE_ACCOUNT_EMAIL} \
  --set-env-vars="NODE_ENV=pdoruction" \
  --set-env-vars="SLACK_SIGNING_SECRET=${SLACK_SIGNING_SECRET}" \
  --set-env-vars="SLACK_OAUTH2_BOT_TOKEN=${SLACK_OAUTH2_BOT_TOKEN}" \
  --set-env-vars="GCP_PROJECT=${PROJECT_ID}" \
  --set-env-vars="GCP_REGION=${GCP_REGION}" \
  --allow-unauthenticated \
  --execution-environment=gen2 \
  --region=${GCP_REGION}
