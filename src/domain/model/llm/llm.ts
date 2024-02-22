import { MessageInput } from '../message/input';
import { MessageOutput } from '../message/output';

export interface ILLM {
  generate(input: MessageInput): Promise<MessageOutput>;
}
