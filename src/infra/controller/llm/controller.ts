import { MessageEvent, SayFn } from '@slack/bolt';
import { LLMService } from '~/service/llm/service';

export class LLMController {
  constructor(private readonly service: LLMService) {}
  public async handle(message: MessageEvent, say: SayFn): Promise<void> {
    // TODO: handle mention event
    await say(
      await this.service.execute({
        prompt: 'おはようございます',
        images: [],
      }),
    );
  }
}
