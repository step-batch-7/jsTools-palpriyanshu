const loadFirst10Lines = function(parsedOptions, readFile, print) {
  const path = parsedOptions.filePaths[0];
  readFile(path, "utf8", (err, content) => {
    if (err) {
      return print("", `head: ${path}: No such file or directory`);
    }
    const extractedLines = extractFirstNLines(parsedOptions, content);
    print(extractedLines.output, extractedLines.error);
  });
};

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

const parseOptions = function(userOptions) {
  if (userOptions[0] === `-n`)
    return {
      filePaths: userOptions.slice(2),
      num: userOptions[1]
    };
  return { filePaths: userOptions, num: 10 };
};

const head = function(userOptions, readFile, print) {
  const parsedOptions = parseOptions(userOptions);
  if (parsedOptions.error) return print("", parsedOptions.error);

  loadFirst10Lines(parsedOptions, readFile, print);
};

module.exports = {
  parseOptions,
  loadFirst10Lines,
  extractFirstNLines,
  head
};
