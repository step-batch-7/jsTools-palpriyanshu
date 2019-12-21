const fs = require("fs");
const { stdin, stdout, stderr } = process;

class Head {
  constructor() {
    this.num = 10;
    this.filePaths = [];
    this.error = [];
  }

  isWholeNum() {
    return Number.isInteger(this.num) && this.num > 0;
  }

  extractNLines(lines) {
    const extractedLines = lines
      .join("\n")
      .split("\n")
      .filter((lines, index) => {
        return index < this.num;
      });
    return extractedLines;
  }

  joinFirstNLines(lines) {
    if (this.num == 0 || !this.isWholeNum()) {
      this.error = `head: illegal line count -- ${this.num}`;
      this.generateErrorMsg();
    }

    if (this.filePaths.length == 1) {
      return this.extractNLines(lines).join("\n");
    }

    for (let idx = 0; idx < this.filePaths.length; idx++) {
      const msg = `==> ${this.filePaths[idx]} <==`;
      console.log(`${msg}\n${this.extractNLines(lines[idx]).join("\n")}\n`);
    }
    return;
  }

  generateErrorMsg() {
    stderr.write(this.error);
  }

  loadLines() {
    const lines = this.filePaths.map(file => {
      console.log(lines);
      if (!fs.existsSync(`${file}`)) {
        this.error = `head: ${this.filePaths}: No such file or directory`;
        this.generateErrorMsg();
        return;
      }
      const rows = fs.readFileSync(`${file}`, `utf8`);
      return [rows];
    });
    return this.joinFirstNLines(lines);
  }

  parseOption() {
    let lines;
    if (this.filePaths.length == 0) {
      return this.loadLinesFromStdIO();
    }
    return this.loadLines();
  }

  filterUserOptions(args) {
    const numIndex = args.indexOf("-n");
    if (args.includes("-n")) {
      this.num = args[numIndex + 1];
      return (this.filePaths = args.slice(2));
    }
    return (this.filePaths = args);
  }
}

const main = function() {
  const args = process.argv.slice(2);
  console.log(args);
  const head = new Head();
  const userOptions = head.filterUserOptions(args);
  const lines = head.parseOption(userOptions);
  console.log(lines);
};

main();
