/**
 * Respaldo con Yandex Images para estilos que faltan. Reanudable.
 * Uso: node scripts/fetch-yandex.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '..');
const NEW_DIR = path.join(ROOT, 'assets', 'img_new');
const OLD_DIR = path.join(ROOT, 'assets', 'img');
const MANIFEST = path.join(ROOT, 'assets', 'js', 'manifest.js');
const PROGRESS = path.join(ROOT, 'assets', 'js', 'manifest.new.json');
const PER_STYLE = 25;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const QUERIES = {
  'men-oldmoney': ['old money outfit men'],
  'men-streetwear': ['streetwear outfit men'],
  'men-cleanfit': ['clean fit outfit men'],
  'women-coquette': ['coquette outfit woman'],
  'women-kawaii': ['kawaii fashion outfit woman'],
  'women-preppy': ['preppy outfit woman'],
  'men-vintage': ['vintage outfit men retro', '70s menswear outfit'],
  'women-vintage': ['vintage outfit woman retro', 'retro dress woman'],
  'men-gotico': ['gothic outfit men', 'goth mens fashion'],
  'women-gotico': ['gothic outfit woman dress', 'goth outfit woman'],
  'men-hippie': ['hippie outfit men', 'boho mens fashion'],
  'women-hippie': ['hippie outfit woman boho'],
  'men-casual': ['casual outfit men'],
  'women-casual': ['casual outfit woman'],
  'men-formal': ['formal suit outfit men'],
  'women-formal': ['formal dress outfit woman'],
  'men-alternativo': ['alternative outfit men punk'],
  'women-alternativo': ['alternative outfit woman punk grunge', 'grunge outfit woman'],
};

const RE = {
  oldmoney: /old money|quiet luxury|timeless|sartorial|classic|elegant/i,
  streetwear: /streetwear|street style|street fashion|urban|hoodie|sneaker|baggy|oversized|skate/i,
  cleanfit: /clean fit|clean look|minimal|minimalist|simple|neutral/i,
  coquette: /coquette|romantic|bow|lace|girly|feminine|princess|dress/i,
  kawaii: /kawaii|harajuku|decora|cute|pastel|jk uniform|anime|lolita/i,
  preppy: /preppy|pleated|plaid|argyle|cardigan|collegiate|ivy|classic/i,
  vintage: /vintage|retro|70s|60s|1950s|1940s|thrift|classic/i,
  gotico: /goth|gothic|dark|black|lace|corset|emo|grunge/i,
  hippie: /hippie|hippy|boho|bohemian|70s|woodstock|flower|festival/i,
  casual: /casual|everyday|comfy|weekend|simple|smart|outfit/i,
  formal: /formal|suit|tuxedo|black tie|wedding|gala|elegant|business|dress/i,
  alternativo: /alternative|alt |punk|grunge|emo|indie|rock|edgy|leather/i,
};

const BLOCK = /costume|fancy dress|halloween|paper doll|coloring|wallpaper|png|vector|template|poster|logo|pdf|transparent/i;
const WOMAN = /woman|women|female|girl|ladies|lady|feminine|she|her\b/i;
const MAN = /men\b|man\b|male|guy|gentleman|boys|him\b/i;

fs.mkdirSync(NEW_DIR, { recursive: true });
const manifest = {};
for (const key of Object.keys(QUERIES)) {
  const dir = path.join(NEW_DIR, key);
  fs.mkdirSync(dir, { recursive: true });
  const files = fs.readdirSync(dir).filter((f) => /\.(jpg|png|webp|gif)$/i.test(f)).sort();
  manifest[key] = files.map((f) => `assets/img/${key}/${f}`).slice(0, PER_STYLE);
}

async function yandex(query, offset) {
  const url = `https://yandex.com/images/search?text=${encodeURIComponent(query)}&offset=${offset}`;
  const html = await (
    await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' }, signal: AbortSignal.timeout(20000) })
  ).text();
  const alts = [...html.matchAll(/&quot;alt&quot;:&quot;(.*?)&quot;/g)].map((m) => m[1]);
  const urls = [...html.matchAll(/&quot;origUrl&quot;:&quot;(.*?)&quot;/g)].map((m) => m[1]);
  return alts.map((title, i) => ({ title, image: urls[i] })).filter((r) => r.image);
}

async function download(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Referer: 'https://yandex.com/' },
    signal: AbortSignal.timeout(18000),
  });
  if (!res.ok) return null;
  const type = (res.headers.get('content-type') || '').toLowerCase();
  if (!type.startsWith('image/')) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 9000 || buf.length > 9_000_000) return null;
  let ext = 'jpg';
  if (type.includes('png')) ext = 'png';
  else if (type.includes('webp')) ext = 'webp';
  else if (type.includes('gif')) ext = 'gif';
  return { buf, ext };
}

async function mapLimit(items, limit, fn) {
  const result = Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const i = cursor++;
        result[i] = await fn(items[i]);
      }
    })
  );
  return result;
}

const usedHashes = new Set();
for (const files of Object.values(manifest)) {
  for (const file of files) {
    try {
      usedHashes.add(crypto.createHash('sha1').update(fs.readFileSync(path.join(ROOT, file.replace('assets/img/', 'assets/img_new/')))).digest('hex'));
    } catch {}
  }
}

for (const [key, queries] of Object.entries(QUERIES)) {
  if (manifest[key].length >= PER_STYLE) continue;
  const styleId = key.split('-').slice(1).join('-');
  const gender = key.startsWith('women-') ? 'women' : 'men';
  const candidates = [];
  for (const q of queries) {
    for (const offset of [0, 30]) {
      try {
        const results = await yandex(q, offset);
        const valid = results.filter((r) => {
          const t = r.title;
          if (BLOCK.test(t)) return false;
          if (gender === 'women' && MAN.test(t) && !WOMAN.test(t)) return false;
          if (gender === 'men' && WOMAN.test(t) && !MAN.test(t)) return false;
          return (RE[styleId] || /./i).test(t) && /^https?:\/\//.test(r.image);
        });
        candidates.push(...valid.map((r) => r.image.split('?')[0]));
      } catch (e) {
        console.log('  !', q, offset, e.message);
      }
      await wait(900);
    }
  }
  const unique = [...new Set(candidates)];
  const dir = path.join(NEW_DIR, key);
  await mapLimit(unique, 6, async (url) => {
    if (manifest[key].length >= PER_STYLE + 5) return;
    try {
      const img = await download(url);
      if (!img) return;
      const hash = crypto.createHash('sha1').update(img.buf).digest('hex');
      if (usedHashes.has(hash)) return;
      usedHashes.add(hash);
      const file = `${String(manifest[key].length + 1).padStart(2, '0')}.${img.ext}`;
      fs.writeFileSync(path.join(dir, file), img.buf);
      manifest[key].push(`assets/img/${key}/${file}`);
    } catch {}
  });
  manifest[key] = manifest[key].slice(0, PER_STYLE);
  fs.writeFileSync(PROGRESS, JSON.stringify(manifest, null, 2));
  console.log(`${key}: ${manifest[key].length}/${PER_STYLE} (candidatas ${unique.length})`);
}

if (Object.values(manifest).every((list) => list.length >= 20)) {
  fs.writeFileSync(MANIFEST, `/* Generado por scripts/fetch-yandex.mjs */\nwindow.NOIR_IMAGES = ${JSON.stringify(manifest, null, 2)};\n`);
  fs.rmSync(OLD_DIR, { recursive: true, force: true });
  fs.renameSync(NEW_DIR, OLD_DIR);
  console.log('Imágenes reemplazadas y manifiesto actualizado');
} else {
  console.log('Faltan estilos; vuelve a ejecutar el script');
}
