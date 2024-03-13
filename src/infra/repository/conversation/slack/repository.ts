import {
  IConversationRepository,
  Input,
} from '~/domain/model/conversation/repository';
import { Context } from '~/domain/model/message/input';
import { WebClient } from '@slack/web-api';

export class SlackConversationRepository implements IConversationRepository {
  constructor(private readonly client: WebClient) {}
  public async findByIds(input: Partial<Input>): Promise<Context[]> {
    return [];
  }
}
