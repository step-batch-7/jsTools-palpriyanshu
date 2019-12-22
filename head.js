const { Head, generateErrorMsg } = require("./src/head.js");
const fs = require("fs");

const main = function() {
  const head = new Head();
  const fileSys = {
    exists: fs.existsSync,
    reader: fs.readFileSync
  };
  const userOptions = process.argv.slice(2);
  const parsedOptions = head.parseOptions(userOptions);
  const lines = head.loadLines(
    fileSys,
    parsedOptions.filePaths,
    generateErrorMsg
  );
  console.log(head.joinLines(lines));
};

main();
