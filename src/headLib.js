const extractFirstNLines = function(parsedOptions, contents) {
  if (parsedOptions.num < 1)
    return {
      output: "",
      error: `head: illegal line count -- ${parsedOptions.num}`
    };
  const listOfLines = contents.split("\n");
  const extractedLines = listOfLines.slice(0, parsedOptions.num).join("\n");
  return { output: extractedLines, error: "" };
};

const onLoading = function(write, err, content) {
  if (err) {
    write("", `head: ${this.filePaths[0]}: No such file or directory`);
    return;
  }
  const extractedLines = extractFirstNLines(this, content);
  write(extractedLines.output, extractedLines.error);
};

const loadFirst10Lines = function(parsedOptions, readFile, write, read) {
  const path = parsedOptions.filePaths[0];
  if (!path) {
    read(onLoading.bind(parsedOptions, write, ""));
    return;
  }
  readFile(path, "utf8", onLoading.bind(parsedOptions, write));
};

const parseOptions = function(userOptions) {
  if (userOptions[0] == "-n")
    return {
      filePaths: userOptions.slice(2),
      num: userOptions[1]
    };
  return { filePaths: userOptions, num: 10 };
};

const head = function(userOptions, readFile, write, read) {
  const parsedOptions = parseOptions(userOptions);
  if (parsedOptions.error) return write("", parsedOptions.error);

  loadFirst10Lines(parsedOptions, readFile, write, read);
};

module.exports = {
  parseOptions,
  loadFirst10Lines,
  extractFirstNLines,
  head
};
