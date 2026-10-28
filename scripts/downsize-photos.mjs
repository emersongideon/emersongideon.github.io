// Shrink photo originals to a sensible max edge before they go into the repo,
// so the published GitHub Pages site stays well under its 1 GB limit.
// Usage:  node scripts/downsize-photos.mjs [dir] [maxEdge]
// Default: downsizes everything under src/assets to a 2400px max edge, in place.
import { readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const dir = process.argv[2] ?? 'src/assets';
const maxEdge = Number(process.argv[3] ?? 2400);
const exts = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function* walk(root) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (exts.has(extname(entry.name).toLowerCase())) yield path;
  }
}

let changed = 0;
for await (const file of walk(dir)) {
  const image = sharp(file);
  const { width, height } = await image.metadata();
  if (width <= maxEdge && height <= maxEdge) continue;

  const before = (await stat(file)).size;
  const buffer = await image
    .rotate() // honour EXIF orientation before stripping it
    .resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true })
    .toBuffer();
  await sharp(buffer).toFile(file);

  const after = (await stat(file)).size;
  changed++;
  console.log(`${file}  ${width}x${height} -> max ${maxEdge}px  (${(before / 1024) | 0}kB -> ${(after / 1024) | 0}kB)`);
}

console.log(changed ? `\nDownsized ${changed} image(s).` : 'Nothing to downsize; all images are within the limit.');
