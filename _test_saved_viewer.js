// Smoke-test that the saved-viewer inline script in buildSavedHTML parses
// cleanly after the template literal is evaluated. Guards against the
// "\n inside template literal becomes a real newline → unterminated string
// in saved JS" class of bug. Run manually: node _test_saved_viewer.js
const fs = require('fs');

const h = fs.readFileSync('index.html', 'utf8');
const start = h.indexOf('function buildSavedHTML');
if (start < 0) { console.error('buildSavedHTML not found'); process.exit(1); }

const retIdx = h.indexOf('return `', start);
if (retIdx < 0) { console.error('return ` not found'); process.exit(1); }

// Walk past the opening backtick to find the matching closing backtick,
// respecting backslash escapes.
let i = retIdx + 8;
while (i < h.length) {
  const ch = h.charCodeAt(i);
  if (ch === 92) { i += 2; continue; }  // backslash
  if (ch === 96) break;                  // closing backtick
  i++;
}
const tmpl = h.slice(retIdx + 8, i);

// Stub the four interpolations.
const filled = tmpl
  .replace(/\$\{escHtml\(name\)\}/g, 'TestDiagram')
  .replace(/\$\{dataStr\}/g, '{"nodes":[],"arrows":[],"groups":[],"playFlow":[]}')
  .replace(/\$\{viewerPayload\}/g, '{"kb":{},"asOf":"2026-Q2"}')
  .replace(/\$\{svgMarkup\}/g, '<svg></svg>');

// Now evaluate any remaining \ escape sequences the way the JS engine
// would when the template literal is actually evaluated at runtime.
// This is what the editor's `return \`...\`` produces.
let evaluated;
try {
  evaluated = new Function('return `' + filled.replace(/`/g, '\\`') + '`')();
} catch (e) {
  console.error('Template eval failure:', e.message);
  process.exit(1);
}

// Extract the inline viewer script — the IIFE-wrapped one.
const m = evaluated.match(/<script>\s*\n\(function[\s\S]+?<\/script>/);
if (!m) { console.error('Could not find viewer script block'); process.exit(1); }
const inner = m[0].replace(/^<script>/, '').replace(/<\/script>\s*$/, '');
try {
  new Function(inner);
  console.log('Saved-viewer script parses OK -', inner.split('\n').length, 'lines');
} catch (e) {
  console.error('Parse error:', e.message);
  const lineMatch = /line (\d+)/.exec(e.message);
  if (lineMatch) {
    const ln = parseInt(lineMatch[1], 10);
    const lines = inner.split('\n');
    for (let k = Math.max(0, ln - 3); k < Math.min(lines.length, ln + 3); k++) {
      console.error('  ' + (k + 1) + ': ' + lines[k]);
    }
  }
  process.exit(1);
}
