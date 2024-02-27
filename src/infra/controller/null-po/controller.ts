import { MessageEvent, SayFn } from '@slack/bolt';
import { NullPoService } from '~/service/null-po/service';

export class NullPoController {
  constructor(private readonly service: NullPoService) {}
  public async handle(message: MessageEvent, say: SayFn): Promise<void> {
    await say(this.service.execute());
  }
}
