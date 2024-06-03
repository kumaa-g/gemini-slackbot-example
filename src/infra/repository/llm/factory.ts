import { config } from '~/config';
import { ILLM } from '~/domain/model/llm/llm';
import { warn } from '~/util/logging/stdout';
import { Claude3Opus } from './claude3-opus/repository';
import { Gemini } from './gemini/repository';
import { VertexAI } from '@google-cloud/vertexai';

const availables = ['gemini', 'claude3'];

export function makeLlmInstance(name: string): ILLM {
  let model = name;
  if (!availables.includes(name)) {
    warn(
      `specified model name is invalid: ${name}... please specify ${availables.join(
        ',',
      )}`,
      { label: 'llm' },
    );
    model = 'gemini';
  }
  if (model === 'claude3') {
    return new Claude3Opus();
  }
  return new Gemini(
    new VertexAI({
      project: config.gcp.project,
      location: config.gcp.region,
    }),
  );
}
