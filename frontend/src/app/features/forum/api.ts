import type { ForumPost } from './types';
import { summarizePost } from './utils';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function mockForumRequest<T>(payload: T, ms = 700): Promise<T> {
  await delay(ms);
  return payload;
}

export async function generatePostSummary(post: ForumPost): Promise<string> {
  await delay(780);
  return summarizePost(post);
}
