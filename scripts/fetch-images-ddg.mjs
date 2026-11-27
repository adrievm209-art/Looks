/**
 * Descarga imágenes de outfit filtradas por estilo (DuckDuckGo + Bing como respaldo).
 * Reanudable: continúa desde assets/img_new / assets/js/manifest.new.json.
 * Uso: node scripts/fetch-images-ddg.mjs
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

const CONFIG = {
  'men-oldmoney': { q: ['old money style outfit men'], re: /old money|quiet luxury|timeless|sartorial|heritage|classic outfit|elegant men|smart casual|clásico/i },
  'men-streetwear': { q: ['streetwear outfit men'], re: /streetwear|street style|street fashion|urban|hoodie|sneaker|baggy|oversized|skate|calle/i },
  'men-cleanfit': { q: ['clean fit outfit men minimal'], re: /clean fit|clean look|minimal|minimalist|simple outfit|neutral outfit|effortless|mínimo/i },
  'women-coquette': { q: ['coquette outfit woman'], re: /coquette|romantic|bow|lace|girly|feminine|princess|dress|romántico/i },
  'women-kawaii': { q: ['kawaii fashion outfit woman'], re: /kawaii|harajuku|decora|cute|pastel|jk uniform|anime|lolita|mono/i },
  'women-preppy': { q: ['preppy outfit woman'], re: /preppy|pleated|plaid|argyle|cardigan|collegiate|ivy|classic/i },
  'men-vintage': { q: ['vintage outfit men retro', 'retro menswear fashion'], re: /vintage|retro|70s|60s|1950s|1940s|thrift|heritage|años 70|clásico/i },
  'women-vintage': { q: ['vintage outfit woman retro', 'retro dress outfit woman'], re: /vintage|retro|70s|60s|1950s|1940s|thrift|classic|años 70|clásico/i },
  'men-gotico': { q: ['gothic fashion outfit men', 'goth outfit men'], re: /goth|gothic|dark outfit|black outfit|grunge|emo|alternative|gótico|negro/i },
  'women-gotico': { q: ['gothic dress woman', 'goth outfit woman'], re: /goth|gothic|dark dress|black dress|lace|corset|emo|whimsigoth|gótico|encaje/i },
  'men-hippie': { q: ['hippie outfit men 70s', 'boho mens fashion'], re: /hippie|hippy|boho|bohemian|70s|woodstock|flower child|festival|hipi/i },
  'women-hippie': { q: ['hippie outfit woman boho', 'bohemian fashion woman'], re: /hippie|hippy|boho|bohemian|70s|woodstock|flower child|festival|hipi/i },
  'men-casual': { q: ['casual outfit men everyday', 'men casual street style'], re: /casual|everyday|comfy|weekend|simple outfit|smart casual|outfit ideas|diario|vaqueros/i },
  'women-casual': { q: ['casual outfit woman everyday', 'women casual street style'], re: /casual|everyday|comfy|weekend|simple outfit|smart casual|outfit ideas|diario|vaqueros/i },
  'men-formal': { q: ['formal suit outfit men', 'men suit style wedding'], re: /formal|suit|tuxedo|black tie|wedding|gala|elegant|business|traje|boda/i },
  'women-formal': { q: ['formal dress outfit woman', 'elegant evening dress woman'], re: /formal|elegant|dress|gala|wedding guest|black tie|office|evening|elegante|boda/i },
  'men-alternativo': { q: ['alternative outfit men punk', 'grunge mens fashion'], re: /alternative|alt |punk|grunge|emo|indie|rock|edgy|leather|alternativo/i },
  'women-alternativo': { q: ['alternative outfit woman punk', 'grunge outfit woman'], re: /alternative|alt |punk|grunge|emo|indie|rock|edgy|leather|alternativo/i },
};

const BLOCK = /costume|fancy dress|halloween|paper doll|coloring|wallpaper|png|vector|template|poster|logo|pdf|transparent/i;
const WOMAN = /woman|women|female|girl|ladies|lady|feminine|she|her\b|mujer|chica/i;
const MAN = /men\b|man\b|male|guy|gentleman|boys|him\b|hombre/i;

fs.mkdirSync(NEW_DIR, { recursive: true });

const manifest = {};
for (const key of Object.keys(CONFIG)) {
  const dir = path.join(NEW_DIR, key);
  fs.mkdirSync(dir, { recursive: true });
  const files = fs.readdirSync(dir).filter((f) => /\.(jpg|png|webp|gif)$/i.test(f)).sort();
  manifest[key] = files.map((f) => `assets/img/${key}/${f}`).slice(0, PER_STYLE);
}

async function ddg(query) {
  const html = await (
    await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images&v=${Date.now()}`, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
      signal: AbortSignal.timeout(15000),
    })
  ).text();
  const vqd = html.match(/vqd=["']?([\d-]+)/);
  if (!vqd) throw new Error('sin vqd');
  const res = await fetch(
    `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd[1]}&f=%2C%2C%2C&p=1`,
    { headers: { 'User-Agent': UA, Referer: 'https://duckduckgo.com/' }, signal: AbortSignal.timeout(15000) }
  );
  const data = await res.json();
  if (!Array.isArray(data.results)) throw new Error('sin resultados');
  return data.results.map((r) => ({ title: r.title || '', image: r.image }));
}

async function bing(query) {
  const html = await (
    await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(15000),
    })
  ).text();
  return [...html.matchAll(/m="(\{.*?\})"/g)]
    .map((m) => {
      try {
        const j = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'"));
        return { title: j.t || '', image: j.murl };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

async function download(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Referer: 'https://duckduckgo.com/' },
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

for (const [key, cfg] of Object.entries(CONFIG)) {
  if (manifest[key].length >= PER_STYLE) {
    console.log(`${key}: ya completo (${manifest[key].length})`);
    continue;
  }

  const gender = key.startsWith('women-') ? 'women' : 'men';
  const valid = (r) => {
    const title = r.title || '';
    if (BLOCK.test(title)) return false;
    if (gender === 'women' && MAN.test(title) && !WOMAN.test(title)) return false;
    if (gender === 'men' && WOMAN.test(title) && !MAN.test(title)) return false;
    return cfg.re.test(title) && /^https?:\/\//.test(r.image || '');
  };

  let raw = [];
  for (const q of cfg.q) {
    try {
      const found = await ddg(q);
      raw.push(...found.filter(valid));
      console.log(`  DDG ${q}: ${found.length} resultados`);
      break;
    } catch {
      try {
        const found = await bing(q);
        raw.push(...found.filter(valid));
        console.log(`  Bing ${q}: ${found.length} resultados (${raw.length} válidos)`);
      } catch {
        console.log(`  ! falló ${q}`);
      }
    }
    await wait(1200);
  }
  if (raw.length < PER_STYLE) {
    for (const q of cfg.q.slice(1)) {
      try {
        const found = await bing(q);
        raw.push(...found.filter(valid));
      } catch {}
      await wait(800);
    }
  }

  const unique = [...new Set(raw.map((r) => r.image.split('?')[0]))].filter((u) => !u.includes('duckduckgo.com'));
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
  await wait(1500);
}

if (Object.values(manifest).every((list) => list.length >= 20)) {
  fs.writeFileSync(MANIFEST, `/* Generado por scripts/fetch-images-ddg.mjs */\nwindow.NOIR_IMAGES = ${JSON.stringify(manifest, null, 2)};\n`);
  fs.rmSync(OLD_DIR, { recursive: true, force: true });
  fs.renameSync(NEW_DIR, OLD_DIR);
  console.log('Imágenes reemplazadas y manifiesto actualizado');
} else {
  console.log('Faltan estilos; vuelve a ejecutar el script para continuar');
}
