const fs = require("fs");
const { stderr } = require("process");

const generateErrorMsg = function(error) {
  stderr.write(`${error}\n`);
};

class Head {
  constructor() {
    this.num = 10;
    this.filePaths = [];
    this.error = "";
  }

  joinLines(lines) {
    if (this.error !== "") return;
    return lines.lines[0].join("\n");
  }

  extractFirstNLines(lines, path) {
    const listOfLines = lines.split("\n");
    const extractedLines = listOfLines.slice(0, this.num);
    return { lines: [extractedLines], filePath: [path] };
  }

  loadLines(fileSys, path, generateErrorMsg) {
    if (!fileSys.exists(`${path}`, "utf8")) {
      this.error = `head: ${path}: No such file or directory`;
      return generateErrorMsg(this.error);
    }
    const lines = fileSys.reader(`${path}`, "utf8");
    return this.extractFirstNLines(lines, path);
  }

  parseOptions(userOptions) {
    const numIndex = userOptions.indexOf("-n");
    this.filePaths = userOptions;
    if (userOptions.includes("-n")) {
      this.num = userOptions[numIndex + 1];
      this.filePaths = userOptions.slice(2);
    }
    return { filePaths: this.filePaths, num: this.num };
  }
}

module.exports = { Head, generateErrorMsg };
