const fs = require("fs");

const extractFirstNLines = function(loadedLines, parsedOptions) {
  if (parsedOptions.num < 1)
    return {
      isError: true,
      error: `head: illegal line count -- ${parsedOptions.num}`
    };
  const listOfLines = loadedLines.lines.split("\n");
  const extractedLines = listOfLines.slice(0, parsedOptions.num).join("\n");
  return { lines: extractedLines };
};

const loadContents = function(parsedOptions, fs) {
  const path = parsedOptions.filePaths[0];
  if (!fs.existsSync(`${path}`)) {
    return { isError: true, error: `head: ${path}: No such file or directory` };
  }
  return { lines: fs.readFileSync(`${path}`, "utf8"), isError: false };
};

const parseOptions = function(userOptions) {
  if (userOptions[0] === `-n`)
    return {
      filePaths: userOptions.slice(2),
      num: userOptions[1],
      isError: false
    };
  return { filePaths: userOptions, num: 10, isError: false };
};

const performHeadOperation = function(userOptions, fs) {
  const parsedOptions = parseOptions(userOptions);
  if (parsedOptions.isError) return { error: parsedOptions.error };

  const loadedLines = loadContents(parsedOptions, fs);
  if (loadedLines.isError) return { error: loadedLines.error };

  const extractedLines = extractFirstNLines(loadedLines, parsedOptions);

  return { output: extractedLines.lines, error: extractedLines.error };
};

module.exports = {
  parseOptions,
  loadContents,
  extractFirstNLines,
  performHeadOperation
};
