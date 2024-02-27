import { MessageEvent, SayFn } from '@slack/bolt';
import { LLMService } from '~/service/llm/service';

export class LLMController {
  constructor(private readonly service: LLMService) {}
  public async handle(message: MessageEvent, say: SayFn): Promise<void> {
    let text = '';
    if (message.subtype === undefined) {
      text = (message.text ?? '').replace(/<\@.+>/, '');
    }
    console.log('input:', text);
    await say(
      await this.service.execute({
        prompt: text,
        images: [],
      }),
    );
  }
}
