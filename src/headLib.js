const fs = require("fs");

const extractFirstNLines = function(lines, parsedOptions) {
  if (parsedOptions.isError) return "";
  const listOfLines = lines.split("\n");
  const extractedLines = listOfLines.slice(0, parsedOptions.num).join("\n");
  return extractedLines;
};

const loadContents = function(parsedOptions, fs) {
  const path = parsedOptions.filePaths[0];
  if (!fs.existsSync(`${path}`, "utf8")) {
    parsedOptions.isError = true;
    return { error: `head: ${path}: No such file or directory` };
  }
  return { lines: fs.readFileSync(`${path}`, "utf8") };
};

const parseOptions = function(userOptions) {
  if (userOptions[0] === `-n`) {
    if (userOptions[1] >= 1)
      return {
        filePaths: userOptions.slice(2),
        num: userOptions[1],
        isError: false
      };
  }
  return { filePaths: userOptions, num: 10, isError: false };
};

const performHeadOperation = function(userOptions, fs) {
  const parsedOptions = parseOptions(userOptions);
  const lines = loadContents(parsedOptions, fs);
  const extractedLines = extractFirstNLines(lines.lines, parsedOptions);
  return { output: extractedLines, error: lines.error };
};

module.exports = {
  parseOptions,
  loadContents,
  extractFirstNLines,
  performHeadOperation
};
