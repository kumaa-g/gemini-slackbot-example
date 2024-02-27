import { App } from '@slack/bolt';
import { NullPoController } from './infra/controller/null-po/controller';
import { NullPoService } from './service/null-po/service';
import { config } from './config';
import { LLMController } from './infra/controller/llm/controller';
import { LLMService } from './service/llm/service';
import { Gemini } from './infra/repository/llm/gemini/repository';
import { VertexAI } from '@google-cloud/vertexai';

(async () => {
  const app = new App({
      signingSecret: config.slack.signingSecret,
      token: config.slack.botToken,
      socketMode: config.slack.socketMode.toLowerCase() === 'true',
      appToken: config.slack.appToken,
    }),
    controllers = {
      gemini: new LLMController(
        new LLMService(
          new Gemini(
            new VertexAI({
              project: config.gcp.project,
              location: config.gcp.region,
            }),
          ),
        ),
      ),
      nullpo: new NullPoController(new NullPoService()),
    };
  app.message('ぬるぽ', async ({ message, say }) => {
    await controllers.nullpo.handle(message, say);
  });
  await app.start(process.env.PORT ?? 3000);
  console.log('gemini slack example is running...');
})();
