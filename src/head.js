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

const loadContents = function(fileSys, paths, errorStatus) {
  const content = {};
  if (!fileSys.exists(`${paths[0]}`, "utf8")) {
    content.error = `head: ${paths[0]}: No such file or directory`;
    errorStatus.isError = true;
    return content;
  }
  content.lines = fileSys.reader(`${paths[0]}`, "utf8");
  return content;
};

const parseOptions = function(userOptions) {
  return { filePaths: userOptions, num: 10 };
};

module.exports = {
  parseOptions,
  loadContents,
  extractFirstNLines,
  joinLines
};
