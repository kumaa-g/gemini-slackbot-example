import { randomInt } from 'crypto';

const MAX_BACKOFF = 32 * 1000,
  MIN_JITTER = 10,
  MAX_JITTER = 500;

export async function retry<T>(
  fn: () => Promise<T>,
  // if 0, exec just once.
  maxAttepts: number,
  baseBackOff: number,
): Promise<T | undefined> {
  let attempts = 0;
  while (attempts <= maxAttepts) {
    try {
      return await fn();
    } catch (e) {
      if (attempts >= maxAttepts) {
        throw new Error(
          `reached max attempts: ${maxAttepts}. original error: ${e}`,
        );
      }
      console.error(e);
    }
    await new Promise((resolve) => {
      setTimeout(
        resolve,
        Math.min(2 ** attempts * baseBackOff) +
          randomInt(MIN_JITTER, MAX_JITTER),
      );
    });
    attempts++;
  }
}
