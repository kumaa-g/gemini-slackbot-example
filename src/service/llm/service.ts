import { ILLM } from '~/domain/model/llm/llm';
import {
  ImageInput,
  MultiModalInput,
  TextInput,
} from '~/domain/model/message/input';

export class LLMService {
  constructor(private readonly llm: ILLM) {}
  public async execute(input: {
    prompt: string;
    images: string[];
  }): Promise<string> {
    const images: ImageInput[] = [];
    input.images.forEach((v) => {
      try {
        const x = new ImageInput(v);
        images.push(x);
      } catch (e) {
        // TODO: error report
      }
    });
    return (
      await this.llm.generate(
        new MultiModalInput(new TextInput(input.prompt), images),
      )
    ).v;
  }
}
