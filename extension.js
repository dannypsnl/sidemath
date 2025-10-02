const vscode = require("vscode");
const { tex2typst, typst2tex } = require("tex2typst");

class MathPanel {
  currentPanel = undefined;

  constructor(context, panel) {
    this._panel = panel;
    // Set the webview's initial html content
    this._update();

    this._panel.onDidDispose(
      () => {
        this._panel = undefined;
        MathPanel.currentPanel = undefined;
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
          case "clipboard-typst":
            let formula = message.text;
            formula = formula.replace("\\lang", "\\langle");
            formula = formula.replace("\\rang", "\\rangle");
            vscode.env.clipboard.writeText(tex2typst(formula));
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

  editFormula(languageId, formula) {
    switch (languageId) {
      case "typst":
        this._panel.webview.postMessage({
          command: "edit",
          text: typst2tex(formula),
        });
        break;

      default:
        this._panel.webview.postMessage({
          command: "edit",
          text: formula,
        });
        break;
    }
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
      if (editor && editor.selections.length === 1) {
        let formula = "";
        if (editor.selection.isEmpty) {
          formula = editor.document.lineAt(editor.selection.active.line).text;
        } else {
          formula = editor.document.getText(
            new vscode.Range(editor.selection.start, editor.selection.end)
          );
        }
        console.log({ action: "Edit", formula });
        MathPanel.createOrShow(context);
        MathPanel.currentPanel.editFormula(editor.document.languageId, formula);
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

    window.addEventListener("message", evt => {
      const msg = evt.data;
      switch (msg.command) {
        case 'edit':
          mf.setValue(msg.text);
          break;
      }
    });

    function copyLatex(){ vscode.postMessage({command: 'clipboard', text: mf.getValue('latex')}) };
    function copyTypst(){ vscode.postMessage({command: 'clipboard-typst', text: mf.getValue('latex')}) };
  </script>
</body>
</html>`;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
