const extractFirstNLines = function(parsedOptions, contents) {
  const minLineCount = 1;
  if (parsedOptions.num < minLineCount) {
    return {
      output: '',
      error: `head: illegal line count -- ${parsedOptions.num}`
    };
  }
  const listOfLines = contents.split('\n');
  const firstIndex = 0;
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

const onLoading = function(write, err, content) {
  const index = 0;
  if (err) {
    write('', `head: ${this.filePaths[index]}: No such file or directory`);
    return;
  }
  const extractedLines = extractFirstNLines(this, content);
  write(extractedLines.output, extractedLines.error);
};

const onLoadFromStdin = function(write, count, stdin, content) {
  const extractedLines = extractFirstNLines(this, content);
  write(extractedLines.output, extractedLines.error);
  if (isNthNewLine(content, count)) {
    --count.num;
    return;
  }
  stdin.pause();
};

const loadLinesFromStdin = function(parsedOptions, write, stdin) {
  const count = { num: parsedOptions.num };
  stdin.setEncoding('utf8');
  stdin.on('data', onLoadFromStdin.bind(parsedOptions, write, count, stdin));
};

const loadFirst10Lines = function(parsedOptions, readFile, write, stdin) {
  const index = 0;
  const path = parsedOptions.filePaths[index];
  if (!path) {
    loadLinesFromStdin(parsedOptions, write, stdin);
    return;
  }
  readFile(path, 'utf8', onLoading.bind(parsedOptions, write));
};

const parseOptions = function(userOptions) {
  let index = 0;
  const unwantedArgsCount = 2;
  if (userOptions[index] === '-n') {
    return {
      filePaths: userOptions.slice(unwantedArgsCount),
      num: userOptions[++index]
    };
  }
  return { filePaths: userOptions, num: 10 };
};

const head = function(userOptions, readFile, write, stdin) {
  const parsedOptions = parseOptions(userOptions);
  if (parsedOptions.error) {
    return write('', parsedOptions.error);
  }

  loadFirst10Lines(parsedOptions, readFile, write, stdin);
};

module.exports = {
  parseOptions,
  loadFirst10Lines,
  extractFirstNLines,
  head
};
