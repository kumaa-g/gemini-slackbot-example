import { ILLM } from '~/domain/model/llm/llm';
import { MultiModalInput } from '~/domain/model/message/input';
import { MessageOutput } from '~/domain/model/message/output';
import { InlineDataPart, VertexAI } from '@google-cloud/vertexai';
import { mimeType } from '~/util/image/mime-type';
import * as fs from 'fs/promises';
import { info } from '~/util/logging/stdout';

const component = 'llm/gemini';

export class Gemini implements ILLM {
  constructor(private readonly client: VertexAI) {}
  public async generate(input: MultiModalInput): Promise<MessageOutput> {
    const model = this.client.getGenerativeModel({
        model: 'gemini-pro-vision',
        generation_config: {
          max_output_tokens: 2048,
          temperature: 0.4,
          top_p: 1,
          top_k: 32,
        },
      }),
      images = await Promise.all(
        input.images.map(async (v): Promise<InlineDataPart> => {
          return {
            inline_data: {
              mime_type: mimeType(v.path),
              data: (await fs.readFile(v.path)).toString('base64'),
            },
          };
        }),
      ),
      res = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: input.text.v,
              },
              ...images,
            ],
          },
        ],
      });
    info(`raw generated contents: ${JSON.stringify(res.response.candidates)}`, {
      component,
    });
    return new MessageOutput(
      res.response.candidates[0].content.parts[0].text ?? '',
    );
  }
}
