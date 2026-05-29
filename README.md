<div align="center">

# 🥔 Potato

**Architecture diagrams that live in your git repo.**

*Drag-and-drop AWS / Azure / GCP icons, or describe the system to any LLM and paste the reply. Edit in VS Code. Share as a single self-contained HTML file. No account, no subscription, no internet.*

[![MIT License](https://img.shields.io/badge/license-MIT-1abc9c)](LICENSE)
[![Single file](https://img.shields.io/badge/runtime-1%20html%20file-7B2FBE)](index.html)
[![Real icons](https://img.shields.io/badge/icons-1067%20AWS%20%2F%20Azure%20%2F%20GCP-FF9900)](icons/)
[![Zero deps](https://img.shields.io/badge/dependencies-zero-2E86C1)](#tech-stack)
[![VS Code](https://img.shields.io/badge/VS%20Code-extension-007ACC)](extension.js)

</div>

---

## ⚡ Try it in 10 seconds

**Live demo** — open the editor in your browser, no install: *[demo coming with GitHub Pages — see [docs/repo-settings.md](docs/repo-settings.md)]*

**Local** — download or clone, then double-click `index.html`:

```bash
git clone https://github.com/abhisheksingh011/potato.git
# macOS:   open potato/index.html
# Linux:   xdg-open potato/index.html
# Windows: start potato\index.html
```

That's the whole install. One file, no build, runs from `file://`.

---

## 🎯 What Potato does that nothing else does

| | Potato |
|---|---|
| 🤖 **Plain-English → diagram** | Paste the [Potato LLM prompt](POTATO_LLM_PROMPT.md) into ChatGPT / Claude / Gemini / Copilot Chat. Describe your system. Paste the reply into 🤖 AI Import. Get a real, editable architecture. |
| 💰 **Cost estimator built in** | Hover any AWS / Azure / GCP node to see real pricing formulas. Click `💰 Cost` to total the diagram at Small / Medium / Large workloads. |
| 📋 **Service knowledge in tooltips** | Lambda's 15-min cap, DynamoDB's 400 KB item limit, RDS connection ceilings — every cloud node carries SLA, limits, when-to-use guidance, and common pitfalls one hover away. |
| ▶ **Play the flow** | Click ▶ Play and watch your architecture explain itself, step-by-step, with the LLM-written narration that ships inside the file. |
| 🪣 **1067 official icons** | AWS / Azure / GCP, searchable, drag-and-drop. The real artwork the cloud vendors ship — not stylised reproductions. |
| 📤 **Shareable as a single file** | Save → email → recipient double-clicks → interactive viewer in any browser. Hovers icons. Plays the flow. Sees costs. No Potato install needed. |
| 🧩 **VS Code custom editor** | Double-click any `*.potato.html` in the explorer — opens directly in the Potato editor. `Ctrl+S` saves through VS Code's text model so `git diff`, Revert, and split-editor views all stay in sync. |

> No account. No telemetry. No subscription. No internet after the initial download.

---

## 🎬 The headline workflow

```text
┌─────────────────────────────────────────────────────────────────┐
│  1. Click 🤖 AI Import                                          │
│  2. Copy the Potato prompt → paste into ChatGPT / Claude / etc. │
│  3. Describe your architecture in plain English                 │
│  4. Paste the LLM's HTML reply back                             │
│  5. Edit visually, hit ▶ Play, click 💰 Cost                    │
│  6. Ctrl+S → committed as architecture.potato.html              │
└─────────────────────────────────────────────────────────────────┘
```

**A real prompt that works**:

> *"Show a RAG chatbot on AWS: S3 docs → embedding Lambda → OpenSearch vector index → API Gateway → Bedrock with Claude. Add CloudWatch on each Lambda."*

Result: 7 real AWS-iconed nodes, color-themed by service family, a `playFlow` narration that walks the request lifecycle end-to-end, and a cost panel ready to inspect.

---

## 🆚 vs. the alternatives

| | **Potato** | draw.io | Excalidraw | Mermaid | Lucidchart |
|---|---|---|---|---|---|
| Single offline HTML file | ✅ | ❌ | ❌ | ❌ | ❌ |
| 1067 official AWS/Azure/GCP icons built-in | ✅ | ⚠️ download | ❌ | ❌ | ✅ paid |
| Cost estimator | ✅ | ❌ | ❌ | ❌ | ❌ |
| Service-limit / SLA tooltips | ✅ | ❌ | ❌ | ❌ | ❌ |
| LLM-native import (any model) | ✅ | ❌ | ❌ | ⚠️ syntax | ❌ |
| Animated play-the-flow with narration | ✅ | ❌ | ❌ | ❌ | ❌ |
| Save → recipient interacts in browser | ✅ | ❌ | ❌ | ❌ | ❌ |
| Lives in `git diff` next to your code | ✅ HTML | ⚠️ XML | ⚠️ JSON | ✅ MD | ❌ |
| VS Code custom editor | ✅ | ❌ | ❌ | ⚠️ preview | ❌ |
| Account / login required | ❌ | ❌ | ❌ | ❌ | ✅ |
| Pricing | **Free** | Free | Free | Free | $$$ |

---

## 📚 10 templates to start from

Open `✨ Templates` in the toolbar and pick:

| Template | What you get |
|---|---|
| **3-Tier Web App** | User → CDN → ALB → ECS → RDS + worker + SQS |
| **Serverless API** | API Gateway → Lambdas → DynamoDB + Cognito + EventBridge |
| **AI Agent Architecture** | Supervisor + sub-agents on Bedrock with memory + tools |
| **RAG Chatbot** | Embedding pipeline + vector DB + Bedrock RAG |
| **Microservices** | API Gateway + 3 services with per-service DBs + event bus |
| **Event-Driven Pipeline** | SNS fans out to 3 SQS queues, each driving a Lambda |
| **ML Training Pipeline** | S3 → SageMaker → Model Registry → real-time + batch inference |
| **Data Pipeline** | S3 → Lambda → Kinesis → Redshift + monitoring |
| **Kubernetes App** | Ingress → 2 deployments → Redis + Postgres statefulsets |
| **Multi-Region Active-Active (AWS)** | Two regions live + serving. ECS on Spot, DDB Global Tables, S3 CRR, KMS multi-region keys, ECR replicated. Includes Play Flow narration of one request + failover. |
| **+ your own** | Save any diagram and it shows up under "Recent" |

---

## 🚀 Features at a glance

**Diagramming**
- 1067 real AWS / Azure / GCP icons + emoji shapes
- Orthogonal arrows that route around obstacles
- Animated / dashed / dotted arrow styles, 9 colors
- Groups / swimlanes for VPCs, subnets, service boundaries
- Auto-layout (LR / TB), grid snap, fit-to-content
- Touch + pen support on iPad / tablets
- **Dark + light themes** with visible group borders in both

**AI workflow**
- Inline LLM prompt — one click to copy, no GitHub round-trip
- `🤖 AI Import` validates + sanitizes + rescues icon paths the LLM guessed wrong
- `playFlow` narration ships inside the diagram; ▶ Play walks through it on-screen
- Sequence Editor to reorder, edit, or rewrite the narration — and **⬇ download the whole walkthrough as a Markdown workflow** (numbered steps + narration) for docs, runbooks, or a PR
- Prompt asks the LLM for detailed, walkthrough-style narration — full service names, the trigger/data/why of each hop, and the complete lifecycle end-to-end
- Works with **GitHub Copilot Chat** out of the box — just reference [`POTATO_LLM_PROMPT.md`](POTATO_LLM_PROMPT.md)

**Knowledge**
- Service KB with **SLA, limits, when-to-use, cost formulas, and pitfalls** for 52 services
- Hover or open the Properties panel — same data, with the as-of date footnote
- Quarterly refresh via one JSON file (`service_kb.json`) + a build script

**Cost Estimator** (`💰 Cost` toolbar button)
- Three workload presets (Small / Medium / Large)
- Per-service breakdown grouped by service type, monthly subtotal each
- Auto-sum total with coverage indicator ("14 of 17 services priced")
- Honest about what's not modelled (egress, NAT gateway, support plans)

**Export & share**
- `💾 Save` → self-contained `.potato.html` (~10–60 KB). Reopens in Potato to edit, double-clicks to view standalone.
- The saved-HTML viewer is **interactive** — hover for tooltips, ▶ Play the flow, switch dark/light theme, no editor required.
- `⬇ Download workflow` (in the Sequence Editor) → exports the ordered steps + narration as a Markdown file, ready to paste into docs or a PR.

**Import**
- AI Import (LLM HTML or raw JSON)
- Mermaid (`flowchart`, `graph`, `sequenceDiagram`)
- Potato JSON

**Quality of life**
- 60-level undo / redo, copy / paste (preserves arrow connections)
- Multi-select, drag-rect, arrow-key nudge, shift-nudge x10
- Auto-save to localStorage + per-tab crash recovery
- Recent diagrams (last 8) in the Templates modal
- **VS Code custom editor** with proper file model sync (works with Revert, `git checkout`, split views)

---

## 🧩 VS Code extension

Edit `.potato.html` files in VS Code as if they were code.

```bash
# package the extension locally:
npm install -g @vscode/vsce
vsce package                              # → potato-diagram-1.0.0.vsix
code --install-extension potato-diagram-1.0.0.vsix
```

What you get:
- **Double-click any `*.potato.html`** in the file explorer → opens in the Potato editor
- `Ctrl+Alt+D` (or `Cmd+Alt+D`) → new blank diagram
- Status-bar button: `🥔 Potato`
- Right-click any `.html` → `🥔 Open in Potato Editor`
- `Ctrl+S` saves through VS Code's text document model — `git diff`, Revert, and external file changes (git pull, another editor) all stay in sync with the canvas.

See [`extension.js`](extension.js) for the implementation.

---

## ⌨️ Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+S` | Save |
| `Ctrl+Z` / `Ctrl+Y` | Undo / Redo |
| `Ctrl+C` / `Ctrl+V` | Copy / Paste (preserves connections) |
| `Ctrl+A` | Select all |
| `Delete` | Delete selected |
| `Space` | ▶ Play / ⏹ stop the flow animation |
| `S` / `H` / `T` / `G` | Select / Pan / Text / Group tool |
| `+` / `-` / `0` / `F` | Zoom in / out / reset / fit |
| `Arrow keys` | Nudge 1 px (Shift = 10 px) |
| `Escape` | Clear selection · stop playback · close modals |

---

## 🧠 Service Knowledge Base

Every cloud node carries five fields you can edit, refresh quarterly, or extend:

```json
{
  "lambda": {
    "name":      "AWS Lambda",
    "sla":       "99.95% monthly uptime",
    "limits":    "Max execution: 15 min | Memory: 128 MB–10 GB | …",
    "whenToUse": "Best for short-lived, event-driven tasks. Scales to zero.",
    "cost":      "$0.20/M requests + $0.0000166/GB-s. Free tier: 1M req…",
    "pitfalls":  ["VPC cold starts add 1–5 s — keep Lambda outside VPC…", "…"]
  }
}
```

Surfaced in:
- Hover tooltip on the canvas
- Properties panel when a node is selected
- Cost Estimator breakdown
- The standalone saved-HTML viewer

Add new entries to [`service_kb.json`](service_kb.json), run `node _generate_kb.js`, commit. That's the entire workflow.

---

## 🤖 AI workflow in detail

1. **Click 🤖 AI Import** — modal walks you through 3 steps.
2. **Step 1**: ▶ Copy the Potato prompt. It explains the JSON schema, the 1067 icon paths, layout rules, theme conventions, and the `playFlow` narration format.
3. **Step 2**: Paste into your LLM (ChatGPT / Claude / Gemini / Copilot / Mistral / Llama / Grok — anything that returns HTML). Describe your architecture in plain English.
4. **Step 3**: Paste the LLM's full HTML reply (or save it as `my-diagram.potato.html` and open via `📂 Open`). Click ⬇️ Import.

Potato will:
- Validate every node, arrow, group, and `playFlow` step
- Rescue mismatched icon paths from the node's `type` field (LLMs guess paths wrong sometimes)
- Show a sanitization toast: *"🔧 3 icon paths didn't match our catalog — rescued from node type."*
- Drop you straight on the editable canvas

The prompt lives in [`POTATO_LLM_PROMPT.md`](POTATO_LLM_PROMPT.md) if you want to read it, fork it, or feed it to Copilot Chat.

### Use Potato from inside GitHub Copilot Chat

In any project, ask Copilot:

```
Read #file:POTATO_LLM_PROMPT.md to learn the Potato format,
then read my code under #file:src/ and produce architecture.potato.html.
```

Copilot writes the file. Double-click it. You have a diagram.

---

## 💾 Save & share

Saved files are real interactive web pages:

- **Hover any service** → tooltip with SLA, limits, when-to-use, cost (with as-of date), common pitfalls.
- **▶ Play Flow** button → animates the request lifecycle with your narration.
- **Speed dropdown** → 🐢 Slow / Normal / 🐇 Fast.
- **🌙 / ☀️ theme toggle** → flips dark/light, persists per viewer.
- **Space to play, Escape to stop** — same shortcuts as the editor.
- **Drop the file back into Potato** to keep editing — full round-trip.

File size: typically 10–60 KB. No external dependencies. Works fully offline. Email-safe.

---

## 🛠 Tech stack

- **Pure vanilla JS** — no React, no Vue, no TypeScript, no build step.
- **HTML5 Canvas** for the minimap.
- **SVG** for the live arrows + saved viewer.
- **CSS Variables** for theming.
- **System fonts** — no Google Fonts, no CDN.
- **localStorage** for autosave; **BroadcastChannel** for cross-tab notifications; **IndexedDB** for FileSystemFileHandle persistence (Chromium).
- **Pointer Events** — works on mouse, trackpad, touch, and pen with identical code paths.

Zero `npm install`, zero compile step, zero runtime dependencies. The whole editor is one ~8700-line HTML file (the bulk is the inlined SVG icon library).

---

## 📁 Project structure

```
potato/
├── index.html                 ← THE entire editor (single file)
├── service_kb.json            ← Quarterly-refresh source of truth for tooltips + cost
├── _generate_kb.js            ← Splices service_kb.json into index.html
├── _generate_components.js    ← Splices the icons/ tree into the COMPONENTS manifest
├── _test_saved_viewer.js      ← Smoke test for the saved-viewer inline script
├── icons/                     ← 1067 SVGs across aws/azure/gcp by category
├── POTATO_LLM_PROMPT.md       ← Long-form prompt you can copy into any LLM
├── extension.js               ← VS Code extension entry point
├── package.json               ← VS Code extension manifest
├── .github/
│   ├── copilot-instructions.md  ← Auto-loaded by Copilot Chat in this repo
│   └── workflows/check.yml      ← CI: parses inline script, validates JSON, generator drift, viewer smoke test
└── README.md                  ← You are here
```

---

## 🔌 Extend it

**Add custom icons**
1. Drop SVGs into `icons/<provider>/<category>/`.
2. Run `node _generate_components.js`.
3. Reload `index.html`.

**Add cost data for more services**
1. Edit [`service_kb.json`](service_kb.json) — add `costEstimate: { small, medium, large }` to any entry.
2. Run `node _generate_kb.js`.
3. The Cost Estimator picks it up automatically.

**Use Potato in VS Code**
The bundled extension (in [`extension.js`](extension.js)) registers a custom editor for `*.potato.html` — double-click any saved diagram. See [Contributing](CONTRIBUTING.md) for development setup.

---

## 🤝 Contributing

PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

Especially wanted:
- More services in `service_kb.json` with `costEstimate` fields (39 priced of 52 covered — the 13 unpriced are mostly Azure/GCP/generic shapes)
- Quarterly pricing-refresh PRs
- More templates in the gallery
- Mermaid export (we import; closing the loop is a small lift)
- A GitHub Action that renders `.potato.html` files in PR diffs
- A `potato render diagram.potato.html --png out.png` CLI for CI pipelines

---

## 📄 License

**Code** ([LICENSE](LICENSE)): MIT — free to use, modify, distribute, fork, sell, embed.

**Icons** (`icons/aws/`, `icons/azure/`, `icons/gcp/`): subject to each cloud
provider's trademark and brand guidelines. They're free to use in diagrams
depicting AWS / Azure / GCP architectures, but not as logos, in advertising,
or in ways that imply provider endorsement. See [NOTICE](NOTICE) for full
attribution.

**Knowledge base** ([`service_kb.json`](service_kb.json)): MIT. Editorial
summaries of public docs; verify pricing numbers against the providers'
official calculators before committing.

No telemetry. No tracking. No strings.

---

<div align="center">

**Built for engineers who want to design and document cloud architectures without paying $40/seat/month or fighting a SaaS login.**

If Potato saves you time, star the repo ⭐ — it's the only "metric" we collect.

</div>
