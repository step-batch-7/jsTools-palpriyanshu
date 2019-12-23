const fs = require("fs");
const {
  parseOptions,
  loadLines,
  extractFirstNLines,
  joinLines,
  generateErrorMsg
} = require("./head.js");

const performHeadOperation = function(userOptions) {
  const fileSys = {
    exists: fs.existsSync,
    reader: fs.readFileSync
  };
  let errorStatus = { isError: false };
  const parsedOptions = parseOptions(userOptions, errorStatus);
  const lines = loadLines(
    fileSys,
    parsedOptions.filePaths,
    errorStatus,
    generateErrorMsg
  );

  const extractedLines = extractFirstNLines(
    lines,
    parsedOptions.num,
    errorStatus
  );
  return joinLines(extractedLines.lines, errorStatus);
};

module.exports = { performHeadOperation };
