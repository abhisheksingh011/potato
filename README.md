<div align="center">

# 🥔 Potato

**The free architecture diagramming tool that knows AWS, Azure & GCP — and runs as a single offline HTML file.**

[![MIT License](https://img.shields.io/badge/license-MIT-1abc9c)](LICENSE)
[![Single file](https://img.shields.io/badge/runtime-1%20html%20file-7B2FBE)](index.html)
[![Real icons](https://img.shields.io/badge/icons-1067%20AWS%20%2F%20Azure%20%2F%20GCP-FF9900)](icons/)
[![Zero deps](https://img.shields.io/badge/dependencies-zero-2E86C1)](#why-potato)

*Describe an architecture to ChatGPT. Paste the reply. Get a real editable diagram with cost estimates and play-the-flow narration. All in your browser, no account, no fees.*

</div>

---

## ⚡ Try it in 30 seconds

```bash
git clone https://github.com/abhisheksingh011/potato.git
cd potato
# macOS:   open index.html
# Linux:   xdg-open index.html
# Windows: start index.html
```

Or just **[download `index.html`](index.html)** and double-click. That's the whole install.

---

## 🎯 What Potato does that nothing else does

| | Potato |
|---|---|
| 🤖 **Plain-English → diagram** | Paste a prompt into any LLM, paste the HTML back, get a fully editable architecture. |
| 💰 **Cost estimates baked in** | Hover any AWS service to see real pricing formulas. Click `💰 Cost` to total up the diagram at small/medium/large workloads. |
| 📋 **Service limits in tooltips** | Lambda's 15-min timeout, DynamoDB's 400KB item, RDS connection caps — every cloud node has its real-world constraints, "when to use", and common pitfalls one hover away. |
| ▶ **Play the flow** | Click ▶ Play and watch your architecture explain itself, step-by-step, with LLM-written narration. |
| 🪣 **1067 official icons** | AWS / Azure / GCP — searchable, drag-and-drop. Same artwork the cloud vendors ship. |
| 📤 **Sharable as a single file** | Save → email → recipient opens it in any browser → hovers icons, plays the flow, sees costs. No Potato install needed for viewers. |

> No account. No telemetry. No subscription. No internet required after the initial download.

---

## 🎬 The headline workflow

```text
┌─────────────────────────────────────────────────────────────────┐
│  1. Click 🤖 AI Import                                          │
│  2. Copy the Potato prompt → paste into ChatGPT / Claude / Gemini│
│  3. Describe your architecture in plain English                 │
│  4. Paste the LLM's HTML reply back into Potato                 │
│  5. Edit visually, hit ▶ Play, click 💰 Cost                    │
└─────────────────────────────────────────────────────────────────┘
```

**Real prompt that works**:

> *"Show a RAG chatbot on AWS: S3 docs → embedding Lambda → OpenSearch vector index → API Gateway → Bedrock with Claude. Add CloudWatch on each Lambda."*

Result: 7 real AWS-iconed nodes, color-themed by service family, with a `playFlow` narration that walks the request lifecycle end-to-end, and a cost estimate ready to inspect.

---

## 🆚 vs. the alternatives

| | **Potato** | draw.io | Excalidraw | Mermaid | Lucidchart |
|---|---|---|---|---|---|
| Single offline HTML file | ✅ | ❌ | ❌ | ❌ | ❌ |
| 1067 official AWS/Azure/GCP icons built-in | ✅ | ⚠️ download | ❌ | ❌ | ✅ paid |
| Cost estimator | ✅ | ❌ | ❌ | ❌ | ❌ |
| Service-limit tooltips (Lambda 15-min etc.) | ✅ | ❌ | ❌ | ❌ | ❌ |
| LLM-native import (any model) | ✅ | ❌ | ❌ | ⚠️ syntax | ❌ |
| Animated play-the-flow with narration | ✅ | ❌ | ❌ | ❌ | ❌ |
| Save → recipient can interact in browser | ✅ | ❌ | ❌ | ❌ | ❌ |
| Account / login required | ❌ | ❌ | ❌ | ❌ | ✅ |
| Subscription | **Free** | Free | Free | Free | $$$ |

---

## 📚 10 templates to start from

Open `✨ Templates` in the toolbar and pick:

| Template | What you get |
|---|---|
| **3-Tier Web App** | User → CDN → ALB → ECS → RDS + worker + SQS |
| **Serverless API** | API Gateway → Lambdas → DynamoDB + Cognito + EventBridge |
| **AI Agent Architecture** | Supervisor + sub-agents on Bedrock with memory + tools |
| **Data Pipeline** | S3 → Lambda → Kinesis → Redshift + monitoring |
| **Microservices** | API Gateway + 3 services with per-service DBs + event bus |
| **Event-Driven Pipeline** | SNS fans out to 3 SQS queues, each driving a Lambda |
| **ML Training Pipeline** | S3 → SageMaker → Model Registry → real-time + batch inference |
| **RAG Chatbot** | Embedding pipeline + vector DB + Bedrock RAG |
| **Kubernetes App** | Ingress → 2 deployments → Redis + Postgres statefulsets |
| **+ your own** | Save any diagram and it shows up under "Recent" |

---

## 🚀 Features at a glance

**Diagramming**
- 1067 real AWS / Azure / GCP icons + emoji shapes
- Orthogonal arrows that route around obstacles (no more lines through boxes)
- Animated / dashed / dotted arrow styles, 9 colors
- Groups / swimlanes for VPCs, subnets, service boundaries
- Auto-layout (LR / TB), grid-snap, smart fit-to-content
- Touch + pen support on iPad / tablets

**AI workflow**
- Inline LLM prompt — copy with one click, no GitHub round-trip
- `🤖 AI Import` validates + sanitizes + rescues icon paths the LLM guessed wrong
- `playFlow` narration shipped with the diagram; ▶ Play walks through with on-screen text
- Sequence Editor lets you reorder, edit, or rewrite the narration

**Knowledge**
- Service KB with **limits, when-to-use, cost formulas, and common pitfalls** for 52 services
- Hover or open the Properties panel — same info, same data, "as of Q2 2026" footnote
- Quarterly refresh via one JSON file (`service_kb.json`) + a build script

**Cost Estimator** (`💰 Cost` toolbar button)
- Three workload presets (Small / Medium / Large)
- Per-service breakdown grouped by service type, monthly subtotal each
- Auto-sum total with coverage indicator ("14 of 17 services priced")
- Honest about what's not modelled (egress, NAT gateway, support plans)

**Export & share**
- `💾 Save` → self-contained `.potato.html`. Reopens in Potato to edit, double-clicks to view standalone.
- `🖼 PNG` / `✦ SVG` — real provider icons embedded, no `icons/` folder dependency.
- The saved-HTML viewer is **interactive** — hover for tooltips, ▶ Play the flow, no editor required.

**Import**
- AI Import (LLM HTML or raw JSON)
- Mermaid (`flowchart`, `graph`, `sequenceDiagram`)
- Potato JSON

**Quality of life**
- 60-level undo / redo, copy / paste (including arrow connections)
- Multi-select, drag-rect, arrow-key nudge, shift-nudge x10
- Auto-save to localStorage + per-tab crash recovery
- Recent diagrams (last 8) in the Templates modal

---

## ⌨️ Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+S` | Save as HTML |
| `Ctrl+Z` / `Ctrl+Y` | Undo / Redo |
| `Ctrl+C` / `Ctrl+V` | Copy / Paste (preserves connections) |
| `Ctrl+A` | Select all |
| `Delete` | Delete selected |
| `Space` | ▶ Play / ⏹ stop the flow animation |
| `S` / `H` / `T` / `G` | Select / Pan / Text / Group tool |
| `+` / `-` / `0` / `F` | Zoom in / out / reset / fit |
| `Arrow keys` | Nudge 1px (Shift = 10px) |
| `Escape` | Clear selection · stop playback · close modals |

---

## 🧠 Service Knowledge Base

Every cloud node carries four fields you can edit, refresh quarterly, or extend:

```json
{
  "lambda": {
    "name":      "AWS Lambda",
    "limits":    "Max execution: 15 min | Memory: 128 MB–10 GB | …",
    "whenToUse": "Best for short-lived, event-driven tasks. Scales to zero.",
    "cost":      "$0.20/M requests + $0.0000166/GB-s. Free tier: 1M req…",
    "pitfalls":  ["VPC cold starts add 1-5s — keep Lambda outside VPC…", …]
  }
}
```

Surfaced in:
- Hover tooltip on the canvas
- Properties panel when a node is selected
- Cost Estimator breakdown
- The standalone saved-HTML viewer (when emailing the diagram)

Add new entries to [`service_kb.json`](service_kb.json), run `node _generate_kb.js`, commit. That's the entire workflow.

---

## 🤖 AI workflow in detail

1. **Click 🤖 AI Import** — modal walks you through 3 steps.
2. **Step 1**: ▶ Copy the Potato prompt. It explains the JSON schema, the 1067 icon paths, layout rules, theme conventions, and the `playFlow` narration format.
3. **Step 2**: Paste into your LLM (ChatGPT / Claude / Gemini / Mistral / Llama / Grok — anything that returns HTML). Describe your architecture in plain English.
4. **Step 3**: Paste the LLM's full HTML reply (or save it as `my-diagram.potato.html` and open via `📂 Open`). Click ⬇️ Import.

Potato will:
- Validate every node, arrow, group, and playFlow step
- Rescue mismatched icon paths from the node's `type` field (LLMs guess paths wrong sometimes)
- Show a sanitization toast: *"🔧 3 icon paths didn't match our catalog — rescued from node type."*
- Drop you straight on the editable canvas

The LLM prompt lives in [`POTATO_LLM_PROMPT.md`](POTATO_LLM_PROMPT.md) if you want to read it or fork it.

---

## 💾 Save & share

Saved files are real interactive web pages:

- **Hover any service** → tooltip with limits, when-to-use, cost (with as-of date), common pitfalls.
- **▶ Play Flow** button → animates the request lifecycle with your narration.
- **Speed dropdown** → 🐢 Slow / Normal / 🐇 Fast.
- **Space to play, Escape to stop** — same shortcuts as the editor.
- **Drop the file back into Potato** to keep editing — full round-trip.

File size: typically 10–60 KB depending on diagram complexity. No external dependencies. Works fully offline. Email-safe.

---

## 🛠 Tech stack

- **Pure vanilla JS** — no React, no Vue, no TypeScript, no build step.
- **HTML5 Canvas** for PNG export and the minimap.
- **SVG** for the live arrows + saved viewer.
- **CSS Variables** for theming.
- **System fonts** — no Google Fonts, no CDN.
- **localStorage** for autosave; **BroadcastChannel** for cross-tab notification.
- **Pointer Events** — works on mouse, trackpad, touch, and pen with identical code paths.

Zero `npm install`, zero compile step, zero runtime dependencies. The whole tool is one ~5800-line HTML file.

---

## 📁 Project structure

```
potato/
├── index.html             ← THE entire editor (single file)
├── service_kb.json        ← Quarterly-refresh source of truth for tooltips + cost
├── _generate_kb.js        ← Splices service_kb.json into index.html
├── _generate_components.js← Splices icons/ tree into the COMPONENTS manifest
├── icons/                 ← 1067 SVGs across aws/azure/gcp by category
├── POTATO_LLM_PROMPT.md   ← Long-form prompt you can copy into any LLM
├── extension.js           ← VS Code extension entry point
├── package.json           ← VS Code extension manifest
└── README.md              ← You are here
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
The bundled extension (in [`extension.js`](extension.js)) embeds the editor in a Webview panel — `Ctrl+Alt+D` to open. See [`COPILOT_CONTEXT.md`](COPILOT_CONTEXT.md) for setup details.

---

## 🤝 Contributing

PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

Especially wanted:
- More services in `service_kb.json` with `costEstimate` fields (we have 18 priced out of 52 covered out of ~1067 icons)
- Quarterly pricing-refresh PRs
- More templates in the gallery
- Light theme
- Mermaid export (we import; closing the loop is a small lift)
- GitHub Action that renders `.potato.html` files in PR diffs

---

## 📄 License

**Code** ([LICENSE](LICENSE)): MIT — free to use, modify, distribute, fork, sell, embed.

**Icons** (`icons/aws/`, `icons/azure/`, `icons/gcp/`): subject to each cloud
provider's trademark and brand guidelines. They're free to use in diagrams
depicting AWS / Azure / GCP architectures, but not as logos, in advertising,
or in ways that imply provider endorsement. See [NOTICE](NOTICE) for the
full attribution.

**Knowledge base** ([`service_kb.json`](service_kb.json)): MIT. Editorial
summaries of public docs; verify pricing numbers against the providers'
official calculators before committing.

No telemetry. No tracking. No strings.

---

<div align="center">

**Built for engineers who want to design and document cloud architectures without paying $40/seat/month or fighting a SaaS login.**

If Potato saves you time, star the repo ⭐ — it's the only "metric" we collect.

</div>
