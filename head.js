const { createReadStream } = require('fs');
const { stderr, stdout, stdin } = process;
const { head } = require('./src/headLib.js');

const displayResult = function (result) {
  stdout.write(result.output);
  stderr.write(result.error);
};

const main = function () {
  const [, , ...userOptions] = process.argv;
  const reader = { createReadStream, stdin };
  head(userOptions, reader, displayResult);
};

main();
