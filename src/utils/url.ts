export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  if (base && base !== '/' && !path.startsWith(base)) {
    return base + (path.startsWith('/') ? path : '/' + path);
  }
  return path;
}
