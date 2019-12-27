const fs = require("fs");
const { stderr, stdout, stdin } = require("process");
const { head } = require("./src/headLib.js");

const write = function(output, error) {
  stdout.write(output);
  stderr.write(error);
};

const read = function(onLoading) {
  stdin.setEncoding("utf8");
  stdin.on("data", onLoading);
};

const main = function() {
  const userOptions = process.argv.slice(2);
  head(userOptions, fs.readFile, write, read);
};

main();
