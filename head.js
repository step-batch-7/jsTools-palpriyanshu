const Head = require("./src/head.js");

const main = function() {
  const head = new Head();
  const userOptions = head.filterUserOptions(process.argv);
  const parsedOptions = head.parsedOptions(userOptions);
  const lines = head.loadLines(parsedOptions);
  const extractedLines = head.extractFirstNLines(lines);
};

main();
