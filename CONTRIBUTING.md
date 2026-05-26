# Contributing to Potato

Thanks for your interest! Potato is intentionally simple — one HTML file, zero npm dependencies, zero build step. Please respect that constraint when contributing.

## Ground rules

1. **No npm packages, build tools, or frameworks.** All code lives in `index.html` (vanilla ES6+, HTML, CSS).
2. **No TypeScript, JSX, or import/export modules.** Plain `<script>` only.
3. **Single-file editor.** If you find yourself wanting to split files, open an issue first to discuss.
4. **CSS uses `var(--variable)`.** Extend via `:root` — don't hardcode colors.
5. **Three state arrays:** `nodes[]`, `arrows[]`, `groups[]`. Always mutate then re-render.

## Required calls after state changes

- `markDirty()` — after any mutation
- `pushHistory()` — before destructive ops (enables undo/redo)
- `redrawArrows()` — after moving nodes
- `updateStatusBar()` / `updateMinimap()` — after adding/removing nodes
- `notify(msg, type)` — for user feedback, never silent failures

## Security

User-controlled strings (labels, sublabels, descriptions, icons) flow into the DOM via `innerHTML` in some places. **Always wrap with `escHtml()`** when interpolating. AI Import and Mermaid Import both accept arbitrary input — sanitization is non-negotiable.

## How to test

There is no test suite. Manually verify:

1. Drag a component → it appears on canvas
2. Connect two nodes via ports → arrow draws
3. Save → reopen the saved HTML → diagram matches
4. AI Import a sample → diagram loads
5. Undo / redo 60 levels deep
6. Auto-layout LR and TB produce sensible results

For UI changes, open `index.html` in Chrome, Firefox, and Safari. The VS Code extension also needs to be tested separately via F5.

## PR checklist

- [ ] Changes are confined to `index.html` (or `extension.js` for the VS Code wrapper)
- [ ] User strings escaped with `escHtml()`
- [ ] `pushHistory()` called before destructive ops
- [ ] Works in Chrome, Firefox, Safari
- [ ] No regression in Save → Reopen round-trip
- [ ] README updated if a user-visible feature changed

## Ideas welcome

See the roadmap section in `README.md`. Especially wanted:

- Real SVG icon rendering from `icons/` folder
- Dagre-quality auto-layout
- Snap-to-grid + smart guides
- Alignment toolbar (align left/right/top/bottom/distribute)
- Mermaid export
- Templates gallery expansion

## License

By contributing, you agree your work is licensed under the MIT License (see `LICENSE`).
