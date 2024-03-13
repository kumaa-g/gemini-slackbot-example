import { GeminiSlackBotError } from '~/domain/error/error';

export class TextInput {
  constructor(public readonly v: string) {
    if (![!!v, v.length > 0].every((_) => _)) {
      new GeminiSlackBotError('入力は1文字以上必要です');
    }
  }
}

export class ImageInput {
  constructor(public readonly path: string) {
    if (![!!path, path.length > 0].every((_) => _)) {
      new GeminiSlackBotError('無効なファイルパスです');
    }
  }
}

export class Context {
  constructor(
    public readonly role: 'user' | 'model',
    public readonly text: TextInput,
    public readonly images: ImageInput[],
  ) {}
}

export class MultiModalInput {
  constructor(
    public readonly text: TextInput,
    public readonly images: ImageInput[],
    public readonly contexts: Context[],
  ) {
    if (![!text].every((_) => _)) {
      new GeminiSlackBotError('入力を正しく受け取れませんでした');
    }
    if (!images) {
      this.images = [];
    }
  }
}
