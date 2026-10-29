// Sync td-beginner-course/index.html from the published Claude artifact.
//
// The course page is edited in its Claude artifact (it has an in-page edit
// mode), so the artifact is the source of truth and this folder is a mirror.
// The page body is encrypted with the course password (AES-GCM, key from
// PBKDF2), so this script decrypts both copies to compare them.
//
// usage: node tools/sync-td-course.mjs <downloaded artifact index.html> <password>
//
// Prints one of:
//   NEED <assetId>   an image uploaded in edit mode is not mirrored yet; download it to
//                    td-beginner-course/img/blob/<assetId>.<ext> and run again (exit 2)
//   UNCHANGED        the mirror already matches the artifact (exit 0)
//   CHANGED          td-beginner-course/index.html was rewritten (exit 0)
import fs from 'node:fs';
import path from 'node:path';
import { webcrypto as c } from 'node:crypto';

const [src, pw] = process.argv.slice(2);
if (!src || !pw) { console.error('usage: node tools/sync-td-course.mjs <artifact.html> <password>'); process.exit(1); }
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'td-beginner-course');
const OUT = path.join(ROOT, 'index.html');
const BLOBDIR = path.join(ROOT, 'img', 'blob');

const b64d = s => Buffer.from(s, 'base64');
const b64e = u => Buffer.from(u).toString('base64');
const VAULT_RE = /(<script type="application\/json" id="td-vault">)([\s\S]*?)(<\/script>)/;

async function keyFor(vault) {
  const base = await c.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
  return c.subtle.deriveKey({ name: 'PBKDF2', salt: b64d(vault.salt), iterations: vault.iter, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function open(html) {
  const m = html.match(VAULT_RE);
  if (!m) throw new Error('no td-vault in page');
  const vault = JSON.parse(m[2]);
  const key = await keyFor(vault);
  const pt = await c.subtle.decrypt({ name: 'AES-GCM', iv: b64d(vault.iv) }, key, b64d(vault.ct));
  return { vault, key, data: JSON.parse(new TextDecoder().decode(pt)), outer: html.replace(VAULT_RE, '$1$3') };
}

// the claude.ai viewer injects a highlighter into the served copy; it is not part of the page
let html = fs.readFileSync(src, 'utf8').replace(/<!--claude-hljs-runtime-begin:\d+-->[\s\S]*?<!--claude-hljs-runtime-end-->\s*/g, '');
const art = await open(html);

// images uploaded in edit mode live in the artifact's asset store (/_blob/<id>); mirror them locally
const have = fs.existsSync(BLOBDIR) ? fs.readdirSync(BLOBDIR) : [];
let need = false;
for (const lang of Object.keys(art.data)) {
  art.data[lang] = art.data[lang].replace(/\/_blob\/([0-9a-f]{32})/g, (all, id) => {
    const f = have.find(n => n.startsWith(id + '.'));
    if (f) return 'img/blob/' + f;
    console.log('NEED ' + id); need = true; return all;
  });
}
if (need) process.exit(2);

if (fs.existsSync(OUT)) {
  try {
    const cur = await open(fs.readFileSync(OUT, 'utf8'));
    if (cur.outer === art.outer && JSON.stringify(cur.data) === JSON.stringify(art.data)) { console.log('UNCHANGED'); process.exit(0); }
  } catch (e) { /* password changed or file unreadable: rewrite */ }
}
const iv = c.getRandomValues(new Uint8Array(12));
const ct = await c.subtle.encrypt({ name: 'AES-GCM', iv }, art.key, new TextEncoder().encode(JSON.stringify(art.data)));
const vault = { ...art.vault, iv: b64e(iv), ct: b64e(ct) };
fs.writeFileSync(OUT, art.outer.replace(VAULT_RE, (m, a, b, z) => a + JSON.stringify(vault) + z));
console.log('CHANGED');
