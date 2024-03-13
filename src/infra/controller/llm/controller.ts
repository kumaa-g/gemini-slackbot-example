import { MessageEvent, SayFn } from '@slack/bolt';
import { LLMService } from '~/service/llm/service';
import { downloadSlackPrivateFile } from '~/util/slack/download';
import * as fs from 'fs/promises';

export class LLMController {
  constructor(private readonly service: LLMService) {}
  public async handle(
    event: any,
    message: MessageEvent,
    say: SayFn,
  ): Promise<void> {
    const ts = (!!event ? event.thread_ts : undefined) ?? message.event_ts;
    let text = '',
      images: string[] = [];
    if (message.subtype === undefined) {
      text = this.stripMention(message.text ?? '');
    }
    if (message.subtype === 'file_share' && !!message.files) {
      try {
        text = this.stripMention(message.text ?? '');
        await Promise.all(
          message.files.map(async (v) => {
            if (!!v.url_private_download && !!v.name) {
              images.push(
                await downloadSlackPrivateFile(v.url_private_download, v.name),
              );
            }
          }),
        );
      } catch (e) {
        if (e instanceof Error) {
          await say({
            text: e.message,
            thread_ts: ts,
          });
        } else {
          await say({ text: '予期せぬエラーが発生しました', thread_ts: ts });
        }
      }
    }
    await say({
      text: await this.service.execute(
        {
          prompt: text,
          images,
        },
        {
          channel: message.channel,
          thread: ts,
        },
      ),
      thread_ts: ts,
    });
    images.forEach(async (v) => {
      await fs.rm(v, {
        force: true,
      });
    });
  }
  private stripMention(raw: string): string {
    return raw.replace(/<\@.+>/, '');
  }
}
