const { performHeadOperation } = require("./src/performHead.js");

const main = function() {
  const userOptions = process.argv.slice(2);
  const result = performHeadOperation(userOptions);
  console.log(result.output);
  console.error(result.error);
};

main();
