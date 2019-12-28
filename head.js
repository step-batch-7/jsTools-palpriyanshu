const { readFile } = require('fs');
const { stderr, stdout, stdin } = process;
const { head } = require('./src/headLib.js');

const write = function(output, error) {
  stdout.write(output);
  stderr.write(error);
};

const main = function() {
  const readerWriter = { readFile, stdin, write };
  const [, , ...userOptions] = process.argv;
  head(userOptions, readerWriter);
};

main();
