// Splices service_kb.json into the SERVICE_KB block in index.html.
// Run this after every quarterly KB refresh: `node _generate_kb.js`
const fs = require('fs');
const path = require('path');

const JSON_FILE = path.join(__dirname, 'service_kb.json');
const HTML_FILE = path.join(__dirname, 'index.html');

const kb = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

// Strip the $-prefixed JSON metadata keys from the runtime object.
const runtimeKB = {};
let metaAsOf = kb.$asOf || null;
for (const [k, v] of Object.entries(kb)) {
  if (k.startsWith('$')) continue;
  runtimeKB[k] = v;
}

// Render as JS source. Keep keys quoted with single quotes for diff stability;
// inline each entry on multiple lines for readability.
function jsString(s) {
  return JSON.stringify(String(s));
}

function renderEntry(key, entry) {
  let out = `  '${key.replace(/'/g, "\\'")}': {\n`;
  if (entry.name)      out += `    name: ${jsString(entry.name)},\n`;
  if (entry.matches)   out += `    matches: ${JSON.stringify(entry.matches)},\n`;
  if (entry.limits)    out += `    limits: ${jsString(entry.limits)},\n`;
  if (entry.whenToUse) out += `    whenToUse: ${jsString(entry.whenToUse)},\n`;
  if (entry.cost)      out += `    cost: ${jsString(entry.cost)},\n`;
  if (entry.pitfalls)  out += `    pitfalls: ${JSON.stringify(entry.pitfalls)},\n`;
  out += '  }';
  return out;
}

let body = '';
body += `// Service Knowledge Base — generated from service_kb.json by _generate_kb.js.\n`;
body += `// To update, edit service_kb.json then run \`node _generate_kb.js\`.\n`;
if (metaAsOf) body += `// Data as of ${metaAsOf}.\n`;
body += `const SERVICE_KB_AS_OF = ${jsString(metaAsOf || '')};\n`;
body += `const SERVICE_KB = {\n`;
body += Object.entries(runtimeKB).map(([k, v]) => renderEntry(k, v)).join(',\n');
body += `\n};`;

// Splice into index.html — find existing SERVICE_KB block and replace.
const html = fs.readFileSync(HTML_FILE, 'utf8');

// Find the start: a comment line about the KB, OR the const SERVICE_KB line.
const startMarker = html.match(/(?:\/\/[^\n]*?Service Knowledge Base[^\n]*\n[\s\S]*?)?const SERVICE_KB = \{/);
if (!startMarker) {
  console.error('Could not find SERVICE_KB block.');
  process.exit(1);
}
const startIdx = startMarker.index;

// Find the matching closing `};` by counting braces from `const SERVICE_KB = {`.
const constIdx = html.indexOf('const SERVICE_KB = {', startIdx);
let depth = 0, i = constIdx, endIdx = -1;
while (i < html.length) {
  const ch = html[i];
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) {
      // include trailing semicolon
      while (i < html.length && html[i] !== ';') i++;
      endIdx = i + 1;
      break;
    }
  }
  i++;
}
if (endIdx < 0) { console.error('Could not find end of SERVICE_KB.'); process.exit(1); }

// Replace from startIdx -> endIdx with the new body.
// But if startIdx points to a prior comment line we left in place, walk it back to the start of that comment block.
let writeStart = startIdx;
// If startIdx isn't at the start of a line, walk to the start.
while (writeStart > 0 && html[writeStart - 1] !== '\n') writeStart--;

const updated = html.slice(0, writeStart) + body + html.slice(endIdx);
fs.writeFileSync(HTML_FILE, updated, 'utf8');

const entryCount = Object.keys(runtimeKB).length;
console.log(`Wrote SERVICE_KB: ${entryCount} entries${metaAsOf ? ' (as of ' + metaAsOf + ')' : ''}.`);
