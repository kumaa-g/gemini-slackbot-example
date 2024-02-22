import { GeminiSlackBotError } from '~/domain/error/error';

export class MessageInput {
  constructor(public readonly v: string) {
    if (![!!v, v.length > 0].every((_) => _)) {
      new GeminiSlackBotError('入力は1文字以上必要です');
    }
  }
}
