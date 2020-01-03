const extractFirstNLines = function (contents, lineCount) {
  const firstIndex = 0;
  const listOfLines = contents.split('\n');
  const extractedLines = listOfLines.slice(firstIndex, lineCount);
  return extractedLines.join('\n');
};

const readStream = function (stream, lineCount, afterReading) {
  stream.setEncoding('utf8');
  const content = { lines: '', error: '' };
  let count = 0;
  const onData = (data) => {
    count++;
    if (count >= lineCount) {
      stream.destroy();
    }
    content.lines = data;
    afterReading(content);
  };
  stream.on('data', onData);

  stream.on('error', (err) => {
    content.error = `head: ${err.path}: No such file or directory`;
    afterReading(content);
  });
};

const isValidLineCount = function (count) {
  const minLineCount = 1;
  return (
    +count > minLineCount && Number.isInteger(+count)
  );
};

const parseOptions = function (userOptions) {
  let index = 0;
  if (userOptions[index] === '-n') {
    const [, , fileName] = userOptions;
    return { fileName, num: userOptions[++index] };
  }
  return { fileName: userOptions.join(''), num: 10 };
};

const head = function (userOptions, streamPicker, displayResult) {
  const headOptions = parseOptions(userOptions);

  if (!isValidLineCount(headOptions.num)) {
    displayResult({ output: '', 
      error: `head: illegal line count -- ${headOptions.num}` });
    return;
  }

  const readableStream = streamPicker.pick(headOptions.fileName);

  const afterReading = (content) => {
    const headLines = extractFirstNLines(content.lines, headOptions.num); 
    displayResult({ output: headLines, error: content.error });
  };
  
  readStream(readableStream, headOptions.num, afterReading);
};

module.exports = {
  parseOptions,
  isValidLineCount,
  readStream,
  extractFirstNLines,
  head
};
