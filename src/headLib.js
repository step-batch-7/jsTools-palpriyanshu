const fs = require("fs");

const extractFirstNLines = function(loadedLines, parsedOptions) {
  if (parsedOptions.num < 1)
    return { error: `head: illegal line count -- ${parsedOptions.num}` };
  const listOfLines = loadedLines.lines.split("\n");
  const extractedLines = listOfLines.slice(0, parsedOptions.num).join("\n");
  return { lines: extractedLines };
};

const loadContents = function(parsedOptions, fs) {
  const path = parsedOptions.filePaths[0];
  if (!fs.existsSync(`${path}`))
    return { error: `head: ${path}: No such file or directory` };
  return { lines: fs.readFileSync(`${path}`, "utf8") };
};

const parseOptions = function(userOptions) {
  if (userOptions[0] === `-n`)
    return {
      filePaths: userOptions.slice(2),
      num: userOptions[1]
    };
  return { filePaths: userOptions, num: 10 };
};

const performHeadOperation = function(userOptions, fs) {
  const parsedOptions = parseOptions(userOptions);
  if (parsedOptions.error) return { error: parsedOptions.error };

  const loadedLines = loadContents(parsedOptions, fs);
  if (loadedLines.error) return { error: loadedLines.error };

  const extractedLines = extractFirstNLines(loadedLines, parsedOptions);

  return { output: extractedLines.lines, error: extractedLines.error };
};

module.exports = {
  parseOptions,
  loadContents,
  extractFirstNLines,
  performHeadOperation
};
