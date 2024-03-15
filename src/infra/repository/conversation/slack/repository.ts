import {
  IConversationRepository,
  Input,
} from '~/domain/model/conversation/repository';
import { Context, ImageInput, TextInput } from '~/domain/model/message/input';
import { WebClient } from '@slack/web-api';
import { retry } from '~/retry';
import { downloadSlackPrivateFile } from '~/util/slack/download';
import { stripMention } from '~/util/slack/message';
import { info } from '~/util/logging/stdout';
import { messages } from '~/domain/error/message';

interface Bot {
  id: string;
  updatedAt: Date;
}

export class SlackConversationRepository implements IConversationRepository {
  private bot: Bot | undefined;
  constructor(private readonly client: WebClient) {}
  public async findByIds(input: Partial<Input>): Promise<Context[]> {
    return await retry(
      async () => {
        // const bot = await this.renewBot(),
        const res = await this.client.conversations.replies({
          channel: input.channel ?? '',
          ts: input.thread ?? '',
        });
        if (!res.ok || !!res.error) {
          throw new Error(
            `slack api response is not "ok" OR has something error: ${res.error}`,
          );
        }
        if (!res.messages) {
          info(`"res.messages" is empry`, {
            channel: input.channel ?? '',
            ts: input.thread ?? '',
          });
          return [];
        }
        const contexts = await Promise.all(
          res.messages
            .filter((v) => {
              if (!!v.text) {
                // if messages has pre-defined error message, not include into contexts
                if (Object.values(messages).includes(v.text)) {
                  return false;
                }
                // only mentioned bot
                // if (!v.text.includes(bot.id)) {
                //   return false;
                // }
              }
              return true;
            })
            .map(async (v) => {
              const images = [];
              if (!!v.files) {
                for (const file of v.files) {
                  if (!!file.url_private_download && !!file.name) {
                    images.push(
                      await downloadSlackPrivateFile(
                        file.url_private_download,
                        file.name,
                      ),
                    );
                  }
                }
              }
              return new Context(
                !!v.app_id ? 'model' : 'user',
                new TextInput(stripMention(v.text ?? '')),
                images.map((v) => new ImageInput(v)),
              );
            }),
        );
        info(`fetched context: ${JSON.stringify(contexts, null)}`, {
          component: 'conversation/slack-repository',
        });
        return contexts.slice(0, contexts.length - 1);
      },
      3,
      1000,
    );
  }
  private async renewBot(): Promise<Bot> {
    // frist time or under 1 hour
    if (
      !this.bot ||
      new Date().getTime() - this.bot.updatedAt.getTime() > 3600 * 1000
    ) {
      const res = await retry(
        async () => {
          const res = await this.client.bots.info();
          if (!res.ok) {
            throw new Error(`slack api don't return "ok"`);
          }
          if (!!res.error) {
            throw new Error(`slack api error: "${res.error}"`);
          }
          return res;
        },
        3,
        1000,
      );
      this.bot = {
        id: res.bot?.app_id ?? '',
        updatedAt: new Date(),
      };
    }
    return this.bot;
  }
}
