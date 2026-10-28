// Prefix a path with Astro's configured `base` so links work whether the site
// is served from the domain root ("/") or a subpath ("/repo/").
// Usage: url('music/') -> '/music/' (user site) or '/repo/music/' (project site).
const BASE = import.meta.env.BASE_URL; // always ends with "/" in Astro

export function url(path = ''): string {
  const clean = path.replace(/^\/+/, '');
  return BASE.endsWith('/') ? BASE + clean : BASE + '/' + clean;
}
