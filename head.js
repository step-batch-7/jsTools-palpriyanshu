const fs = require("fs");
const { head } = require("./src/headLib.js");

const print = function(output, error) {
  process.stdout.write(output);
  process.stderr.write(error);
};

const main = function() {
  const userOptions = process.argv.slice(2);
  head(userOptions, fs.readFile, print);
};

main();
