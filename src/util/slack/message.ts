export function stripMention(raw: string): string {
  return raw.replace(/<\@.+>/, '');
}
