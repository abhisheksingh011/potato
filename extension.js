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
  // __POTATO_VSCODE_SAVE_AS__ is the same but always pops a save dialog,
  // for explicit Save As (Ctrl+Shift+S / toolbar button).
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
  window.__POTATO_VSCODE_SAVE_AS__ = function(payload) {
    vscode.postMessage({
      type: 'saveAs',
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

// Match the editor's normalizeDiagramName(): strip extensions, sanitize,
// then append `.potato.html` so every Save-As suggestion lands on the
// same canonical form regardless of what the user typed.
function normalizeDiagramFilename(name) {
  const safe = String(name == null ? 'diagram' : name)
    .replace(/\.(potato\.)?(html|png|svg)$/i, '')
    .replace(/\.potato$/i, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    || 'diagram';
  return safe + '.potato.html';
}

// Prompt for a destination and write HTML atomically. Returns the URI of
// the written file, or null if the user cancelled.
async function promptAndWrite(html, suggestedName, defaultDir) {
  const filename = normalizeDiagramFilename(suggestedName);
  const defaultUri = vscode.Uri.file(path.join(defaultDir || '', filename));
  const uri = await vscode.window.showSaveDialog({
    defaultUri,
    filters: { 'Potato Diagram': ['html'] }
  });
  if (!uri) return null;
  await atomicWriteFile(uri.fsPath, html);
  return uri;
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

    // Set true while we're applying our own save edit so the change listener
    // doesn't bounce the same content back into the webview (which would
    // re-fit the camera and feel like a glitch after every save).
    let suppressNextChange = false;

    const changeSub = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() !== document.uri.toString()) return;
      if (suppressNextChange) { suppressNextChange = false; return; }
      let data = null;
      try { data = extractDiagramData(e.document.getText()); } catch (_) {}
      if (data) webviewPanel.webview.postMessage({ type: 'load', data });
    });

    const sub = webviewPanel.webview.onDidReceiveMessage(async msg => {
      if (!msg) return;
      if (msg.type === 'ready') {
        vscode.window.setStatusBarMessage('🥔 Potato ready', 3000);
        return;
      }
      if (msg.type === 'save' && typeof msg.html === 'string') {
        try {
          // Replace the document through VS Code's edit pipeline so the text
          // model stays in sync with disk (split editors / Revert / git
          // diffs all rely on this). document.save() then writes atomically.
          const edit = new vscode.WorkspaceEdit();
          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
          );
          edit.replace(document.uri, fullRange, msg.html);
          suppressNextChange = true;
          const applied = await vscode.workspace.applyEdit(edit);
          if (!applied) { suppressNextChange = false; throw new Error('applyEdit returned false'); }
          await document.save();
          webviewPanel.webview.postMessage({ type: 'saved', name: msg.name });
          vscode.window.setStatusBarMessage(`🥔 Saved: ${path.basename(document.uri.fsPath)}`, 3000);
        } catch (e) {
          suppressNextChange = false;
          vscode.window.showErrorMessage(`🥔 Save failed: ${e.message}`);
        }
        return;
      }
      if (msg.type === 'saveAs' && typeof msg.html === 'string') {
        try {
          const uri = await promptAndWrite(msg.html, msg.name, path.dirname(document.uri.fsPath));
          if (!uri) return; // user cancelled — leave dirty
          vscode.window.showInformationMessage(`🥔 Saved: ${path.basename(uri.fsPath)}`);
          // Close this editor and open the new file in our custom editor.
          await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
          await vscode.commands.executeCommand('vscode.openWith', uri, PotatoEditorProvider.viewType);
        } catch (e) {
          vscode.window.showErrorMessage(`🥔 Save As failed: ${e.message}`);
        }
      }
    });

    webviewPanel.onDidDispose(() => { sub.dispose(); changeSub.dispose(); });
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
    // For an untitled diagram, Save and Save As are the same — both have
    // to prompt because there's no anchored path yet.
    if ((msg.type === 'save' || msg.type === 'saveAs') && typeof msg.html === 'string') {
      const workspaceRoot = (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0])
        ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
      try {
        const uri = await promptAndWrite(msg.html, msg.name || 'diagram', workspaceRoot);
        if (!uri) return; // user cancelled — leave dirty
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
