/**
 * Descarga imágenes de referencia desde la búsqueda de imágenes de Bing
 * y genera el manifiesto usado por la web de NOIR.
 * Uso: node scripts/fetch-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '..');
const IMG_DIR = path.join(ROOT, 'assets', 'img');
const JS_DIR = path.join(ROOT, 'assets', 'js');
fs.mkdirSync(IMG_DIR, { recursive: true });
fs.mkdirSync(JS_DIR, { recursive: true });

const QUERIES = {
  'men-oldmoney': 'old money style men outfit elegant',
  'men-streetwear': 'streetwear outfit men hoodie sneakers',
  'men-cleanfit': 'clean fit outfit men minimal style',
  'women-coquette': 'coquette aesthetic outfit woman',
  'women-kawaii': 'kawaii fashion outfit japan style',
  'women-preppy': 'preppy outfit women plaid skirt',
  'men-vintage': 'vintage outfit men retro 70s style',
  'women-vintage': 'vintage outfit women retro dress',
  'men-gotico': 'gothic outfit men black style',
  'women-gotico': 'gothic outfit woman black dress',
  'men-hippie': 'hippie outfit men 70s style',
  'women-hippie': 'hippie outfit women boho style',
  'men-casual': 'casual outfit men everyday style',
  'women-casual': 'casual outfit women everyday style',
  'men-formal': 'formal suit outfit men elegant',
  'women-formal': 'formal outfit women elegant dress',
  'men-alternativo': 'alternative outfit men edgy style',
  'women-alternativo': 'alternative outfit women edgy style',
};

const PER_STYLE = 25;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function normalizeUrl(raw) {
  let u = decode(raw).split('?')[0];
  if (!/^https?:\/\//i.test(u)) return null;
  // Versiones más ligeras de Pinterest
  u = u.replace(/i\.pinimg\.com\/(originals|474x|736x)\//, 'i.pinimg.com/736x/');
  return u;
}

async function candidates(query, first) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&first=${first}&form=HDRSC2`;
  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(25000) });
  const html = await res.text();
  return [...html.matchAll(/murl&quot;:&quot;(.*?)&quot;/g)]
    .map((m) => normalizeUrl(m[1]))
    .filter(Boolean);
}

async function download(url) {
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
  else if (type.includes('gif')) ext = 'gif';
  return { buf, ext };
}

const usedUrls = new Set();
const usedHashes = new Set();
const manifest = {};

for (const [key, query] of Object.entries(QUERIES)) {
  const dir = path.join(IMG_DIR, key);
  fs.mkdirSync(dir, { recursive: true });
  manifest[key] = [];
  let saved = 0;
  let page = 1;
  while (saved < PER_STYLE && page <= 4) {
    let urls = [];
    try {
      urls = await candidates(query, (page - 1) * 30 + 1);
    } catch (e) {
      console.log(`  ! búsqueda fallida ${key} p${page}: ${e.message}`);
      page++;
      continue;
    }
    for (const url of urls) {
      if (saved >= PER_STYLE) break;
      if (usedUrls.has(url)) continue;
      usedUrls.add(url);
      try {
        const img = await download(url);
        if (!img) continue;
        const hash = crypto.createHash('sha1').update(img.buf).digest('hex');
        if (usedHashes.has(hash)) continue;
        usedHashes.add(hash);
        const file = `${String(saved + 1).padStart(2, '0')}.${img.ext}`;
        fs.writeFileSync(path.join(dir, file), img.buf);
        manifest[key].push(`assets/img/${key}/${file}`);
        saved++;
      } catch {
        /* descarga fallida: seguimos con la siguiente candidata */
      }
    }
    page++;
  }
  console.log(`${key}: ${saved}/${PER_STYLE}`);
}

fs.writeFileSync(
  path.join(JS_DIR, 'manifest.js'),
  `/* Generado por scripts/fetch-images.mjs */\nwindow.NOIR_IMAGES = ${JSON.stringify(manifest, null, 2)};\n`
);
console.log('Manifiesto listo:', Object.values(manifest).reduce((a, b) => a + b.length, 0), 'imágenes');
