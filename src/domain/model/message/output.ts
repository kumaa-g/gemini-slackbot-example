import { GeminiSlackBotError } from '~/domain/error/error';

export class MessageOutput {
  constructor(public readonly v: string) {
    if (![!!v, v.length > 0].every((_) => _)) {
      new GeminiSlackBotError('予期せぬ出力だったので消しました');
    }
  }
}
