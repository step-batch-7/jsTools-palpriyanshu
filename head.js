const Head = require("./src/header.js");

const main = function() {
  const header = new Head();
  const userOptions = header.filterUserOptions(process.argv);
  const parsedOptions = header.parsedOptions(userOptions);
};

main();
