import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '~/config';
import { ILLM } from '~/domain/model/llm/llm';
import { ImageInput, MultiModalInput } from '~/domain/model/message/input';
import { MessageOutput } from '~/domain/model/message/output';
import * as fs from 'fs/promises';
import { mimeType } from '~/util/image/mime-type';

export function makeClient(): AnthropicVertex {
  return new AnthropicVertex({
    region: config.gcp.project,
  });
}

export class Claude3Opus implements ILLM {
  private readonly client: AnthropicVertex;
  constructor() {
    this.client = makeClient();
  }
  public async generate(input: MultiModalInput): Promise<MessageOutput> {
    const res = await this.client.messages.create({
      max_tokens: 300,
      messages: [],
      model: 'claude-3-opus@20240229',
      stream: false,
    });
    return new MessageOutput(res.content[0].text);
  }
  private async toMessages(
    input: MultiModalInput,
  ): Promise<Anthropic.MessageParam[]> {
    return await Promise.all(
      input.contexts.map(async (v): Promise<Anthropic.MessageParam> => {
        const role = v.role === 'user' ? v.role : 'assistant';
        if (v.images.length <= 0) {
          return {
            content: v.text.v,
            role,
          };
        }
        return {
          content: [
            {
              text: v.text.v,
              type: 'text',
            },
            ...(await this.toImageBlocks(v.images)),
          ],
          role,
        };
      }),
    );
  }
  private async toImageBlocks(
    vs: ImageInput[],
  ): Promise<Anthropic.ImageBlockParam[]> {
    return await Promise.all(
      vs.map(async (v): Promise<Anthropic.ImageBlockParam> => {
        return {
          source: {
            data: (await fs.readFile(v.path)).toString('base64'),
            media_type: mimeType(
              v.path,
            ) as Anthropic.ImageBlockParam.Source['media_type'],
            type: 'base64',
          },
          type: 'image',
        };
      }),
    );
  }
}
