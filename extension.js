const vscode = require('vscode');
const path   = require('path');
const fs     = require('fs');

// ── helpers ──────────────────────────────────────────────────────────────────

async function findIndexHtml(context) {
  const candidates = [
    path.join(context.extensionPath, 'index.html'),
    path.join(context.extensionPath, 'potato', 'index.html'),
  ];
  for (const p of candidates) {
    try { await fs.promises.access(p); return p; } catch (_) {}
  }
  return null;
}

async function getPotatoHTML(context, existingData = null) {
  const htmlPath = await findIndexHtml(context);
  if (!htmlPath) {
    return `<html><body style="color:white;background:#0d0f1a;font-family:monospace;padding:40px">
      <h2>🥔 Potato — Setup Required</h2>
      <p>Could not find <code>index.html</code> in the extension folder.</p>
    </body></html>`;
  }

  let html = await fs.promises.readFile(htmlPath, 'utf8');

  // Initial-data injection. We escape any </script in the JSON so it can't
  // close the surrounding <script> block.
  const initialJson = existingData
    ? JSON.stringify(existingData).replace(/<\/(script)/gi, '<\\/$1')
    : 'null';

  const headInject = `
<script>
  window.__POTATO_VSCODE__ = true;
  window.__POTATO_INITIAL_DATA__ = ${initialJson};
  window.addEventListener('load', function() {
    if (window.__POTATO_INITIAL_DATA__ && window.loadDiagramData) {
      window.loadDiagramData(window.__POTATO_INITIAL_DATA__);
      setTimeout(function() { if (window.fitToContent) window.fitToContent(); }, 200);
    }
  });
</script>`;
  html = html.replace('</head>', headInject + '</head>');

  // Bridge: when the editor's saveDiagram runs it sees __POTATO_VSCODE_SAVE__
  // and delegates the fully-rendered HTML to the host instead of triggering
  // a browser download. Host writes it atomically and posts {type:'saved'};
  // the editor's _potatoAfterSave then runs (markClean + recents + notify).
  const bridge = `
<script>
(function() {
  const vscode = typeof acquireVsCodeApi !== 'undefined' ? acquireVsCodeApi() : null;
  if (!vscode) return;

  window.__POTATO_VSCODE_SAVE__ = function(payload) {
    vscode.postMessage({
      type: 'save',
      html: payload && payload.html,
      name: payload && payload.name
    });
  };

  window.addEventListener('load', function() {
    window.addEventListener('message', function(event) {
      const msg = event && event.data;
      if (!msg) return;
      if (msg.type === 'load' && msg.data && window.loadDiagramData) {
        window.loadDiagramData(msg.data);
        setTimeout(function() { if (window.fitToContent) window.fitToContent(); }, 100);
      } else if (msg.type === 'saved' && window._potatoAfterSave) {
        window._potatoAfterSave(msg.name || 'diagram');
      }
    });
    vscode.postMessage({ type: 'ready' });
  });
})();
</script>`;
  html = html.replace('</body>', bridge + '</body>');

  return html;
}

function extractDiagramData(htmlContent) {
  const match = htmlContent.match(/<script[^>]+id="potato-data"[^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return null;
  // Reverse the </script escaping we apply on save.
  const raw = match[1].trim().replace(/<\\\/script/gi, '</script');
  try { return JSON.parse(raw); } catch (_) { return null; }
}

// Atomic write: temp file in the same directory, then rename. Avoids a
// half-written file if the process dies mid-write.
async function atomicWriteFile(filePath, contents) {
  const dir = path.dirname(filePath);
  const tmp = path.join(dir, `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`);
  await fs.promises.writeFile(tmp, contents, 'utf8');
  try {
    await fs.promises.rename(tmp, filePath);
  } catch (e) {
    try { await fs.promises.unlink(tmp); } catch (_) {}
    throw e;
  }
}

// ── Custom editor provider for *.potato.html ─────────────────────────────────

class PotatoEditorProvider {
  constructor(context) { this.context = context; }

  async resolveCustomTextEditor(document, webviewPanel, _token) {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(this.context.extensionPath)]
    };

    let existingData = null;
    try { existingData = extractDiagramData(document.getText()); } catch (_) { /* malformed file */ }
    webviewPanel.webview.html = await getPotatoHTML(this.context, existingData);

    const sub = webviewPanel.webview.onDidReceiveMessage(async msg => {
      if (!msg) return;
      if (msg.type === 'ready') {
        vscode.window.setStatusBarMessage('🥔 Potato ready', 3000);
        return;
      }
      if (msg.type === 'save' && typeof msg.html === 'string') {
        try {
          await atomicWriteFile(document.uri.fsPath, msg.html);
          webviewPanel.webview.postMessage({ type: 'saved', name: msg.name });
          vscode.window.setStatusBarMessage(`🥔 Saved: ${path.basename(document.uri.fsPath)}`, 3000);
        } catch (e) {
          vscode.window.showErrorMessage(`🥔 Save failed: ${e.message}`);
        }
      }
    });

    webviewPanel.onDidDispose(() => sub.dispose());
  }
}
PotatoEditorProvider.viewType = 'potato.diagramEditor';

// ── Untitled "new diagram" panel ─────────────────────────────────────────────

let _newDiagramPanel = null;

function openNewDiagramPanel(context) {
  const columnToShowIn = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : vscode.ViewColumn.One;

  if (_newDiagramPanel) {
    try { _newDiagramPanel.reveal(columnToShowIn); return; }
    catch (_) { _newDiagramPanel = null; /* disposed under us */ }
  }

  const panel = vscode.window.createWebviewPanel(
    'potato.diagramEditor.untitled',
    '🥔 New Potato Diagram',
    columnToShowIn,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.file(context.extensionPath)]
    }
  );
  _newDiagramPanel = panel;
  panel.onDidDispose(() => { if (_newDiagramPanel === panel) _newDiagramPanel = null; });

  (async () => {
    panel.webview.html = await getPotatoHTML(context, null);
  })();

  panel.webview.onDidReceiveMessage(async msg => {
    if (!msg) return;
    if (msg.type === 'ready') {
      vscode.window.setStatusBarMessage('🥔 Potato ready', 3000);
      return;
    }
    if (msg.type === 'save' && typeof msg.html === 'string') {
      const name = msg.name || 'diagram';
      const workspaceRoot = (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0])
        ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
      const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(path.join(workspaceRoot, name + '.potato.html')),
        filters: { 'Potato Diagram': ['html'] }
      });
      if (!uri) return; // user cancelled — leave the diagram dirty
      try {
        await atomicWriteFile(uri.fsPath, msg.html);
        vscode.window.showInformationMessage(`🥔 Saved: ${path.basename(uri.fsPath)}`);
        panel.dispose();
        await vscode.commands.executeCommand('vscode.openWith', uri, PotatoEditorProvider.viewType);
      } catch (e) {
        vscode.window.showErrorMessage(`🥔 Save failed: ${e.message}`);
      }
    }
  });
}

// ── Extension entry points ───────────────────────────────────────────────────

function activate(context) {
  console.log('🥔 Potato Diagram extension activated');

  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      PotatoEditorProvider.viewType,
      new PotatoEditorProvider(context),
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('potato.openEditor', () => openNewDiagramPanel(context)),
    vscode.commands.registerCommand('potato.newDiagram',  () => openNewDiagramPanel(context)),
    vscode.commands.registerCommand('potato.openFile', async (fileUri) => {
      let target = fileUri;
      if (!target && vscode.window.activeTextEditor) target = vscode.window.activeTextEditor.document.uri;
      if (!target) {
        const picked = await vscode.window.showOpenDialog({
          filters: { 'Potato Diagram': ['html'] },
          canSelectMany: false
        });
        target = picked && picked[0];
      }
      if (target) {
        await vscode.commands.executeCommand('vscode.openWith', target, PotatoEditorProvider.viewType);
      }
    })
  );

  const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusItem.text = '🥔 Potato';
  statusItem.tooltip = 'Open Potato Diagram Editor';
  statusItem.command = 'potato.openEditor';
  statusItem.show();
  context.subscriptions.push(statusItem);
}

function deactivate() {}

module.exports = { activate, deactivate };
