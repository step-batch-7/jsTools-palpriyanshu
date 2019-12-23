const { performHeadOperation } = require("./src/performHead.js");

const main = function() {
  const userOptions = process.argv.slice(2);
  console.log(performHeadOperation(userOptions));
};

main();
