const fs = require("fs");
const assert = require("assert");
const {
  parseOptions,
  loadContents,
  extractFirstNLines,
  performHeadOperation
} = require("../src/headLib.js");

describe("parsedOptions", function() {
  it("should parsed the userOptions when only one file is given", function() {
    const expected = { filePaths: ["one.txt"], num: 10, isError: false };
    assert.deepStrictEqual(parseOptions(["one.txt"]), expected);
  });

  it("should parsed the userOptions when lines count and one file is given", function() {
    const expected = { filePaths: ["one.txt"], num: 3, isError: false };
    assert.deepStrictEqual(parseOptions(["-n", 3, "one.txt"]), expected);
  });

  it("should parsed the userOptions when more than one file is given", function() {
    const userOptions = ["one.txt", "two.txt"];
    const expected = {
      filePaths: ["one.txt", "two.txt"],
      num: 10,
      isError: false
    };
    assert.deepStrictEqual(parseOptions(userOptions), expected);
  });
});

describe("loadContents", function() {
  it("should load the lines when file exists", function() {
    const fs = {
      existsSync: function(path) {
        assert.equal(path, "path");
        return true;
      },
      readFileSync: function(path) {
        assert.equal(path, "path");
        return " ";
      }
    };
    const paths = { filePaths: ["path"] };
    assert.deepStrictEqual(loadContents(paths, fs), {
      lines: " "
    });
  });

  it("should not load the lines when file does not exists", function() {
    const fs = {
      existsSync: function(path) {
        assert.equal(path, "path");
        return false;
      }
    };

    const paths = { filePaths: ["path"] };
    assert.deepStrictEqual(loadContents(paths, fs), {
      error: `head: path: No such file or directory`
    });
  });
});

describe("extractFirstNLines", function() {
  it("should extract the first N lines when Lines are more than given lines", function() {
    const lines = `1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12`;
    const expected = `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`;
    const parsedOptions = { filePaths: ["one.txt"], num: 10, isError: false };
    assert.deepStrictEqual(extractFirstNLines(lines, parsedOptions), expected);
  });

  it("should give all lines when Lines in file are less than given lines", function() {
    const lines = `1\n2\n3`;
    const parsedOptions = { filePaths: ["one.txt"], num: 10, isError: false };
    assert.deepStrictEqual(extractFirstNLines(lines, parsedOptions), `1\n2\n3`);
  });

  it("should give empty string when error is present", function() {
    const lines = `1\n2\n3`;
    const parsedOptions = { filePaths: ["one.txt"], num: 10, isError: true };
    assert.deepStrictEqual(extractFirstNLines(lines, parsedOptions), "");
  });
});

describe("performHeadOperation", function() {
  it("should give 10 lines for default case when all args are correct", function() {
    const userOptions = ["./appTest/one.txt"];
    const expected = {
      output: `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`,
      error: undefined
    };
    assert.deepStrictEqual(performHeadOperation(userOptions, fs), expected);
  });

  it("should give all lines for default case when all args are correct and file have less than 10 lines", function() {
    const userOptions = ["./appTest/two.txt"];
    const expected = {
      output: `1\n2\n3`,
      error: undefined
    };
    assert.deepStrictEqual(performHeadOperation(userOptions, fs), expected);
  });

  it("should give error on error stream when wrong file is present", function() {
    const userOptions = ["badFile.txt"];
    const expected = {
      output: "",
      error: `head: badFile.txt: No such file or directory`
    };
    assert.deepStrictEqual(performHeadOperation(userOptions, fs), expected);
  });
});
