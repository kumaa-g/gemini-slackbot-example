import { Context } from '../message/input';

export interface IConversationRepository {
  findByIds(input: Partial<Input>): Promise<Context[]>;
}

export interface Input {
  channel: string;
  thread: string;
}
