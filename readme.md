# Gemini slackbot example

This is Gemini Pro integrated slack (bolt JavaScript framework) sample app. Users can have a conversation with Gemini.

![slack conversation sample with gemini](./docs/images/sample.png)

## deploy you're environment

### [deprecated] One Click Deploy Button

Cloud Run one click deploy button is deprecated...
Currently we are considering the next best deployment process.
Now just intractive shell script.

### deploy from your local

```sh
$ npm run deploy
```

Then intractive shell scripts are launched. Input followings

- Google Cloud Platform region
  - build and deploy target region
- Google Cloud Platform project name
  - target project ID not number
- Google Cloud service account for cloud run
- slack bot authentication
  1. slack signing secret
  2. slack oauth2 token for bot

## Google Cloud Service Account

only one Google Cloud Permission

- "aiplatform.endpoints.predict"
