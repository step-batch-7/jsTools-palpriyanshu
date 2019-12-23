const fs = require("fs");
const { stderr } = require("process");

const generateErrorMsg = function(error) {
  stderr.write(`${error}\n`);
};

const joinLines = function(lines, errorStatus) {
  if (errorStatus.isError) return "";
  return lines[0].join("\n");
};

const extractFirstNLines = function(lines, num, errorStatus) {
  if (errorStatus.isError) return {};
  const listOfLines = lines.split("\n");
  const extractedLines = listOfLines.slice(0, num);
  return { lines: [extractedLines] };
};

const loadLines = function(fileSys, paths, errorStatus, generateErrorMsg) {
  if (!fileSys.exists(`${paths[0]}`, "utf8")) {
    error = `head: ${paths[0]}: No such file or directory`;
    errorStatus.isError = true;
    return generateErrorMsg(error);
  }
  const lines = fileSys.reader(`${paths[0]}`, "utf8");
  return lines;
};

const parseOptions = function(userOptions) {
  return { filePaths: userOptions, num: 10 };
};

module.exports = {
  parseOptions,
  loadLines,
  extractFirstNLines,
  joinLines,
  generateErrorMsg
};
