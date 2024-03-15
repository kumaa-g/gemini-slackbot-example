import { Context, MultiModalInput } from '~/domain/model/message/input';

// https://github.com/googleapis/nodejs-vertexai/issues/139
// multiturn で会話するときは user <=> model を交互に prompt or history として与える必要がある
export function alternate(src: MultiModalInput): MultiModalInput {
  const dst: Context[] = [src.contexts[0]];
  for (const v of src.contexts) {
    const last = dst[dst.length - 1];
    if (last.role !== v.role) {
      dst.push(v);
    }
  }
  return new MultiModalInput(dst);
}
