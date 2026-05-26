# 🥔 Potato — Complete Project Context for GitHub Copilot

This file is the **single source of truth** for the Potato project.
Paste this into GitHub Copilot Chat in VS Code before asking anything about this project.

---

## WHAT IS POTATO?

Potato is a **free, open-source, local-first architecture diagramming tool**.
It is a single HTML file (`index.html`) — no server, no backend, no login, no fees.
It runs entirely in the browser. Everything is vanilla JavaScript, HTML, CSS.
Zero npm dependencies, zero build step, zero frameworks. Fonts are pulled from the
operating system (no Google Fonts / no CDN), so the editor is truly offline-first.

It is an architecture diagramming tool for developers who want:
- Full offline capability
- No subscription
- AI-assisted diagram generation via any LLM
- Self-hostable / embeddable anywhere
- VS Code integration

---

## PROJECT STRUCTURE

```
potato/                          ← Main repo (publish this to GitHub)
├── index.html                   ← THE ENTIRE TOOL (3800+ lines, single file)
├── README.md                    ← GitHub readme
├── LICENSE                      ← MIT
├── CONTRIBUTING.md              ← Contribution guide
├── POTATO_LLM_PROMPT.md         ← Prompt users copy into ChatGPT/Claude/Gemini
├── .gitignore
└── icons/
    ├── README.md                ← How to add custom SVG icons
    ├── aws/                     ← Drop AWS SVG icons here
    ├── azure/
    ├── gcp/
    ├── network/
    ├── general/
    ├── database/
    └── security/

potato-vscode/                   ← VS Code Extension (publish to VS Marketplace)
├── package.json                 ← Extension manifest
├── src/
│   └── extension.js             ← Full extension logic
├── .vscode/
│   └── launch.json              ← F5 to debug
└── README.md
```

---

## CORE ARCHITECTURE — index.html

The entire tool lives in one HTML file. Key sections (marked with `// =====` comments):

### Data Model

```javascript
// Three global arrays — the entire diagram state
let nodes  = [];   // visual boxes/components
let arrows = [];   // connections between nodes
let groups = [];   // swimlane / container rectangles

// Node shape:
{
  id: "n_abc123",          // unique string
  x: 100, y: 200,          // canvas position in pixels
  w: 160, h: null,         // width (fixed), height (auto = null)
  type: "AWS Lambda",      // service/component type label
  label: "Auth Function",  // main display name
  sublabel: "auth-fn-prod",// secondary line (ARN, env, etc)
  category: "Compute",     // used in props panel
  icon: "⚡",              // emoji icon
  theme: "orange",         // color theme (see THEMES below)
  description: "...",      // shows as hover tooltip
  zIndex: 10               // stacking order
}

// Arrow shape:
{
  id: "a_abc123",
  from: "n_1",             // source node id
  to: "n_2",               // target node id
  fromPort: "right",       // "top" | "bottom" | "left" | "right"
  toPort: "left",
  color: "blue",           // see ARROW COLORS below
  style: "solid",          // "solid" | "dashed" | "dotted"
  label: "HTTPS",          // short label on the arrow
  animated: false          // true = flowing dash animation
}

// Group shape:
{
  id: "g_abc123",
  x: 40, y: 40,
  w: 400, h: 300,
  label: "VPC / Private Subnet",
  color: "purple"
}
```

### Valid Theme Values (nodes)
`green` `orange` `blue` `purple` `red` `teal` `pink` `yellow` `cyan` `gray` `gradient`

### Valid Arrow Colors
`default` `green` `blue` `purple` `red` `teal` `orange` `pink` `yellow`

### Valid Port Values
`top` `bottom` `left` `right`

---

## KEY FUNCTIONS IN index.html

```javascript
// Rendering
renderNode(node)              // Creates/updates DOM element for a node
renderGroup(grp)              // Creates/updates DOM element for a group
drawArrow(arrow)              // Draws bezier SVG path for a connection
redrawArrows()                // Redraws all arrows (call after node moves)

// State
addNodeFromComp(comp, x, y)   // Adds node from sidebar component, auto-fills description
loadDiagramData(data)         // Loads {nodes, arrows, groups} into canvas
getDiagramData()              // Returns current {nodes, arrows, groups, meta}
pushHistory()                 // Snapshot current state for undo
undo() / redo()               // 60-level undo/redo stack

// Tools
setTool('select'|'pan'|'text')
zoomIn() / zoomOut() / zoomReset() / fitToContent()
selectNode(id) / clearSelection() / deleteSelected()
duplicateNode(id) / copySelected() / pasteNodes()

// Export
saveDiagram()    // Saves as self-contained HTML (Ctrl+S)
exportPNG()      // Renders to Canvas and downloads PNG (2x retina)
exportSVG()      // Generates SVG and downloads

// Import
showPasteModal()       // Opens AI Import modal (paste LLM HTML output)
showMermaidModal()     // Opens Mermaid/JSON import modal
importFromAI()         // Parses and loads LLM-generated HTML
parseMermaid(src)      // Converts Mermaid syntax → Potato data object

// UI
notify(msg, type)      // Shows toast notification ('info'|'error'|'warning')
updatePropsPanel()     // Refreshes right-side properties panel
updateMinimap()        // Redraws the minimap canvas
showContextMenu(e, id) // Right-click context menu
```

---

## SERVICE KNOWLEDGE BASE (SERVICE_KB)

Every component in the sidebar has a pre-built description that auto-fills when dragged onto canvas.
The knowledge base is the `SERVICE_KB` object in index.html.

Format:
```javascript
SERVICE_KB = {
  'lambda': {
    limits: "Max execution: 15 min | Memory: 128 MB–10 GB | ...",
    justification: "Best for short-lived event-driven tasks..."
  },
  // ... 40+ services covered
}
```

Covered services: lambda, ec2, ecs, eks, fargate, batch, s3, ebs, efs, glacier, rds, dynamo,
elasticache, aurora, redshift, vpc, alb, cloudfront, route53, apigateway, waf, bedrock, sagemaker,
rekognition, textract, comprehend, iam, cognito, kms, secrets, shield, sqs, sns, eventbridge,
stepfunctions, kinesis, cloudwatch, xray, agentcore, az-func, az-cosmos, az-blob, gcf, bq,
router, firewall, server, cylinder, queue, lb, cache, k8s

---

## COMPONENT LIBRARY (COMPONENTS object)

The sidebar is built from the `COMPONENTS` object. Structure:

```javascript
COMPONENTS = {
  shapes: [ { cat: 'Basic Shapes', items: [...] }, ... ],
  aws:    [ { cat: 'Compute',      items: [...] }, ... ],
  cloud:  [ { cat: 'Azure',        items: [...] }, ... ],
  net:    [ { cat: 'Network',      items: [...] }, ... ],
}

// Each item:
{ id: 'lambda', name: 'Lambda', icon: '⚡', theme: 'orange', type: 'AWS Lambda', cat: 'Compute' }
```

To add a new component: add an entry to the relevant array. The `id` must match a key in `SERVICE_KB` for auto-description to work.

---

## SAVE FORMAT

When you click "Save HTML", it produces a self-contained HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>NAME — Potato</title></head>
<body>
<!-- Potato Saved Diagram -->
<script type="application/json" id="potato-data">
{
  "meta": { "version": "1.0", "name": "...", "created": "ISO date" },
  "nodes": [...],
  "arrows": [...],
  "groups": [...]
}
</script>
</body>
</html>
```

To re-open: Potato → 📂 Open → select the file. The parser looks for `id="potato-data"`.

---

## LLM INTEGRATION

File: `POTATO_LLM_PROMPT.md`

Users copy this prompt into ANY LLM (ChatGPT, Claude, Gemini, Mistral, Grok, Ollama, etc).
They describe their architecture in plain English.
The LLM outputs a valid Potato HTML file.
User pastes it into Potato → 🤖 AI Import.

The AI Import parser (`importFromAI()`) handles:
- Full Potato HTML (looks for `id="potato-data"`)
- Raw JSON `{ nodes, arrows, groups }`
- Malformed/partial output (3-strategy fallback parser)
- Auto-sanitises invalid themes, ports, colors to valid values

---

## VS CODE EXTENSION

Folder: `potato-vscode/`

The extension embeds Potato inside a VS Code Webview panel.

**How it works:**
1. User runs command or clicks status bar button
2. Extension opens a WebviewPanel
3. Panel loads `potato/index.html` as HTML content
4. A bridge script is injected that overrides `saveDiagram()` to postMessage back to extension
5. Extension receives the save message and writes the file to disk

**Key files:**
- `package.json` — contributes commands, keybindings, custom editor, status bar
- `src/extension.js` — all logic: panel management, file read/write, message bridge

**Commands contributed:**
- `potato.openEditor` — new blank diagram
- `potato.newDiagram` — same
- `potato.openFile` — open existing HTML file in Potato

**Setup for users:**
The extension bundles `index.html` next to `extension.js`. After installing the
extension, no manual copy step is required — the runtime looks for `index.html`
in the extension root, falling back to `potato/index.html`.

**For local development:**
```bash
cd potato-vscode
# index.html and extension.js sit at the root; F5 in VS Code launches the host.
```

**To publish:**
```bash
cd potato-vscode
npm install @vscode/vsce
npx vsce package          # creates .vsix — be sure index.html is included by .vscodeignore
npx vsce publish          # publishes to marketplace (needs PAT)
```

---

## KEYBOARD SHORTCUTS (built into index.html)

| Key | Action |
|-----|--------|
| Ctrl+S | Save as HTML |
| Ctrl+Z / Ctrl+Y | Undo / Redo |
| Ctrl+C / Ctrl+V | Copy / Paste nodes |
| Ctrl+A | Select all |
| Delete | Delete selected |
| S | Select tool |
| H | Pan tool |
| T | Text/label tool |
| G | Add group |
| + / - | Zoom in / out |
| 0 | Zoom reset |
| F | Fit to content |
| Arrow keys | Nudge 1px (Shift = 10px) |
| Escape | Clear selection |
| Double-click node text | Inline edit |
| Double-click arrow | Edit label |
| Drag port dot | Draw connection |
| Right-click | Context menu |
| Alt+drag or Middle mouse | Pan canvas |
| Mouse wheel | Zoom |

---

## TECHNOLOGY STACK

- **Zero dependencies** — pure vanilla JS, HTML5, CSS3
- **Canvas API** — used for PNG export and minimap
- **SVG** — arrows/connections layer
- **CSS Variables** — theming system
- **LocalStorage/SessionStorage** — sessionStorage used to pass diagram between saved HTML and editor
- **HTML5 Drag and Drop API** — sidebar drag to canvas
- **Blob/URL API** — file downloads (save HTML, export PNG/SVG)
- **FileReader API** — opening saved HTML files
- Google Fonts: `Space Mono` (monospace labels) + `Syne` (UI font)

---

## WHAT COPILOT SHOULD KNOW

1. **Never suggest adding npm packages or build tools** — this is intentionally zero-dependency
2. **All code goes in index.html** — one file, keep it that way
3. **JS is vanilla ES6+** — no TypeScript, no JSX, no modules
4. **CSS uses variables** — extend via `:root` vars, don't hardcode colors
5. **The data model is three arrays** — nodes, arrows, groups — always manipulate these then re-render
6. **Always call `markDirty()`** after state changes
7. **Always call `pushHistory()`** before destructive operations (for undo support)
8. **Always call `redrawArrows()`** after moving nodes
9. **Always call `updateStatusBar()`** after adding/removing nodes or arrows
10. **Notify the user** — use `notify(msg)` for feedback, never silent failures
11. **The VS Code extension** is in `potato-vscode/` and is a separate publishable package

---

## ROADMAP / PLANNED FEATURES

- [ ] Templates gallery (10 pre-built architecture diagrams)
- [ ] PNG export via html2canvas (for better text rendering)
- [ ] Snap to grid
- [ ] Auto-routing arrows (avoid node overlaps)
- [ ] Mermaid export (Potato → Mermaid syntax)
- [ ] Share via URL (diagram JSON in URL hash, no backend)
- [ ] Real-time collaboration (WebRTC)
- [ ] Light mode theme
- [ ] Confluence/Notion embed plugin
- [ ] GitHub Action (auto-generate diagrams from IaC)
- [ ] `potato.json` spec file
- [ ] `npm install -g potato-diagram` CLI

---

## GITHUB SETUP COMMANDS

```bash
# Publish the main tool
cd potato
git init
git add .
git commit -m "🥔 Initial release — Potato v1.0"
gh repo create potato --public --description "Free local architecture diagram tool — no login, no fees, single HTML file"
git push -u origin main

# Add GitHub topics (do this in the repo settings UI):
# diagram, architecture, aws, draw-io-alternative, local-first, open-source,
# no-login, offline, single-file, html, vanilla-js

# Publish the VS Code extension separately
cd ../potato-vscode
npm install
npx vsce package
npx vsce publish
```

---

## EXAMPLE COPILOT PROMPTS TO USE WITH THIS CONTEXT

After loading this file as context in Copilot:

- *"Add a templates gallery button that shows 10 pre-built AWS architecture diagrams"*
- *"Add snap-to-grid functionality with a toggle button in the toolbar"*
- *"Add a share-via-URL feature that compresses the diagram JSON into a URL hash"*
- *"Add Azure DevOps as a new component category in the sidebar"*
- *"Add Terraform/CloudFormation HCL import — parse resource blocks into Potato nodes"*
- *"Fix the PNG export to render node icons (emoji) correctly on all platforms"*
- *"Add a light mode theme toggle"*
- *"Add an alignment toolbar — align selected nodes left/right/top/bottom/center"*
- *"Add Kubernetes component icons to the network tab"*
- *"Add export to Mermaid syntax (Potato diagram → mermaid flowchart code)"*
