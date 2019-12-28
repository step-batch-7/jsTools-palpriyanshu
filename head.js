const fs = require('fs');
const { stderr, stdout, stdin } = require('process');
const { head } = require('./src/headLib.js');

const write = function(output, error) {
  stdout.write(output);
  stderr.write(error);
};

const main = function() {
  const unwantedArgsCount = 2;
  const userOptions = process.argv.slice(unwantedArgsCount);
  head(userOptions, fs.readFile, write, stdin);
};

main();
