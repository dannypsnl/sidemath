const vscode = require("vscode");

function activate(context) {
  const disposable = vscode.commands.registerCommand(
    "sidemath.open",
    function () {
      let panel = vscode.window.createWebviewPanel(
        "sidemath",
        "Sidemath",
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(
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

      panel.onDidDispose(
        () => {
          panel = undefined;
        },
        null,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(disposable);
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
