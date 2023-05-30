import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "dls-transform.helloWorld",
    async () => {
      vscode.window.showInformationMessage("Hello World");
      const lessTokenFilePath = path.join(
        vscode.workspace.rootPath || "",
        "less-vite/src/dlsToken.less"
      );
      const useLessDlsPath = path.join(
        vscode.workspace.rootPath || "",
        "less-vite/src/index.less"
      );
      let lessTokenContent = "";
      let lessDlsContent = "";
      lessDlsContent = fs.readFileSync(useLessDlsPath, "utf-8");
      // 读取 dlsToken.less 文件内容
      try {
        lessTokenContent = fs.readFileSync(lessTokenFilePath, "utf-8");
      } catch (error) {
        console.error(`Failed to read dlsToken.less file: ${error}`);
      }
      const tokenMap: any = parseLessTokenContent(lessTokenContent);
      await replaceColorsInFile(useLessDlsPath, tokenMap);
    }
  );
  async function replaceColorsInFile(
    filePath: string,
    tokenMap: { [key: string]: string }
  ) {
    const fileUri = vscode.Uri.file(filePath);
    const fileContent = await vscode.workspace.fs.readFile(fileUri);
    const fileText = Buffer.from(fileContent).toString();
    let updatedText = fileText;
    const keys = Object.keys(tokenMap);
    keys.forEach((colorToReplace) => {
      const newColor = tokenMap[colorToReplace];
      const regex = new RegExp(colorToReplace, "g");
      updatedText = updatedText.replace(regex, newColor);
    });

    const updatedContent = Buffer.from(updatedText, "utf-8");
    await vscode.workspace.fs.writeFile(fileUri, updatedContent);
  }

  // 解析 dlsToken.less 文件内容，生成颜色值和对应的 dlsToken 映射关系
  function parseLessTokenContent(content: string): { [key: string]: string } {
    const tokenMap: { [key: string]: string } = {};
    const regex = /@(.*?):\s*(.*?);/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const colorToken = match[1];
      const colorValue = match[2];
      tokenMap[colorValue] = `@${colorToken}`;
    }
    return tokenMap;
  }

  context.subscriptions.push(disposable);
}

export function deactivate() {}
