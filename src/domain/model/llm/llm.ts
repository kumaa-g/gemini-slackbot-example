import { TextInput } from '../message/input';
import { MessageOutput } from '../message/output';

export interface ILLM {
  generate(input: TextInput): Promise<MessageOutput>;
}
