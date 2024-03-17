import { GeminiSlackBotError } from '~/domain/error/error';
import { messages } from '~/domain/error/message';

export class TextInput {
  constructor(public readonly v: string) {
    if (![!!v, v.length >= 0].every((_) => _)) {
      new GeminiSlackBotError(messages.INVALID_TEXT_INPUT);
    }
  }
}

export class ImageInput {
  constructor(public readonly path: string) {
    if (![!!path, path.length > 0].every((_) => _)) {
      new GeminiSlackBotError(messages.INVALID_IMAGE_INPUT);
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
      throw new Error(messages.INVALID_CONTEXT);
    }
  }
}
