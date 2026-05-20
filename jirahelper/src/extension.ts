// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { BoardViewProvider } from "./views/boardViewProvider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "jirahelper" is now active!');

  // Register the BoardViewProvider
  const boardViewProvider = new BoardViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      BoardViewProvider.viewType,
      boardViewProvider,
    ),
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "jirahelper.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from JIRAHelper!");
    },
  );

  context.subscriptions.push(disposable);

  // Command to open the board view
  const openBoardCommand = vscode.commands.registerCommand(
    "jirahelper.openBoardView",
    () => {
      // The board view will open automatically in the sidebar
      vscode.window.showInformationMessage(
        "GitHub Projects board is now visible in the sidebar!",
      );
    },
  );

  context.subscriptions.push(openBoardCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
