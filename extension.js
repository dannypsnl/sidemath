// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "sidemath" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
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

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
