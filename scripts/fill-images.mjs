/**
 * Completa hasta 25 imágenes por estilo cuando la búsqueda inicial
 * devuelve pocos resultados. Uso: node scripts/fill-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '..');
const IMG_DIR = path.join(ROOT, 'assets', 'img');
const MANIFEST = path.join(ROOT, 'assets', 'js', 'manifest.js');

const ALT = {
  'men-vintage': ['retro menswear fashion', '70s men fashion outfit'],
  'women-hippie': ['boho chic outfit woman', 'bohemian fashion woman dress', 'hippie style woman festival'],
  'women-casual': ['women casual fashion street style', 'everyday outfit woman jeans', 'casual chic woman outfit'],
};

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const src = fs.readFileSync(MANIFEST, 'utf8');
const manifest = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const normalize = (raw) => {
  const u = decode(raw).split('?')[0];
  return /^https?:\/\//i.test(u) ? u.replace(/i\.pinimg\.com\/(originals|474x|736x)\//, 'i.pinimg.com/736x/') : null;
};

async function search(query, first) {
  const res = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}&first=${first}&form=HDRSC2`, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(25000),
  });
  const html = await res.text();
  return [...html.matchAll(/murl&quot;:&quot;(.*?)&quot;/g)].map((m) => normalize(m[1])).filter(Boolean);
}

async function fetchImage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Referer: 'https://www.bing.com/' },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) return null;
  const type = (res.headers.get('content-type') || '').toLowerCase();
  if (!type.startsWith('image/')) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000 || buf.length > 8_000_000) return null;
  let ext = 'jpg';
  if (type.includes('png')) ext = 'png';
  else if (type.includes('webp')) ext = 'webp';
  return { buf, ext };
}

const usedUrls = new Set(Object.values(manifest).flat());
const usedHashes = new Set();
for (const files of Object.values(manifest)) {
  for (const file of files) {
    try {
      usedHashes.add(crypto.createHash('sha1').update(fs.readFileSync(path.join(ROOT, file))).digest('hex'));
    } catch {}
  }
}

for (const [key, queries] of Object.entries(ALT)) {
  const list = manifest[key] || [];
  if (list.length >= 25) continue;
  const dir = path.join(IMG_DIR, key);
  for (const query of queries) {
    if (list.length >= 25) break;
    for (let page = 1; page <= 4 && list.length < 25; page++) {
      let urls = [];
      try {
        urls = await search(query, (page - 1) * 30 + 1);
      } catch {
        continue;
      }
      for (const url of urls) {
        if (list.length >= 25) break;
        if (usedUrls.has(url)) continue;
        usedUrls.add(url);
        try {
          const img = await fetchImage(url);
          if (!img) continue;
          const hash = crypto.createHash('sha1').update(img.buf).digest('hex');
          if (usedHashes.has(hash)) continue;
          usedHashes.add(hash);
          const file = `${String(list.length + 1).padStart(2, '0')}.${img.ext}`;
          fs.writeFileSync(path.join(dir, file), img.buf);
          list.push(`assets/img/${key}/${file}`);
        } catch {}
      }
    }
  }
  manifest[key] = list;
  console.log(`${key}: ${list.length}/25`);
}

fs.writeFileSync(MANIFEST, `/* Generado por scripts/fetch-images.mjs */\nwindow.NOIR_IMAGES = ${JSON.stringify(manifest, null, 2)};\n`);
console.log('Manifiesto actualizado');
