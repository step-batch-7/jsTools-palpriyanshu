const { performHeadOperation } = require("./src/performHead.js");

const main = function() {
  const userOptions = process.argv.slice(2);
  const result = performHeadOperation(userOptions);
  result.key(result.value);
};

main();
