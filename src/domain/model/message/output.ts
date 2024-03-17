import { GeminiSlackBotError } from '~/domain/error/error';
import { messages } from '~/domain/error/message';

export class MessageOutput {
  constructor(public readonly v: string) {
    if (![!!v, v.length > 0].every((_) => _)) {
      new GeminiSlackBotError(messages.UNEXPECTED_OUTPUT);
    }
  }
}
