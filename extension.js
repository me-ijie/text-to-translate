// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const editContent = require('./editContent');

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

    // 用于保存 待翻译的文本
    let holdSpace = []
    // 遍历当前文件/文件夹下的文件
    const modifyFiles = (resources) => {

      for (let resource of resources) {
        let filePath = resource.fsPath || resource
        let stats = fs.statSync(filePath);
        let fileExtension = filePath.split('.').at(-1)
        if (stats.isFile() && fileExtension === 'vue') {
          try {
            let fileContent = fs.readFileSync(filePath, 'utf8');
            let content = editContent(fileContent, holdSpace)
            console.log('holdSpace', holdSpace)
            fs.writeFileSync(filePath, content);

            // 打开文件
            // const openPath = vscode.Uri.file(filePath);
            // vscode.workspace.openTextDocument(openPath).then(doc => {
            //   vscode.window.showTextDocument(doc);
            // });
          } catch (e) {
            console.log('error:', e)
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

      return holdSpace
    }

    // 写入待翻译文本文档
    const storeForTranslation = async (content) => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
    
      if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace is open');
        return;
      }
      
      const allFiles = await vscode.workspace.findFiles('src/i18n/**/*', '**/node_modules/**');
      const targetFile = allFiles.find(file => path.basename(file.fsPath) === 'i18n-translate-template.txt');
      if (!targetFile) {
        console.log('allfiles', allFiles)
        vscode.window.showErrorMessage('File i18n-translate-template not found in the workspace');
        return;
      }

      fs.writeFileSync(targetFile.fsPath, content);
    }
    if (commandArgs[1][0] instanceof vscode.Uri) {
      modifyFiles(commandArgs[1])
    }
    console.log('holdspace after', holdSpace)
    if (holdSpace.length) {
      storeForTranslation(holdSpace.join('\n'))
    }

    vscode.window.showInformationMessage('translation completed!')
  })
  disposable.push(item)

	context.subscriptions.push(...disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
