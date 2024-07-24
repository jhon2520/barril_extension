const vscode = require('vscode');
const fs = require("fs");
const path = require("path");





const createFile = async () => {

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage("Barrel generator: No editor found.");
		return;
	}

	// get config
	const config = vscode.workspace.getConfiguration("barrel-files-generator");
	const quoteValue = config.get("quote");


	// get path
	let activeTextEditor = vscode.window.activeTextEditor;
	let language = activeTextEditor.document.languageId;
	const filePath = editor.document.fileName;
	const directoryPath = path.dirname(filePath);

	if(language != "dart"){
		vscode.window.showErrorMessage("current language is not supported")
		return;
	}

	let filesNames = [];
	fs.readdir(directoryPath, (err, files) => {
		if (err) {
			vscode.window.showErrorMessage(`Barrel generatorerror: ${err.message}`);
			return;
		}
		filesNames = files;

	});

	const fileName = await vscode.window.showInputBox({
		prompt: "Enter the Barrel name file",
		placeHolder: "index",
		value: "index"
	});

	if (!fileName) {
		vscode.window.showInformationMessage("Barrel generator: Process cancelled.")
		return;
	}

	const newFilePath = path.join(directoryPath, fileName);
	fs.writeFile(`${newFilePath}.dart`, filesNames.map(e => {
			if (!e.includes(fileName)) {
				return `export ${quoteValue}${e}${quoteValue};\n`
			}
		})
		.toString().replaceAll(",", ""), (err) => {
			if (err) {
				vscode.window.showErrorMessage("Barrel generator: Error creating file");
			}
			vscode.window.showInformationMessage(`Barrel generator: File ${fileName} created in ${language}`);
		});
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const disposable = vscode.commands.registerCommand('barrel-files-generator.barrelGenerator', async () => {
		createFile();
	});
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}


