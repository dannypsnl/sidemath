const vscode = require("vscode");

function activate(context) {
  const disposable = vscode.commands.registerCommand(
    "sidemath.open",
    function () {
      vscode.window.showInformationMessage("edit your formula in sidemath");
      const panel = vscode.window.createWebviewPanel(
        "sidemath",
        "Math on your side",
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
            case "formula":
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
	<script defer src="https://cdn.jsdelivr.net/npm/mathlive"></script>
  <title>Edit Formula</title>
</head>
<body>
	<math-field id="formula" style="font-size: 2em; width: 100%">x^2+y^2=1</math-field>
	<script>
		const vscode = acquireVsCodeApi();
		const mf = document.getElementById("formula");
    mf.addEventListener('input', evt =>
			vscode.postMessage({
				command: 'formula',
				text: evt.target.value
    	})
    );
  </script>
</body>
</html>`;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
