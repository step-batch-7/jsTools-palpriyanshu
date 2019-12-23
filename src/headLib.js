const fs = require("fs");

const extractFirstNLines = function(lines, parsedOptions) {
  if (parsedOptions.isError) return "";
  const listOfLines = lines.split("\n");
  const extractedLines = listOfLines.slice(0, parsedOptions.num).join("\n");
  return extractedLines;
};

const loadContents = function(parsedOptions, fs) {
  const content = {};
  const path = parsedOptions.filePaths[0];
  if (!fs.existsSync(`${path}`, "utf8")) {
    content.error = `head: ${path}: No such file or directory`;
    parsedOptions.isError = true;
    return content;
  }
  content.lines = fs.readFileSync(`${path}`, "utf8");
  return content;
};

const parseOptions = function(userOptions) {
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
