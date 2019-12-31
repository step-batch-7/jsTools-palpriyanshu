const extractFirstNLines = function (contents, num) {
  const firstIndex = 0;
  const listOfLines = contents.split('\n');
  const extractedLines = listOfLines.slice(firstIndex, num);
  return extractedLines.join('\n');
};

const loadContents = function (stream, num, afterLoading) {
  stream.setEncoding('utf8');
  const content = { lines: '', error: '' };
  let count = 0;
  const onData = (data) => {
    count++;
    if (count >= num) {
      stream.pause();
    }
    content.lines = data;
  };
  stream.on('data', onData);

  stream.on('error', (err) => {
    content.error = `head: ${err.path}: No such file or directory`;
    afterLoading(content);
  });

  stream.on('end', () => afterLoading(content));
};

const selectReadStream = function (fileName, reader) {
  if (fileName) {
    return reader.createReadStream(fileName);
  }
  return reader.stdin;
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

const head = function (userOptions, reader, write) {
  const headOptions = parseOptions(userOptions);

  if (!isValidLineCount(headOptions.num)) {
    write({ output: '', 
      error: `head: illegal line count -- ${headOptions.num}` });
    return;
  }

  const readStream = selectReadStream(headOptions.fileName, reader);
  loadContents(readStream, headOptions.num, (content) => {
    const headLines = extractFirstNLines(content.lines, headOptions.num);
    write({ output: headLines, error: content.error });
  });
};

module.exports = {
  parseOptions,
  isValidLineCount,
  selectReadStream,
  loadContents,
  extractFirstNLines,
  head
};
