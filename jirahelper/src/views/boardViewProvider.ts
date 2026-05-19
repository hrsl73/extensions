import * as vscode from "vscode";
import * as path from "path";

export class BoardViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "githubBoardView";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "update-board-url": {
          vscode.window.showInformationMessage("Board URL configured!");
          break;
        }
        case "open-url-external": {
          vscode.env.openExternal(vscode.Uri.parse(data.value));
          break;
        }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "resources", "reset.css"),
    );
    const styleVscodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "resources", "vscode.css"),
    );
    const styleBoardUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "resources", "board.css"),
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "resources", "board.js"),
    );

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVscodeUri}" rel="stylesheet">
				<link href="${styleBoardUri}" rel="stylesheet">
				<title>GitHub Projects Board</title>
			</head>
			<body>
				<div class="board-container">
					<h1>GitHub Projects Board</h1>
					
					<div class="board-controls">
						<p>Configure your GitHub Projects board URL:</p>
						<input type="text" id="boardUrl" placeholder="Enter your GitHub Projects board URL..." />
						<button id="saveBoardUrl">Save URL</button>
					</div>

					<div id="board-content" class="board-content">
						<p class="placeholder">👋 Welcome! Configure your board URL above to get started.</p>
						<p class="info">The board will be embedded here once you provide the URL.</p>
					</div>
				</div>

				<script src="${scriptUri}"></script>
			</body>
			</html>`;
  }

  public addMessage(message: string) {
    if (this._view) {
      this._view.webview.postMessage({ type: "add-message", value: message });
    }
  }
}
