const vscode = require('vscode');
const path   = require('path');
const fs     = require('fs');

// ── helpers ──────────────────────────────────────────────────────────────────

async function getPotatoHTML(context, existingData = null) {
  // Look for index.html in the extension root first (current repo layout),
  // then fall back to ./potato/index.html (documented layout).
  const candidates = [
    path.join(context.extensionPath, 'index.html'),
    path.join(context.extensionPath, 'potato', 'index.html'),
  ];
  let htmlPath = null;
  for (const p of candidates) {
    try { await fs.promises.access(p); htmlPath = p; break; } catch (_) {}
  }

  if (!htmlPath) {
    return `<html><body style="color:white;background:#0d0f1a;font-family:monospace;padding:40px">
      <h2>🥔 Potato — Setup Required</h2>
      <p>Could not find <code>index.html</code> in the extension folder.</p>
      <p>Checked: <code>${candidates.join('</code> and <code>')}</code></p>
    </body></html>`;
  }

  let html = await fs.promises.readFile(htmlPath, 'utf8');

  // If we have existing diagram data, inject it so it loads on startup
  if (existingData) {
    const injection = `
<script>
  // Injected by VS Code extension — load saved diagram on startup
  window.__POTATO_VSCODE__ = true;
  window.__POTATO_INITIAL_DATA__ = ${JSON.stringify(existingData)};
  window.addEventListener('load', function() {
    if (window.__POTATO_INITIAL_DATA__ && window.loadDiagramData) {
      window.loadDiagramData(window.__POTATO_INITIAL_DATA__);
      setTimeout(function() { if (window.fitToContent) window.fitToContent(); }, 200);
    }
  });
</script>`;
    html = html.replace('</head>', injection + '</head>');
  }

  // Inject VS Code save bridge — intercepts Ctrl+S and sends data back to extension
  const vscodeBridge = `
<script>
(function() {
  const vscode = typeof acquireVsCodeApi !== 'undefined' ? acquireVsCodeApi() : null;

  // Override saveDiagram to also notify VS Code
  window.addEventListener('load', function() {
    const origSave = window.saveDiagram;
    window.saveDiagram = function() {
      origSave && origSave();
      if (vscode && window.getDiagramData) {
        vscode.postMessage({
          type: 'save',
          data: window.getDiagramData(),
          filename: document.getElementById('filename-input')?.value || 'diagram'
        });
      }
    };

    // Listen for messages from the extension
    window.addEventListener('message', function(event) {
      const msg = event.data;
      if (msg.type === 'load' && msg.data && window.loadDiagramData) {
        window.loadDiagramData(msg.data);
        setTimeout(function() { if (window.fitToContent) window.fitToContent(); }, 100);
      }
    });

    // Notify extension that Potato is ready
    if (vscode) {
      vscode.postMessage({ type: 'ready' });
    }
  });
})();
</script>`;
  html = html.replace('</body>', vscodeBridge + '</body>');

  return html;
}

function extractDiagramData(htmlContent) {
  const match = htmlContent.match(/<script[^>]+id="potato-data"[^>]*>([\s\S]*?)<\/script>/i);
  if (match) {
    // Reverse the </script escaping we apply on save.
    const raw = match[1].trim().replace(/<\\\/script/gi, '</script');
    try { return JSON.parse(raw); } catch(e) { return null; }
  }
  return null;
}

// ── Webview Panel Manager ─────────────────────────────────────────────────────

const panels = new Map();

function openPotatoPanel(context, fileUri = null) {
  const columnToShowIn = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : vscode.ViewColumn.One;

  const panelKey = fileUri ? fileUri.fsPath : '__new__';

  // Reuse existing panel if open
  if (panels.has(panelKey)) {
    panels.get(panelKey).reveal(columnToShowIn);
    return;
  }

  const title = fileUri
    ? '🥔 ' + path.basename(fileUri.fsPath)
    : '🥔 New Potato Diagram';

  const panel = vscode.window.createWebviewPanel(
    'potato.diagramEditor',
    title,
    columnToShowIn,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.file(context.extensionPath),
        vscode.Uri.file(path.join(context.extensionPath, 'potato'))
      ]
    }
  );

  panels.set(panelKey, panel);

  // Load existing file data if provided (async).
  (async () => {
    let existingData = null;
    if (fileUri) {
      try {
        const content = await fs.promises.readFile(fileUri.fsPath, 'utf8');
        existingData = extractDiagramData(content);
      } catch (e) {
        vscode.window.showWarningMessage(`🥔 Could not read ${path.basename(fileUri.fsPath)}: ${e.message}`);
      }
    }
    panel.webview.html = await getPotatoHTML(context, existingData);
  })();

  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    message => {
      if (message.type === 'ready') {
        vscode.window.setStatusBarMessage('🥔 Potato ready', 3000);
      }

      if (message.type === 'save') {
        const diagramData = message.data;
        const name = message.filename || 'diagram';
        const workspaceRoot = (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0])
          ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';

        (async () => {
          try {
            let savePath = fileUri ? fileUri.fsPath : null;
            if (!savePath) {
              const uri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(path.join(workspaceRoot, name + '.potato.html')),
                filters: { 'Potato Diagram': ['html', 'potato.html'] }
              });
              if (!uri) return;
              savePath = uri.fsPath;
            }
            await savePotatoFile(savePath, diagramData, name);
            vscode.window.showInformationMessage(`🥔 Saved: ${path.basename(savePath)}`);
          } catch (e) {
            vscode.window.showErrorMessage(`🥔 Save failed: ${e.message}`);
          }
        })();
      }
    },
    undefined,
    context.subscriptions
  );

  panel.onDidDispose(() => {
    panels.delete(panelKey);
  }, null, context.subscriptions);
}

async function savePotatoFile(filePath, data, name) {
  // Escape </script so labels/descriptions can never break out of the JSON island.
  const dataStr = JSON.stringify(data, null, 2).replace(/<\/script/gi, '<\\/script');
  const html = buildSavedHTML(name, dataStr);
  await fs.promises.writeFile(filePath, html, 'utf8');
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSavedHTML(name, dataStr) {
  const safeName = escapeHtml(name);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${safeName} — Potato</title>
<style>
  body { margin:0; background:#0d0f1a; color:#e8eaf6; font-family:system-ui,sans-serif; min-height:100vh; padding:40px; }
  h2 { color:#7B2FBE; }
  p { color:#7986cb; margin-top:12px; line-height:1.6; }
  a { color:#1abc9c; }
</style>
</head>
<body>
<!-- Potato Saved Diagram -->
<script type="application/json" id="potato-data">
${dataStr}
<\/script>
<h2>🥔 Potato — ${safeName}</h2>
<p id="potato-summary">Loading…</p>
<p>Open this file in VS Code (with the Potato extension) or in the <a href="https://github.com/abhisheksingh011/potato">Potato editor</a> to edit.</p>
<script>
(function(){
  try {
    const data = JSON.parse(document.getElementById('potato-data').textContent);
    document.getElementById('potato-summary').textContent =
      'Nodes: ' + (data.nodes||[]).length + ' · Connections: ' + (data.arrows||[]).length;
  } catch(e) {
    document.getElementById('potato-summary').textContent = 'Could not parse diagram data.';
  }
})();
<\/script>
</body>
</html>`;
}

// ── Extension Activate ────────────────────────────────────────────────────────

function activate(context) {
  console.log('🥔 Potato Diagram extension activated');

  // Command: open blank editor
  context.subscriptions.push(
    vscode.commands.registerCommand('potato.openEditor', () => {
      openPotatoPanel(context, null);
    })
  );

  // Command: new diagram
  context.subscriptions.push(
    vscode.commands.registerCommand('potato.newDiagram', () => {
      openPotatoPanel(context, null);
    })
  );

  // Command: open specific .html file in Potato
  context.subscriptions.push(
    vscode.commands.registerCommand('potato.openFile', (fileUri) => {
      // If called from explorer context menu, fileUri is passed
      // If called from command palette, prompt for file
      if (fileUri) {
        openPotatoPanel(context, fileUri);
      } else if (vscode.window.activeTextEditor) {
        openPotatoPanel(context, vscode.window.activeTextEditor.document.uri);
      } else {
        vscode.window.showOpenDialog({
          filters: { 'HTML Files': ['html'] },
          canSelectMany: false
        }).then(uris => {
          if (uris && uris[0]) openPotatoPanel(context, uris[0]);
        });
      }
    })
  );

  // Auto-open *.potato.html files in the Potato editor
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(doc => {
      if (doc.fileName.endsWith('.potato.html')) {
        vscode.commands.executeCommand('potato.openFile',
          vscode.Uri.file(doc.fileName));
      }
    })
  );

  // Status bar button
  const statusItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right, 100);
  statusItem.text = '🥔 Potato';
  statusItem.tooltip = 'Open Potato Diagram Editor';
  statusItem.command = 'potato.openEditor';
  statusItem.show();
  context.subscriptions.push(statusItem);
}

function deactivate() {}

module.exports = { activate, deactivate };
