# 🥔 Potato

**AI-native architecture diagrams with live AWS service constraints — single HTML file, runs in your browser.**

> No server. No account. No fees. No telemetry. Drop a component, get its limits and design guidance in the tooltip. Describe an architecture to any LLM, paste the output, get an editable diagram.

---

## 🚀 Why Potato?

| | Potato | draw.io | Excalidraw | Mermaid | Lucidchart |
|---|---|---|---|---|---|
| Single HTML file | ✅ | ❌ | ❌ | ❌ | ❌ |
| Truly offline | ✅ | ⚠️ | ✅ | ✅ | ❌ |
| Built-in AWS service KB (limits + when-to-use) | ✅ | ❌ | ❌ | ❌ | ❌ |
| AI / LLM import (any model) | ✅ | ❌ | ❌ | ⚠️ syntax | ❌ |
| Mermaid import | ✅ | ⚠️ | ❌ | ✅ | ❌ |
| Templates gallery | ✅ | ✅ | ❌ | ❌ | ✅ |
| Self-contained HTML save (re-editable) | ✅ | ❌ | ❌ | ❌ | ❌ |
| VS Code integration | ✅ | ⚠️ | ⚠️ | ✅ | ❌ |
| Account / login required | ❌ | ❌ | ❌ | ❌ | ✅ |
| Subscription | ❌ | ❌ | ❌ | ❌ | $$$ |

**The wedge:** every AWS/Azure/GCP node ships with real service limits (Lambda's 15-min timeout, DynamoDB's 400KB item, RDS connection caps) and "when to use this" guidance baked into its hover tooltip. No other free diagramming tool does this.

---

## ✨ Features

| Feature | Status |
|---|---|
| Drag & drop components from sidebar | ✅ |
| AWS, Azure, GCP, Network icon libraries | ✅ |
| Custom color themes per node | ✅ |
| Bezier curved connections with port anchors | ✅ |
| Animated / dashed / dotted arrow styles | ✅ |
| Inline text editing (double-click) | ✅ |
| Group / Swimlane containers | ✅ |
| Zoom + Pan + Fit to content | ✅ |
| Minimap navigation | ✅ |
| Properties panel (position, label, color) | ✅ |
| Undo / Redo (60 levels) | ✅ |
| Copy / Paste nodes | ✅ |
| Multi-select (shift-click, drag rect) | ✅ |
| Arrow key nudge | ✅ |
| Auto layout (LR / TB) | ✅ |
| **Save as self-contained HTML (with embedded SVG viewer)** | ✅ |
| **Reopen saved HTML to continue editing** | ✅ |
| **Templates gallery (10 ready-made architectures)** | ✅ |
| **Recent diagrams (resume any recently saved file)** | ✅ |
| **AI Import (paste LLM HTML output)** | ✅ |
| **Inline LLM prompt (no copy-from-GitHub round-trip)** | ✅ |
| **Mermaid / JSON import** | ✅ |
| **Layered auto-layout (LR / TB) honoring measured node sizes** | ✅ |
| **AWS/Azure/GCP service knowledge base in tooltips + side panel** | ✅ |
| **Auto-save to localStorage + crash recovery (per-tab isolated)** | ✅ |
| **Grid snap toggle (20px)** | ✅ |
| **Touch & pen support (drag, connect, pan on iPad/tablet)** | ✅ |
| Context menu | ✅ |
| Component search / filter | ✅ |
| Keyboard shortcuts | ✅ |
| Works 100% offline | ✅ |

---

## 🚀 Quick Start

```bash
git clone https://github.com/potato-diagram/potato.git
cd potato
open index.html   # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

Or just **download `index.html`** and open it in any modern browser.

---

## 📁 Project Structure

```
potato/
├── index.html             ← The entire editor (single file, ~4000 lines)
├── extension.js           ← VS Code extension entry point
├── package.json           ← VS Code extension manifest
├── POTATO_LLM_PROMPT.md   ← Prompt to paste into ChatGPT/Claude/Gemini
├── COPILOT_CONTEXT.md     ← Project context for Copilot/LLMs
├── README.md              ← You are here
├── CONTRIBUTING.md        ← How to contribute
├── LICENSE                ← MIT
├── .gitignore
├── settings.json
└── potato.code-workspace  ← VS Code multi-root workspace
```

### Adding Custom Icons

Place `.svg` or `.png` files in the appropriate `icons/` subfolder.
Then reference them in the `COMPONENTS` object in `index.html`:

```javascript
{ id: 'my-service', name: 'My Service', icon: 'icons/aws/my-service.svg', theme: 'blue', type: 'My Service' }
```

For emoji icons (default), just use any emoji character:
```javascript
{ id: 'my-node', name: 'My Node', icon: '🔧', theme: 'orange', type: 'Custom' }
```

---

## 💾 Save Format

Diagrams are saved as **self-contained HTML files**:

- Double-click to open in browser as a **read-only viewer**
- Open in Potato (`File → Open`) to **resume editing**
- The JSON diagram data is embedded inside a `<script>` tag in the saved file
- Fully portable — email it, commit it to git, share it on Slack

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+S` | Save as HTML |
| `Ctrl+Z` / `Ctrl+Y` | Undo / Redo |
| `Ctrl+C` / `Ctrl+V` | Copy / Paste |
| `Ctrl+A` | Select all |
| `Delete` | Delete selected |
| `S` | Select tool |
| `H` | Pan tool |
| `T` | Text tool |
| `+` / `-` | Zoom in / out |
| `0` | Zoom reset |
| `F` | Fit to content |
| `Arrow keys` | Nudge (Shift = 10px) |
| `Escape` | Clear selection |

---

## 🎨 Component Libraries

> Icons are rendered as native emoji (🪣 S3, ⚡ Lambda, 🗄️ DB, etc.) — no external icon packs to download. To use real provider SVG icons, drop them into the `icons/` folder and reference them in the `COMPONENTS` object in `index.html` (see "Adding Custom Icons" above).

### Shapes
Basic shapes, flowchart elements (start/end, decision, process, I/O, document, loop)

### AWS
Compute (EC2, Lambda, ECS, EKS, Fargate), Storage (S3, EBS, EFS), Database (RDS, DynamoDB, ElastiCache, Aurora, Redshift), Networking (VPC, ALB, CloudFront, Route53, API Gateway), AI/ML (Bedrock, SageMaker, Rekognition, Textract), Security (IAM, Cognito, KMS, Secrets Manager), Integration (SQS, SNS, EventBridge, Step Functions, Kinesis), DevOps (CodeCommit, CodeBuild, CloudWatch, X-Ray)

### Azure / GCP
Azure: VMs, Functions, Blob Storage, Cosmos DB, Data Factory, APIM, Active Directory.
GCP: Compute Engine, Cloud Functions, Cloud Storage, BigQuery, GKE, Vertex AI.

### Network
Router, Switch, Firewall, Server, Workstation, NAS, VPN, WiFi AP, DNS, Proxy, IDS/IPS, SIEM, HSM

---

## 🔌 Adding Your Own Icon Packs

Potato supports loading icons from local folder paths. To use icons from the `icons/` directory, modify the component entry:

```javascript
// In COMPONENTS object in index.html
{ id: 'custom', name: 'Custom', icon: '🔧', theme: 'blue', type: 'Custom Service' }
```

Future versions will support inline SVG rendering from the `icons/` directory.

---

## 🤝 Contributing

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

Ideas for contributions:
- More icon libraries (Kubernetes, HashiCorp, etc.)
- Export to SVG / PNG (via html2canvas or similar)
- Real-time collaboration (WebRTC)
- Shape library (UML, ER diagram shapes)
- Theming (light mode, custom CSS themes)
- Snap-to-grid
- Auto-routing arrows (avoid node overlaps)

---

## 📄 License

MIT License — see [LICENSE](LICENSE).

Free to use, modify, and distribute. No attribution required.

---

## 🙏 Inspiration

Built as a free, local-first architecture diagramming tool — no subscription, no account, no internet connection required.
