const fs = require("fs");

class Head {
  constructor() {
    this.num = 10;
    this.filePaths = [];
  }

  extractFirstNLines(lines) {
    return lines
      .split("\n")
      .filter((line, index) => index < this.num)
      .join("\n");
  }

  loadLines(fileSys, path) {
    if (!fileSys.exists(path, "utf8")) {
      return (this.error = `head: ${path}: No such file or directory`);
    }
    const lines = fileSys.reader(path, "utf8");
    return { lines: [[lines]], num: this.num, filePath: [path] };
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

  filterUserOptions(args) {
    return args.slice(2);
  }
}

module.exports = Head;
