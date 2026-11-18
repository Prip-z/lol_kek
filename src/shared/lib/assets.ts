export function assetUrl(filename: string): string {
  const clean = filename.replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${clean}`;
}