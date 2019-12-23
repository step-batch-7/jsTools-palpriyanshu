const { performHeadOperation } = require("./src/head.js");

const main = function() {
  const userOptions = process.argv.slice(2);
  const result = performHeadOperation(userOptions);
  result.output && process.stdout.write(result.output);
  result.error && process.stderr.write(result.error);
};

main();
