const fs = require("fs");
const fileSys = {
  exists: fs.existsSync,
  readFile: fs.readFileSync
};

class Head {
  constructor() {
    this.num = 10;
    this.filePaths = [];
  }

  loadLines(parsedOptions, fileSys) {
    console.log(parsedOptions.filePaths[0]);
    if (!fs.existsSync(parsedOptions.filePaths[0])) {
    }
    return fs.readFileSync(parsedOptions.filePaths[0], "utf8");
  }

  parsedOptions(userOptions) {
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
