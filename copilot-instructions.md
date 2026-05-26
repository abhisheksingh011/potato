# Potato — GitHub Copilot Instructions

> This file is read automatically by GitHub Copilot in VS Code.
> It gives Copilot full context about the Potato project so you never have to re-explain it.

## What is this project?

**Potato** is a free, open-source, local-first architecture diagramming tool.
It is a **single HTML file** (`index.html`) — no server, no backend, no login, no npm, no build step.
Think of it as an offline, zero-dependency, AI-friendly architecture diagramming tool.

## Strict rules Copilot must follow

1. **NEVER add npm packages, build tools, frameworks, or bundlers** — this is intentionally zero-dependency vanilla JS
2. **ALL code lives in `index.html`** — one file, keep it that way unless explicitly asked to split
3. **Vanilla ES6+ JavaScript only** — no TypeScript, no JSX, no import/export modules
4. **CSS uses `var(--variable)` system** — never hardcode colors, extend via `:root` in the existing style block
5. **Data model = three arrays**: `nodes[]`, `arrows[]`, `groups[]` — always mutate these then re-render
6. **After any state change always call**: `markDirty()` + relevant render function
7. **Before destructive operations always call**: `pushHistory()` — enables undo/redo
8. **After moving nodes always call**: `redrawArrows()`
9. **After adding/removing nodes**: call `updateStatusBar()` and `updateMinimap()`
10. **User feedback**: use `notify(msg, type)` — never silent failures. type = 'info'|'error'|'warning'

## Data shapes

```javascript
// Node
{ id, x, y, w, h, type, label, sublabel, category, icon, theme, description, zIndex }

// Arrow
{ id, from, to, fromPort, toPort, color, style, label, animated }
// fromPort/toPort: "top" | "bottom" | "left" | "right"
// color: "default"|"green"|"blue"|"purple"|"red"|"teal"|"orange"|"pink"|"yellow"
// style: "solid" | "dashed" | "dotted"

// Group
{ id, x, y, w, h, label, color }

// Theme values for nodes:
// "green"|"orange"|"blue"|"purple"|"red"|"teal"|"pink"|"yellow"|"cyan"|"gray"|"gradient"
```

## Key functions

```javascript
renderNode(node)          // Creates/updates node DOM element
drawArrow(arrow)          // Draws bezier SVG connection
redrawArrows()            // Redraws all arrows
loadDiagramData(data)     // Loads { nodes, arrows, groups } onto canvas
getDiagramData()          // Returns current diagram state
pushHistory()             // Snapshot for undo
addNodeFromComp(comp,x,y) // Adds node from component, auto-fills SERVICE_KB description
notify(msg, type)         // Toast notification
markDirty()               // Marks unsaved changes
fitToContent()            // Zoom/pan to fit all nodes
updateStatusBar()         // Updates node/arrow counts in status bar
updateMinimap()           // Redraws minimap canvas
exportPNG()               // Canvas-based PNG export
exportSVG()               // SVG string export
parseMermaid(src)         // Converts Mermaid syntax → Potato data
importFromAI()            // Parses LLM HTML output → loads diagram
```

## Adding new components to the sidebar

Add to the `COMPONENTS` object in index.html:
```javascript
{ id: 'my-service', name: 'My Service', icon: '🔧', theme: 'blue', type: 'My Service Type', cat: 'Category' }
```
For auto-description on drop, add a matching entry to `SERVICE_KB`:
```javascript
SERVICE_KB['my-service'] = {
  limits: "Limit 1 | Limit 2 | Limit 3",
  justification: "Best for... Use when..."
}
```

## VS Code Extension (potato-vscode/)

Separate package in `potato-vscode/` folder. Embeds Potato in a WebviewPanel.
- `package.json` — extension manifest with commands, keybindings, custom editor
- `src/extension.js` — panel management, file I/O, message bridge
- Bridge script injected into Potato overrides `saveDiagram()` to postMessage to extension
- Extension writes saved files to disk via `fs.writeFileSync`

## Save format

Saved files are HTML with embedded JSON:
```html
<script type="application/json" id="potato-data">
{ "meta": {...}, "nodes": [...], "arrows": [...], "groups": [...] }
</script>
```
Parser looks for `id="potato-data"` — never change this identifier.

## LLM integration

`POTATO_LLM_PROMPT.md` — users copy this into any LLM, describe their architecture,
LLM outputs valid Potato HTML. User pastes into 🤖 AI Import in Potato.
The `importFromAI()` function has a 3-strategy fallback parser and auto-sanitises bad values.

## Tech stack

Pure vanilla JS + HTML5 Canvas (PNG export + minimap) + SVG (arrows) + CSS Variables (theming)
Google Fonts: Space Mono + Syne (loaded from CDN, works offline after first load)
FileReader API (open files) + Blob/URL API (download files) + HTML5 Drag and Drop (sidebar)

## What this project is NOT

- Not a React/Vue/Angular app
- Not a Node.js server
- Not an Electron app (yet — on roadmap)
- Not SaaS — no accounts, no telemetry, no cloud
