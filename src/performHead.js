const fs = require("fs");
const {
  parseOptions,
  loadContents,
  extractFirstNLines,
  joinLines
} = require("./head.js");

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
  if (joinedLines == undefined) joinLines = "";
  if (lines.error == undefined) lines.error = "";
  return { output: joinedLines, error: lines.error };
};

module.exports = { performHeadOperation };
