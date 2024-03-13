import { IConversationRepository } from '~/domain/model/conversation/repository';
import { ILLM } from '~/domain/model/llm/llm';
import {
  ImageInput,
  MultiModalInput,
  TextInput,
} from '~/domain/model/message/input';

export class LLMService {
  constructor(
    private readonly llm: ILLM,
    private readonly conversation: IConversationRepository,
  ) {}
  public async execute(
    input: {
      prompt: string;
      images: string[];
    },
    conversation: {
      channel: string;
      thread: string;
    },
  ): Promise<string> {
    const images: ImageInput[] = [];
    input.images.forEach((v) => {
      try {
        images.push(new ImageInput(v));
      } catch (e) {
        // TODO: error report
      }
    });
    const contexts = await this.conversation.findByIds({
      channel: conversation.channel,
      thread: conversation.thread,
    });
    return (
      await this.llm.generate(
        new MultiModalInput(new TextInput(input.prompt), images, contexts),
      )
    ).v;
  }
}
