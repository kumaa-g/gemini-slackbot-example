import { ILLM } from '~/domain/model/llm/llm';
import { TextInput } from '~/domain/model/message/input';

export class LLMService {
  constructor(private readonly llm: ILLM) {}
  // TODO: includes images
  public async execute(input: { prompt: string }): Promise<string> {
    const i = new TextInput(input.prompt);
    return (await this.llm.generate(i)).v;
  }
}
