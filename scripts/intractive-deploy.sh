#!/usr/bin/env sh

echo "
  ▄████ ▓█████  ███▄ ▄███▓    ██▓    ███▄    █     ██▓     ██████  ██▓    ▄▄▄       ▄████▄   ██ ▄█▀
 ██▒ ▀█▒▓█   ▀ ▓██▒▀█▀ ██▒   ▓██▒    ██ ▀█   █    ▓██▒   ▒██    ▒ ▓██▒   ▒████▄    ▒██▀ ▀█   ██▄█▒ 
▒██░▄▄▄░▒███   ▓██    ▓██░   ▒██▒   ▓██  ▀█ ██▒   ▒██▒   ░ ▓██▄   ▒██░   ▒██  ▀█▄  ▒▓█    ▄ ▓███▄░ 
░▓█  ██▓▒▓█  ▄ ▒██    ▒██    ░██░   ▓██▒  ▐▌██▒   ░██░     ▒   ██▒▒██░   ░██▄▄▄▄██ ▒▓▓▄ ▄██▒▓██ █▄ 
░▒▓███▀▒░▒████▒▒██▒   ░██▒   ░██░   ▒██░   ▓██░   ░██░   ▒██████▒▒░██████▒▓█   ▓██▒▒ ▓███▀ ░▒██▒ █▄
 ░▒   ▒ ░░ ▒░ ░░ ▒░   ░  ░   ░▓     ░ ▒░   ▒ ▒    ░▓     ▒ ▒▓▒ ▒ ░░ ▒░▓  ░▒▒   ▓▒█░░ ░▒ ▒  ░▒ ▒▒ ▓▒
  ░   ░  ░ ░  ░░  ░      ░    ▒ ░   ░ ░░   ░ ▒░    ▒ ░   ░ ░▒  ░ ░░ ░ ▒  ░ ▒   ▒▒ ░  ░  ▒   ░ ░▒ ▒░
░ ░   ░    ░   ░      ░       ▒ ░      ░   ░ ░     ▒ ░   ░  ░  ░    ░ ░    ░   ▒   ░        ░ ░░ ░ 
      ░    ░  ░       ░       ░              ░     ░           ░      ░  ░     ░  ░░ ░      ░  ░   
                                                                                   ░               
"

# gcp region
echo "target gcp region:"
read GCP_REGION

# gcp project id
echo "target Google Cloud project name:"
read PROJECT_ID

# service account name
echo "cloud run service account email address:"
read SERVICE_ACCOUNT_EMAIL

# slack auth
echo "slack bot signing secret:"
read SLACK_SIGNING_SECRET
echo "slack oauth2 bot token:"
read SLACK_OAUTH2_BOT_TOKEN

./scripts/deploy.sh $PROJECT_ID $GCP_REGION $SERVICE_ACCOUNT_EMAIL $SLACK_SIGNING_SECRET $SLACK_OAUTH2_BOT_TOKEN