# Maintainer: GitHub repo settings

Copy-paste these into the GitHub UI when setting up the repo. Takes about 5 minutes total. Improves discoverability by a lot.

---

## 1. About section (top-right on the repo home page)

Click the **⚙️ gear** next to "About" on the repo home page, then paste:

### Description

```
AI-native architecture diagrams with live AWS/Azure/GCP service tooltips, cost estimator, and Play-the-flow narration. Single HTML file, no server, no account.
```

### Website

```
https://abhisheksingh011.github.io/potato/
```
(Or leave blank if you haven't enabled GitHub Pages yet — see step 5 below.)

### Topics

Paste these one at a time into the **Topics** input (no spaces inside a topic; use hyphens):

```
architecture-diagram
aws
azure
gcp
draw-io-alternative
diagramming
single-file
offline-first
local-first
ai-native
llm
cost-estimator
no-build
vanilla-js
html-only
no-account
mit-license
```

### Toggles

- ✅ **Releases** (so v1.0.0 shows on the right rail)
- ✅ **Packages** (off — we don't publish to npm)
- ✅ **Deployments** (off)

---

## 2. Repository settings → General

In **Settings → General**:

- **Default branch**: `main` ✓
- **Features** section, enable:
  - ✅ **Issues**
  - ✅ **Discussions** *(lower-friction than Issues for "is X possible?" — turn this on)*
  - ✅ **Sponsorships** (optional, off by default)
  - ❌ Wikis (the README + docs/ folder cover it)
  - ❌ Projects (overhead for a single-maintainer project)

- **Pull Requests** section:
  - ✅ **Allow squash merging** (default — keeps history clean)
  - ❌ Allow merge commits
  - ❌ Allow rebase merging
  - ✅ Always suggest updating pull request branches
  - ✅ Automatically delete head branches

---

## 3. Releases → Create the v1.0.0 release

In **Releases → Draft a new release**:

### Tag

```
v1.0.0
```
(Create the tag from `main` if it doesn't exist yet.)

### Title

```
v1.0.0 — Potato launches
```

### Release notes

```markdown
First public release.

🥔 What's inside

**Editor**
- Single HTML file (~5800 lines, vanilla JS, zero dependencies)
- 1067 official AWS / Azure / GCP icons drag-and-droppable from the sidebar
- Orthogonal arrow routing with obstacle avoidance
- Groups, swimlanes, multi-select, drag-rect, 60-level undo
- Touch + pen support
- Auto-layout LR / TB, grid snap, fit-to-content

**AI workflow**
- Inline 🤖 AI Import modal — copy prompt, paste into any LLM, paste reply back
- Diagram-aware sanitization: rescues mismatched icon paths from node type
- Sequence Editor for editing the LLM's `playFlow` narration

**Knowledge & cost**
- Service KB: limits, when-to-use, cost formulas, common pitfalls
- 52 services documented, 18 priced
- 💰 Cost Estimator with three workload presets (Small/Medium/Large)
- Quarterly refresh workflow via `service_kb.json` + build script

**Play Flow**
- ▶ Play button walks the diagram step-by-step
- LLM-driven narration shipped with the diagram
- Speed control (🐢 Slow / Normal / 🐇 Fast)
- Saved-HTML viewer is interactive — recipients can hover tooltips and ▶ Play

**Export**
- 💾 Save as self-contained `.potato.html` (interactive viewer included)
- ✦ SVG export with real icons embedded
- Mermaid + JSON import

**Templates**
- 10 ready-made architectures: 3-Tier, Serverless API, AI Agent, RAG Chatbot,
  Microservices, Event-Driven Pipeline, ML Training, Kubernetes App, Data Pipeline,
  + your own recent diagrams

**Project**
- MIT license for code; cloud provider brand terms apply to bundled icons (see NOTICE)
- No telemetry, no account, no server, no internet required after download
- CI on every push: parses the inline script + validates JSON + checks generator drift
```

---

## 4. Pinned items (on your GitHub profile, optional)

If you want Potato to show on your profile, go to your profile → **Customize your pins** → select `potato`.

---

## 5. GitHub Pages (optional — gives Potato a live preview URL)

In **Settings → Pages**:
- **Source**: Deploy from a branch
- **Branch**: `main` / `/ (root)`
- Click **Save**

After 1-2 minutes the page will be live at:
```
https://abhisheksingh011.github.io/potato/
```

That URL renders `index.html` — visitors can try Potato instantly in their browser without cloning. **This is the single biggest boost to first-impression conversion**. Add it to the README hero once it's live.

---

## 6. Social preview (optional but recommended for HN / Twitter / Reddit)

In **Settings → General → Social preview**:
- Upload an image (1280×640 ideal) — should show a Potato diagram with the editor toolbar visible.
- Without this, GitHub uses a generic preview that converts poorly when shared.

---

That's the lot. None of it changes any code in the repo — it just tells GitHub's discovery surfaces what Potato is.
