import { VertexAI } from '@google-cloud/vertexai';
import { config } from '~/config';
import { Gemini } from './repository';
import {
  ImageInput,
  MultiModalInput,
  TextInput,
} from '~/domain/model/message/input';
import * as path from 'path';

describe('Gemini', () => {
  const gemini = new Gemini(
    new VertexAI({
      project: config.gcp.project,
      location: 'asia-northeast1',
    }),
  );
  describe('#generate', () => {
    describe('with text', () => {
      it('returns generated', async () => {
        const v = await gemini.generate(
          new MultiModalInput(new TextInput('おはようございます'), [], []),
        );
        console.log(v.v);
        expect(v.v.length > 0).toEqual(true);
      });
    });
    describe('with text+image', () => {
      it('returns generated', async () => {
        const v = await gemini.generate(
          new MultiModalInput(
            new TextInput('画像に含まれる食べ物は??'),
            [new ImageInput(path.join(__dirname, './big-mac.png'))],
            [],
          ),
        );
        console.log(v.v);
        expect(v.v.length > 0).toEqual(true);
      });
    });
    describe('with text+images', () => {
      it('returns generated', async () => {
        const v = await gemini.generate(
          new MultiModalInput(
            new TextInput('1枚目の画像と2枚目の画像の違いを教えて'),
            [
              new ImageInput(path.join(__dirname, './big-mac.png')),
              new ImageInput(path.join(__dirname, './teriyaki.png')),
            ],
            [],
          ),
        );
        console.log(v.v);
        expect(v.v.length > 0).toEqual(true);
      });
    });
  });
});
