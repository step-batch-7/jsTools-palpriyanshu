const fs = require("fs");
const { performHeadOperation } = require("./src/headLib.js");

const main = function() {
  const userOptions = process.argv.slice(2);
  const result = performHeadOperation(userOptions, fs);
  result.output && process.stdout.write(result.output);
  result.error && process.stderr.write(result.error);
};

main();
