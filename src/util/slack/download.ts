import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { config } from '~/config';
import { info } from '~/util/logging/stdout';

export async function downloadSlackPrivateFile(
  link: string,
  filename: string,
): Promise<string> {
  const res = await fetch(link, {
    headers: {
      Authorization: `Bearer ${config.slack.botToken}`,
    },
  });
  if (res.status >= 400 || !res.body) {
    throw new Error('failed to file download...');
  }
  const to = path.join(os.tmpdir(), filename),
    dst = fs.createWriteStream(to);
  info(`downloaded path: ${to}`, {
    component: 'slack/private-file-download',
  });
  await pipeline(res.body, dst);
  return to;
}
