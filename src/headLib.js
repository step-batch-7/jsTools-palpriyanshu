const extractFirstNLines = function(parsedOptions, contents) {
  const firstIndex = 0;
  const listOfLines = contents.split('\n');
  const extractedLines = listOfLines
    .slice(firstIndex, parsedOptions.num)
    .join('\n');
  return { output: extractedLines, error: '' };
};

const isNthNewLine = function(content, count) {
  const lastIndex = -1;
  const minCount = 1;
  return content.slice(lastIndex) === '\n' && count.num !== minCount;
};

const onLoading = function(readerWriter, err, content) {
  const index = 0;
  if (err) {
    readerWriter.write(
      '',
      `head: ${this.filePaths[index]}: No such file or directory`
    );
    return;
  }
  const extractedLines = extractFirstNLines(this, content);
  readerWriter.write(extractedLines.output, extractedLines.error);
};

const onLoadFromStdin = function(readerWriter, count, content) {
  const extractedLines = extractFirstNLines(this, content);
  readerWriter.write(extractedLines.output, extractedLines.error);
  if (isNthNewLine(content, count)) {
    --count.num;
    return;
  }
  readerWriter.stdin.emit('end');
};

const loadLinesFromStdin = function(parsedOptions, readerWriter) {
  const count = { num: parsedOptions.num };
  readerWriter.stdin.setEncoding('utf8');
  readerWriter.stdin.on(
    'data',
    onLoadFromStdin.bind(parsedOptions, readerWriter, count)
  );
};

const loadFirst10Lines = function(parsedOptions, readerWriter) {
  const index = 0;
  const path = parsedOptions.filePaths[index];
  if (!path) {
    loadLinesFromStdin(parsedOptions, readerWriter);
    return;
  }
  readerWriter.readFile(
    path,
    'utf8',
    onLoading.bind(parsedOptions, readerWriter)
  );
};

const isValidLineCount = function(parsedOptions) {
  const minLineCount = 1;
  return (
    +parsedOptions.num > minLineCount && Number.isInteger(+parsedOptions.num)
  );
};

const parseOptions = function(userOptions) {
  let index = 0;
  if (userOptions[index] === '-n') {
    const [, , ...paths] = userOptions;
    return { filePaths: paths, num: userOptions[++index] };
  }
  return { filePaths: userOptions, num: 10 };
};

const head = function(userOptions, readerWriter) {
  const parsedOptions = parseOptions(userOptions);
  if (parsedOptions.error) {
    readerWriter.write('', parsedOptions.error);
    return;
  }
  if (!isValidLineCount(parsedOptions)) {
    readerWriter.write('', `head: illegal line count -- ${parsedOptions.num}`);
    return;
  }
  loadFirst10Lines(parsedOptions, readerWriter);
};

module.exports = {
  parseOptions,
  loadFirst10Lines,
  extractFirstNLines,
  head
};
