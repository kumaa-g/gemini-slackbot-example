export function mimeType(v: string): string {
  const split = v.split('.'),
    ext = split[split.length - 1];
  switch (ext) {
    case 'jpg': {
      return 'image/jpeg';
    }
    case 'jpeg': {
      return 'image/jpeg';
    }
    case 'png': {
      return 'image/png';
    }
    case 'gif': {
      return 'image/gif';
    }
    case 'webp': {
      return 'image/webp';
    }
    default: {
      throw new Error(`拡張子: "${ext}" はサポートされていません`);
    }
  }
}
