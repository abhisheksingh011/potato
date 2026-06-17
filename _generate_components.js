// Walks the icons/ directory and rewrites the COMPONENTS object in index.html.
// Run this after adding, removing, or renaming any SVG under icons/:
//   node _generate_components.js
//
// CI verifies that running this script produces no diff — i.e. the committed
// index.html stays in sync with what's actually on disk in icons/.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'icons');
const HTML = path.join(__dirname, 'index.html');

// Prettify: handles slugs and camelCase, including ALLCAPS prefixes like
// "AIMachineLearning" → "AI Machine Learning".
function prettify(slug) {
  let s = String(slug);
  s = s.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  s = s.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  s = s.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  return s;
}

function makeId(provider, cat, name) {
  return (provider + '_' + cat + '_' + name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function themeFor(provider, category) {
  if (provider === 'azure') return 'blue';
  if (provider === 'gcp')   return 'red';
  const cat = category.toLowerCase();
  if (/compute|containers|cloud-financial/.test(cat))       return 'orange';
  if (/storage/.test(cat))                                   return 'green';
  if (/database/.test(cat))                                  return 'blue';
  if (/network|content-delivery/.test(cat))                  return 'purple';
  if (/security|identity/.test(cat))                         return 'red';
  if (/integration|application-integration/.test(cat))       return 'orange';
  if (/management|developer-tools|migration/.test(cat))      return 'teal';
  if (/analytics/.test(cat))                                 return 'cyan';
  if (/ai|machine-learning|artificial/.test(cat))            return 'gradient';
  if (/iot|internet-of-things/.test(cat))                    return 'teal';
  if (/media|games|satellite|robotics|business|customer/.test(cat)) return 'pink';
  if (/quantum|blockchain/.test(cat))                        return 'purple';
  if (/end-user|front-end|web|mobile/.test(cat))             return 'teal';
  if (/general|groups/.test(cat))                            return 'gray';
  return 'blue';
}

function walkProvider(provider) {
  const provDir = path.join(ROOT, provider);
  if (!fs.existsSync(provDir)) return [];
  const cats = [];
  const entries = fs.readdirSync(provDir).sort();
  for (const e of entries) {
    const sub = path.join(provDir, e);
    const stat = fs.statSync(sub);
    if (!stat.isDirectory()) continue;
    const niceCat = prettify(e);
    const items = [];
    for (const f of fs.readdirSync(sub).sort()) {
      if (!f.endsWith('.svg')) continue;
      const baseName = f.replace(/\.svg$/, '');
      const display = prettify(baseName);
      items.push({
        id: makeId(provider, e, baseName),
        name: display,
        icon: '⬜',
        iconUrl: `icons/${provider}/${e}/${f}`,
        theme: themeFor(provider, e),
        type: display,
        cat: niceCat,
      });
    }
    if (items.length) cats.push({ cat: niceCat, items });
  }
  return cats;
}

const COMPONENTS = {
  aws:   walkProvider('aws'),
  azure: walkProvider('azure'),
  gcp:   walkProvider('gcp'),
};

const html = fs.readFileSync(HTML, 'utf8');
// Preserve the shapes: block — it's hand-curated decorative geometry.
// Anchor only against actual provider keys; "cloud" is a legacy alias we
// never wrote and matching it silently would mask a real corruption.
const shapesMatch = html.match(/shapes:\s*\[([\s\S]*?)\r?\n\s*\],\r?\n\s*(aws|azure|gcp):/);
if (!shapesMatch) { console.error('Could not find existing shapes: block to preserve.'); process.exit(1); }
const shapesBlock = '[' + shapesMatch[1] + '\n  ]';

function jsValue(v, indent = '  ') {
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    return '[\n' + v.map(x => indent + '  ' + jsValue(x, indent + '  ')).join(',\n') + '\n' + indent + ']';
  }
  if (typeof v === 'object' && v !== null) {
    const keys = Object.keys(v);
    return '{ ' + keys.map(k => `${k}: ${jsValue(v[k], indent)}`).join(', ') + ' }';
  }
  return JSON.stringify(v);
}

let out = 'const COMPONENTS = {\n';
out += '  shapes: ' + shapesBlock + ',\n';
out += '  aws: ' + jsValue(COMPONENTS.aws, '  ') + ',\n';
out += '  azure: ' + jsValue(COMPONENTS.azure, '  ') + ',\n';
out += '  gcp: ' + jsValue(COMPONENTS.gcp, '  ') + ',\n';
out += '};\n';

// Also inline raw SVG text for every icon, keyed by iconUrl.
// Why: under file:// Chrome the editor can't read these from disk at save
// time (canvas-taint + XHR-to-file blocked), so save would silently produce
// icon-less files. With the SVG text inlined here, the save path can grab
// only the icons the diagram actually uses, base64-encode them, and embed
// them straight into the saved .potato.html — same selective-by-diagram
// behaviour, but it actually works under file://. Adds ~2.7 MB to index.html.
function escSvgForJsString(s) {
  // The SVG text becomes a single-quoted JS string. We need to escape
  // backslashes, single quotes, and any </script sequence (so the inline
  // <script> block can't be terminated by an icon's content). Newlines are
  // turned into spaces — the SVG is whitespace-tolerant and this halves size.
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/<\/(script)/gi, '<\\/$1')
    .replace(/\s+/g, ' ')
    .trim();
}
const allIcons = [];
function gatherSvgs(provider) {
  const provDir = path.join(ROOT, provider);
  if (!fs.existsSync(provDir)) return;
  for (const cat of fs.readdirSync(provDir).sort()) {
    const sub = path.join(provDir, cat);
    if (!fs.statSync(sub).isDirectory()) continue;
    for (const f of fs.readdirSync(sub).sort()) {
      if (!f.endsWith('.svg')) continue;
      const url = `icons/${provider}/${cat}/${f}`;
      const text = fs.readFileSync(path.join(sub, f), 'utf8');
      allIcons.push([url, text]);
    }
  }
}
// 'generic' holds provider-neutral architecture icons. Their COMPONENTS entries
// live in the hand-curated shapes block (preserved above), but their SVG text
// still needs inlining here so saved .potato.html / PNG exports keep the icons
// under file:// where disk reads are blocked.
['aws','azure','gcp','generic'].forEach(gatherSvgs);
out += 'const ICON_SVG_TEXT = {\n';
out += allIcons.map(([url, text]) => `  ${JSON.stringify(url)}: '${escSvgForJsString(text)}'`).join(',\n');
out += '\n};';

const startToken = '// ===== COMPONENT LIBRARY =====';
const startIdx = html.indexOf(startToken);
if (startIdx < 0) { console.error('No COMPONENT LIBRARY marker.'); process.exit(1); }
const startConst = html.indexOf('const COMPONENTS = {', startIdx);
if (startConst < 0) { console.error('No COMPONENTS declaration.'); process.exit(1); }

// Find the end of COMPONENTS (matching closing }; ).
function findBlockEnd(src, startAt) {
  let depth = 0, i = startAt;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        // Look for the trailing `;` within a few characters of the closing
        // brace. If a future edit drops the semicolon, scanning to EOF would
        // silently swallow the rest of the file — bail out instead.
        const limit = Math.min(src.length, i + 8);
        let j = i + 1;
        while (j < limit && src[j] !== ';') {
          if (src[j] !== ' ' && src[j] !== '\t') return i + 1; // hit non-trivial content
          j++;
        }
        return (j < limit && src[j] === ';') ? j + 1 : i + 1;
      }
    }
    i++;
  }
  return -1;
}
let end = findBlockEnd(html, startConst);
if (end < 0) { console.error('No end of COMPONENTS.'); process.exit(1); }

// If a previous run already inlined ICON_SVG_TEXT right after COMPONENTS,
// extend the replacement range so we don't leave a stale duplicate behind.
const trailing = html.slice(end).match(/^\s*const\s+ICON_SVG_TEXT\s*=\s*\{/);
if (trailing) {
  const iconStart = end + trailing[0].length - 1; // position of the opening `{`
  const iconEnd = findBlockEnd(html, iconStart);
  if (iconEnd > 0) end = iconEnd;
}

fs.writeFileSync(HTML, html.slice(0, startConst) + out + html.slice(end), 'utf8');

let total = 0;
for (const k of ['aws','azure','gcp']) for (const c of COMPONENTS[k]) total += c.items.length;
console.log(`Wrote COMPONENTS: ${total} icons. aws(${COMPONENTS.aws.length}) azure(${COMPONENTS.azure.length}) gcp(${COMPONENTS.gcp.length}) categories.`);
