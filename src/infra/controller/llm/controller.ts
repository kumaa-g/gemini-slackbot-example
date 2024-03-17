import { MessageEvent, SayFn } from '@slack/bolt';
import { LLMService } from '~/service/llm/service';
import { downloadSlackPrivateFile } from '~/util/slack/download';
import * as fs from 'fs/promises';
import { stripMention } from '~/util/slack/message';
import { errorReport } from '~/util/logging/error-report';
import { messages } from '~/domain/error/message';
import { GeminiSlackBotError } from '~/domain/error/error';

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
      text = stripMention(message.text ?? '');
    }
    if (message.subtype === 'file_share' && !!message.files) {
      try {
        text = stripMention(message.text ?? '');
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
          await say({ text: messages.DEFAULT_ERROR_MESSAGE, thread_ts: ts });
        }
      }
    }
    try {
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
    } catch (e) {
      if (e instanceof GeminiSlackBotError) {
        await say({
          text: e.message,
          thread_ts: ts,
        });
        errorReport(e, {
          prompt: text,
        });
        return;
      }
      if (e instanceof Error) {
        await say({
          text: messages.DEFAULT_ERROR_MESSAGE,
          thread_ts: ts,
        });
        errorReport(e, {
          prompt: text,
        });
      }
    }
  }
}
