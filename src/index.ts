import { App } from '@slack/bolt';
import { NullPoController } from './infra/controller/null-po/controller';
import { NullPoService } from './service/null-po/service';

(async () => {
  // TODO: configure slack
  const app = new App(),
    controllers = {
      nullpo: new NullPoController(new NullPoService()),
    };
  app.message('ぬるぽ', async ({ message, say }) => {
    await controllers.nullpo.handle(message, say);
  });
  await app.start(process.env.PORT ?? 3000);
  console.log('gemini slack example is running...');
})();
