import { GeminiSlackBotError } from '~/domain/error/error';

export class TextInput {
  constructor(public readonly v: string) {
    if (![!!v, v.length >= 0].every((_) => _)) {
      new GeminiSlackBotError(
        '1文字以上の文字を入力するか, なんらかのファイルを入力してください',
      );
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
  constructor(public readonly contexts: Context[]) {
    if (![!!contexts, !!contexts.length].every((_) => _)) {
      throw new Error('最低一つのプロンプトや, ファイルを入力してください');
    }
  }
}
