// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "text-to-translate" is now active!');

	let disposable = []
  let item = vscode.commands.registerCommand('text-to-translate.helloWorld', function () {
    vscode.window.showInformationMessage('Hello World from text-to-translate!')
  })
  disposable.push(item)

  item = vscode.commands.registerCommand("text-to-translate.doTranslation", async (...commandArgs) => {
  
    const modifyFiles = (resources) => {
      for (let resource of resources) {
        let filePath = resource.fsPath || resource
        let stats = fs.statSync(filePath);
        if (stats.isFile()) {
          try {
            let fileContent = fs.readFileSync(filePath, 'utf8');
            let content = fileContent.replace(/(^\s*[a-zA-Z-]+=")([\u4e00-\u9fa5]+)"$/gi, ($1, $2) => {
              console.log('$2', $2)
              return ':$1$t(\'$2\')"'
            })
            console.log('content', content)
            fs.writeFileSync(filePath, content);
            // const relativePath = vscode.workspace.asRelativePath(resource)
            // const thisResource = vscode.Uri.parse(resource._formatted)
            // 打开文件
            const openPath = vscode.Uri.file(resource);
            vscode.workspace.openTextDocument(openPath).then(doc => {
              vscode.window.showTextDocument(doc);
            });
          } catch (e) {
            vscode.window.showInformationMessage('You do not have permission to access this file!')
          }

        } else if (stats.isDirectory()) {
          fs.readdir(filePath, (err, files) => {
            if (err) {
              console.error(err);
              return;
            }
            let newResources = files.map(file => {
              const newPath = path.join(filePath, file);
              return newPath
            });
            modifyFiles(newResources)
          });
        }
      }
    }
    if (commandArgs[1][0] instanceof vscode.Uri)  modifyFiles(commandArgs[1])
    vscode.window.showInformationMessage('translation completed!')
  })
  disposable.push(item)

    // vscode.commands.registerCommand('text-to-translate.addshortcuts', function () {

    
    // let shortcuts = [
    //   {
    //     "key": "ctrl+r",
    //     "command": "editor.action.insertSnippet",
    //     "args": { "snippet": "{{\\$t('${TM_SELECTED_TEXT}$1')}}" },
    //     "when": "editorTextFocus&&editorHasSelection",
    //     "name": "wrapText"
    //   },
    //   {
    //     "key": "ctrl+e",
    //     "command": "editor.action.insertSnippet",
    //     "args": { "snippet": "$1\\$t(${TM_SELECTED_TEXT})" },
    //     "when": "editorTextFocus&&editorHasSelection",
    //     "name": "wrapText2"
    //   },
    //   {
    //     "key": "ctrl+w",
    //     "command": "editor.action.insertSnippet",
    //     "args": { "snippet": "${TM_SELECTED_TEXT/([a-zA-Z-]+=\")([^\"]+)\"/:$1$t('$2')\"/g}" },
    //     "when": "editorTextFocus&&editorHasSelection",
    //     "name": "wrapText3"
    //   },
    //   {
    //     "key" : "ctrl+shift+u",
    //     "command" : "editor.action.transformToUppercase",
    //     "when" : "editorHasSelection",
    //     "name": "wrapText4"
    //   }
    // ]
    // for (let keyObj of shortcuts) {
    //   let name = keyObj['name']
    //   delete keyObj.name
    //   vscode.commands.executeCommand(`text-to-translate.${name}`, keyObj)
    // })


	context.subscriptions.push(...disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
