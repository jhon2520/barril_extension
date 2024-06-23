const vscode = require('vscode');
const fs = require("fs");
const path = require("path");


// const showFilesInDirectory = () => {
// 	const editor = vscode.window.activeTextEditor;

// 	let filesNames = [];
// 	if (editor) {
// 		const filePath = editor.document.fileName;
// 		const directoryPath = path.dirname(filePath);


// 		fs.readdir(directoryPath, (err, files) => {
// 			if (err) {
// 				vscode.window.showErrorMessage(`Se ha generado un error: ${err.message}`);
// 				return;
// 			}
// 			vscode.window.showInformationMessage(`Files in ${directoryPath}: ${files.join(', ')}`)
// 			filesNames = files;
// 		});
// 	} else {
// 		vscode.window.showInformationMessage("No active editor found");
// 	}

// 	return filesNames;
// }

const createFile = async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage("No active editor found.");
		return;
	}

	let activeTextEditor = vscode.window.activeTextEditor;
	let language = activeTextEditor.document.languageId;
	vscode.window.showInformationMessage(`Curent lenguaje is ${language}`)
	const filePath = editor.document.fileName;
	const directoryPath = path.dirname(filePath);


	let filesNames = [];

	fs.readdir(directoryPath, (err, files) => {
		if (err) {
			vscode.window.showErrorMessage(`Se ha generado un error: ${err.message}`);
			return;
		}
		vscode.window.showInformationMessage(`Files in ${directoryPath}: ${files.join(' ')}`);
		filesNames = files;

	});

	const fileName = await vscode.window.showInputBox({
		prompt: "Enter the name of barril file",
		placeHolder: "index",
		value:"index"
	});

	if (!fileName) {
		vscode.window.showInformationMessage("File creation cancelled.")
		return;
	}



	const newFilePath = path.join(directoryPath, fileName);
	fs.writeFile(`${newFilePath}.dart`, filesNames.map(e => {
			if (!e.includes(fileName)) {
				return `export "${e}";\n`
			}
		})
		.toString().replaceAll(",", ""), (err) => {
			if (err) {
				vscode.window.showErrorMessage("Error creating file");
			}
			vscode.window.showInformationMessage(`file ${fileName} created`);
		});
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {




	// showFilesInDirectory();
	// createFile();

	const disposable = vscode.commands.registerCommand('barril-files-generator.BarrilGenerator', async () => {

		createFile();



		vscode.window.showInformationMessage('Hello World from Barril files generator!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
