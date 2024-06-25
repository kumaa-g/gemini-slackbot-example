export const config = {
  slack: {
    signingSecret: process.env.SLACK_SIGNING_SECRET ?? '',
    botToken: process.env.SLACK_OAUTH2_BOT_TOKEN ?? '',
    socketMode: process.env.SLACK_SOCKET_MODE ?? 'false',
    appToken: process.env.SLACK_APP_TOKEN ?? '',
  },
  gcp: {
    project: process.env.GCP_PROJECT ?? '',
    region: process.env.GCP_REGION ?? 'us-east5',
  },
  llm: {
    model: process.env.LLM_MODEL ?? 'gemini',
  },
};
