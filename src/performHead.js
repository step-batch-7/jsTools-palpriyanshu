const fs = require("fs");
const {
  parseOptions,
  loadContents,
  extractFirstNLines,
  joinLines
} = require("./head.js");

const getResult = function(lines, joinedLines) {
  const result = {};
  result.key = console.log;
  result.value = joinedLines;
  if (lines.error) {
    result.key = console.error;
    result.value = lines.error;
  }
  return result;
};

const performHeadOperation = function(userOptions) {
  const fileSys = {
    exists: fs.existsSync,
    reader: fs.readFileSync
  };
  let errorStatus = { isError: false };
  const parsedOptions = parseOptions(userOptions, errorStatus);
  const lines = loadContents(fileSys, parsedOptions.filePaths, errorStatus);

  const extractedLines = extractFirstNLines(
    lines.lines,
    parsedOptions.num,
    errorStatus
  );
  const joinedLines = joinLines(extractedLines.lines, errorStatus);
  return getResult(lines, joinedLines);
};

module.exports = { performHeadOperation };
