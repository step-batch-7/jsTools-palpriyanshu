const extractFirstNLines = function (contents, lineCount) {
  const firstIndex = 0;
  const listOfLines = contents.split('\n');
  const extractedLines = listOfLines.slice(firstIndex, lineCount);
  return extractedLines.join('\n');
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
    return {fileName, num: userOptions[++index]};
  }
  return {fileName: userOptions.join(''), num: 10};
};

const head = function (userOptions, streamPicker, StreamReader, displayResult) {
  const headOptions = parseOptions(userOptions);

  if (!isValidLineCount(headOptions.num)) {
    displayResult({output: '', 
      error: `head: illegal line count -- ${headOptions.num}`});
    return;
  }

  const readableStream = streamPicker.pick(headOptions.fileName);

  const afterReading = (content) => {
    const headLines = extractFirstNLines(content.lines, headOptions.num); 
    displayResult({output: headLines, error: content.error});
  };

  const streamReader = new StreamReader(readableStream);
  
  streamReader.read(headOptions.num, afterReading);
};

module.exports = {
  parseOptions,
  isValidLineCount,
  extractFirstNLines,
  head
};
