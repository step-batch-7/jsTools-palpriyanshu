const {createReadStream} = require('fs');
const {stderr, stdout, stdin} = process;
const {head} = require('./src/headLib.js');
const StreamPicker = require('./src/streamPicker.js');
const StreamReader = require('./src/streamReader.js');

const displayResult = function (result) {
  stdout.write(result.output);
  stderr.write(result.error);
};

const main = function () {
  const [, , ...userOptions] = process.argv;
  const streamPicker = new StreamPicker(createReadStream, stdin);
  head(userOptions, streamPicker, StreamReader, displayResult);
};

main();
