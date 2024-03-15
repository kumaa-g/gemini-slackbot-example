import { ILLM } from '~/domain/model/llm/llm';
import { ImageInput, MultiModalInput } from '~/domain/model/message/input';
import { MessageOutput } from '~/domain/model/message/output';
import { Content, InlineDataPart, VertexAI } from '@google-cloud/vertexai';
import { mimeType } from '~/util/image/mime-type';
import * as fs from 'fs/promises';
import { info } from '~/util/logging/stdout';

const component = 'llm/gemini';

export class Gemini implements ILLM {
  constructor(private readonly client: VertexAI) {}
  public async generate(input: MultiModalInput): Promise<MessageOutput> {
    console.log(JSON.stringify(await this.prompt(input), null, 2));
    const model = this.client.getGenerativeModel({
        model: 'gemini-pro-vision',
        generation_config: {
          max_output_tokens: 2048,
          temperature: 0.4,
          top_p: 1,
          top_k: 32,
        },
      }),
      // images = await Promise.all(
      //   input.images.map(async (v): Promise<InlineDataPart> => {
      //     return {
      //       inline_data: {
      //         mime_type: mimeType(v.path),
      //         data: (await fs.readFile(v.path)).toString('base64'),
      //       },
      //     };
      //   }),
      // ),
      tmp = await model.startChat({
        history: await this.prompt(input),
      }),
      res = await model.generateContent({
        contents: await this.prompt(input),
        // contents: [
        //   // TODO: prompt に与えられたものは一番最後に、手前に contexts を入れる
        //   {
        //     role: 'user',
        //     parts: [
        //       {
        //         text: input.text.v,
        //       },
        //       ...images,
        //     ],
        //   },
        // ],
      });
    // info(`raw generated contents: ${JSON.stringify(res.history)}`, {
    //   component,
    // });
    info(`raw generated contents: ${JSON.stringify(res.response)}`, {
      component,
    });
    return new MessageOutput(
      // res.history[res.history.length - 1].parts[0].text ?? '',
      res.response.candidates[0].content.parts[0].text ?? '',
    );
  }
  private async prompt(input: MultiModalInput): Promise<Content[]> {
    const contexts: Content[] = await Promise.all(
      input.contexts.map(async (v): Promise<Content> => {
        return {
          role: v.role,
          parts: [
            {
              text: v.text.v,
            },
            ...(await this.toInlintData(v.images)),
          ],
        };
      }),
    );
    return contexts;
  }
  private async toInlintData(images: ImageInput[]): Promise<InlineDataPart[]> {
    return await Promise.all(
      images.map(async (v): Promise<InlineDataPart> => {
        return {
          inline_data: {
            mime_type: mimeType(v.path),
            data: (await fs.readFile(v.path)).toString('base64'),
          },
        };
      }),
    );
  }
}
