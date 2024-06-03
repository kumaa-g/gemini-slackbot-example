import {
  App,
  AppMentionEvent,
  EventFromType,
  SlackEvent,
  directMention,
} from '@slack/bolt';
import { NullPoController } from './infra/controller/null-po/controller';
import { NullPoService } from './service/null-po/service';
import { config } from './config';
import { LLMController } from './infra/controller/llm/controller';
import { LLMService } from './service/llm/service';
import { SlackConversationRepository } from './infra/repository/conversation/slack/repository';
import { makeLlmInstance } from './infra/repository/llm/factory';

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
          makeLlmInstance(config.llm.model),
          new SlackConversationRepository(app.client),
        ),
      ),
      nullpo: new NullPoController(new NullPoService()),
    };
  app.message('ぬるぽ', async ({ message, say }) => {
    await controllers.nullpo.handle(message, say);
  });
  app.message(directMention(), async ({ event, message, say }) => {
    await controllers.gemini.handle(event, message, say);
  });
  await app.start(process.env.PORT ?? 3000);
  console.log('gemini slack example is running');
})();
