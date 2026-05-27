# Contributing to Potato

Thanks for your interest! Potato is intentionally simple — one HTML file you can double-click, zero npm dependencies at runtime, zero build step *required*. There are a couple of tiny helper scripts (under 100 lines each) that splice generated data into `index.html`, but they're optional and run in Node when you change source data.

## Ground rules

1. **No npm packages at runtime.** Browser code in `index.html` stays vanilla ES6+, HTML, and CSS. No React, no Vue, no TypeScript, no JSX, no import/export modules.
2. **No bundler.** Plain `<script>` only. The whole editor must work by double-clicking the HTML file from a filesystem (`file://`), so no `fetch()` of local files.
3. **CSS uses `var(--variable)`.** Extend via `:root` — don't hardcode colors.
4. **Four state arrays:** `nodes[]`, `arrows[]`, `groups[]`, `playFlow[]`. Always mutate then re-render.
5. **System fonts only.** No Google Fonts, no CDN. The offline-first promise depends on this.

## File layout

```
index.html                — the editor (single file, ~5800 lines)
service_kb.json           — source of truth for tooltips + Cost Estimator
_generate_kb.js           — splices service_kb.json into index.html
_generate_components.js   — splices the icons/ tree into COMPONENTS[] in index.html
icons/<provider>/<cat>/   — 1067 cloud SVGs (do not modify in-place; replace via the regen workflow)
POTATO_LLM_PROMPT.md      — canonical LLM prompt (kept in sync with the inlined POTATO_LLM_PROMPT_TEXT in index.html)
extension.js              — VS Code extension entry point
```

## Editing data (when to run which script)

| You edited… | Run this before committing |
|---|---|
| `service_kb.json` (added a service, updated pricing, bumped `$asOf`) | `node _generate_kb.js` |
| Anything inside `icons/` (added, removed, renamed an SVG) | `node _generate_components.js` |
| Only `index.html` directly | nothing |

The CI (`.github/workflows/check.yml`) runs both generators and fails if `index.html` would change — so if you forget, CI catches it.

## Required calls after state changes in the editor

When writing new editor features that mutate state, follow the existing discipline:

- `markDirty()` — after any mutation
- `pushHistory()` — **before** destructive ops (enables undo/redo); also include in feature workflows where users would expect undo to roll back the whole sequence
- `redrawArrows()` — after moving or resizing nodes
- `updateStatusBar()` / `updateMinimap()` — after adding or removing nodes
- `notify(msg, type)` — for user feedback. Never fail silently. `type` is `'info'` (default), `'warning'`, or `'error'`.

## Security

User-controlled strings (labels, sublabels, descriptions, icons, playFlow narration text) flow into the DOM via `innerHTML` in several places. **Always wrap with `escHtml()`** when interpolating into a template literal that becomes innerHTML or an SVG attribute. AI Import, Mermaid Import, and the Sequence Editor all accept arbitrary input — sanitization is non-negotiable.

When emitting JSON into a `<script type="application/json">` island (saved HTML, copy LLM prompt), also escape `</script` sequences:
```js
JSON.stringify(data, null, 2).replace(/<\/scr(ipt)/gi, '<\\/scr$1');
```
Without that, a label like `</script><script>alert(1)</script>` will break the saved file's JSON island.

## How to test

There is no automated test suite (yet). Manually verify the path your change affects:

1. **Drag + connect**: drag a component from the sidebar → it appears on canvas → connect two nodes via ports → arrow draws orthogonally without going through other boxes.
2. **Save → reopen**: save the diagram → reopen the saved HTML → diagram matches → ▶ Play in the saved viewer animates the flow.
3. **AI Import**: paste a sample LLM HTML response → diagram loads → no console errors → toast shows any sanitization rescues.
4. **Undo / redo** 30+ steps deep, including across drag, delete, paste, sequence-edit.
5. **Auto-layout LR and TB** produce sensible results on a diagram with at least 8 nodes.
6. **PNG and SVG export** include the real icons (not the emoji fallback) when the source diagram uses cloud nodes.
7. **Cost Estimator** opens, switches between Small/Medium/Large, shows a per-service breakdown and a total.

For UI changes, open `index.html` in Chrome, Firefox, and Safari. The VS Code extension also needs testing separately via F5.

## PR checklist

- [ ] Changes are confined to `index.html`, `service_kb.json`, `icons/`, the build scripts, or `extension.js`
- [ ] Generators have been re-run if their source files changed (CI will check)
- [ ] User strings escaped with `escHtml()` everywhere they touch innerHTML / SVG attributes
- [ ] `pushHistory()` called before destructive ops
- [ ] No regression in **Save → Reopen** round-trip
- [ ] Works in Chrome and Firefox (and Safari if you have one)
- [ ] No new web fonts, CDN links, or `fetch()` calls of local files
- [ ] README + CONTRIBUTING + LLM prompt updated if a user-facing feature changed

## PR ideas welcome

These are openings, not promises. If any of these excite you, open an issue first to discuss the approach:

- **GitHub Action** that renders `.potato.html` files into PR comments (would close the loop on architecture-as-code reviews)
- **CLI**: `npx potato render diagram.potato.html --png out.png` so CI pipelines can produce images
- **Architecture validator**: rules engine that walks the diagram and flags suspicious patterns ("RDS in public subnet", "Lambda with no inbound arrow", "Missing CloudWatch on critical services"). Could be driven by SERVICE_KB-style entries.
- **More services with `costEstimate`** in `service_kb.json` — currently 18 priced out of 52 documented out of ~1067 icons. Each new service is one JSON edit + a regen.
- **More templates** in the gallery (we have 10; a "Microservices on K8s with Istio" or "Event-Sourcing CQRS" or "Serverless Data Lake" would be welcomed).
- **Light theme** — add a `theme` toggle in the toolbar that flips the CSS variables in `:root`.
- **Mermaid export** — Potato imports Mermaid; closing the loop is a small lift.
- **Real SVG inlining in saved HTML** instead of the current base64 PNG raster (better-looking exports at the cost of larger files).
- **Smart guides + snap-to-alignment** when dragging (Figma-style dashed lines when a node lines up with another's edge or center).
- **Diff view** between two diagrams (added/removed/changed nodes highlighted).
- **Internationalization** — strings are currently English-only; a JSON dictionary + `t()` helper would unlock translation PRs.

## Maintainer-only: GitHub repo settings

If you're the maintainer and just forked or created the repo, see [`docs/repo-settings.md`](docs/repo-settings.md) for the description, topics, and About-section text to paste into the GitHub UI.

## License

By contributing, you agree your work is licensed under the MIT License (see `LICENSE`).
Third-party icons under `icons/` remain subject to their respective providers' brand guidelines — see [`NOTICE`](NOTICE).
