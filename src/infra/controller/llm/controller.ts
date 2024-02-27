import { MessageEvent, SayFn } from '@slack/bolt';
import { LLMService } from '~/service/llm/service';
import { downloadSlackPrivateFile } from '~/util/slack/download';

export class LLMController {
  constructor(private readonly service: LLMService) {}
  public async handle(message: MessageEvent, say: SayFn): Promise<void> {
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
          await say(e.message);
        } else {
          await say('予期せぬエラーが発生しました');
        }
      }
    }
    await say(
      await this.service.execute({
        prompt: text,
        images,
      }),
    );
  }
  private stripMention(raw: string): string {
    return raw.replace(/<\@.+>/, '');
  }
}
