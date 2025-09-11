const vscode = require("vscode");

class MathPanel {
  constructor(context, panel) {
    this._panel = panel;
    // Set the webview's initial html content
    this._update();

    this._panel.onDidDispose(
      () => {
        this._panel = undefined;
      },
      null,
      context.subscriptions
    );

    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "clipboard":
            vscode.env.clipboard.writeText(message.text);
            return;
        }
      },
      undefined,
      context.subscriptions
    );
  }

  static createOrShow(context) {
    const column = vscode.ViewColumn.Beside;

    if (MathPanel.currentPanel) {
      MathPanel.currentPanel._panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      "sidemath",
      "Sidemath",
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    MathPanel.currentPanel = new MathPanel(context, panel);
  }

  _update() {
    this._panel.webview.html = getWebviewContent();
  }
}

function activate(context) {
  const commandOpenSelectionInPanel = vscode.commands.registerCommand(
    "sidemath.open_selection",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (editor.selections.length === 1 && editor.selection.isEmpty) {
        const formula = editor.document.lineAt(
          editor.selection.active.line
        ).text;

        MathPanel.createOrShow(context);
        MathPanel.currentPanel.webview.postMessage({
          command: "edit",
          text: formula,
        });
      }
    }
  );

  const commandOpenPanel = vscode.commands.registerCommand(
    "sidemath.open",
    function () {
      MathPanel.createOrShow(context);
    }
  );

  context.subscriptions.push(commandOpenPanel);
  context.subscriptions.push(commandOpenSelectionInPanel);
}

function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="style-src 'self' 'unsafe-inline';">
  <script defer src="https://cdn.jsdelivr.net/npm/mathlive"></script>
  <title>Edit Formula</title>
</head>
<body>
  <h1>Type your formula here:</h1>
  <div>
    <math-field
      id="formula"
      style="font-size: 2em; width: 100%"
      placeholder="\\text{Enter a formula}"
    />
  </div>
  <button onclick="copyLatex()">Copy as LaTeX</button>
  <button onclick="copyTypst()">Copy as Typst</button>
  <script>
    const vscode = acquireVsCodeApi();
    const mf = document.getElementById("formula");
    mf.mathVirtualKeyboardPolicy = "sandboxed";
    mf.addEventListener("focusin", evt => window.mathVirtualKeyboard.show());
    mf.addEventListener("focusout", evt => window.mathVirtualKeyboard.hide());

    window.addEventListener("message", msg => {
      if (msg.command === "edit") {
        mf.setValue(msg.text)
      }
    });

    function copyLatex(){ vscode.postMessage({command: 'clipboard', text: mf.getValue('latex')}) };
    function copyTypst(){ vscode.postMessage({command: 'clipboard', text: mf.getValue('typst')}) };
  </script>
</body>
</html>`;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
