const assert = require("assert");

const {
  parseOptions,
  loadContents,
  extractFirstNLines,
  performHeadOperation
} = require("../src/headLib.js");

describe("parsedOptions", function() {
  it("should parsed the userOptions when only one file is given", function() {
    const expected = { filePaths: ["one.txt"], num: 10 };
    assert.deepStrictEqual(parseOptions(["one.txt"]), expected);
  });

  it("should parsed the userOptions when lines count and one file is given", function() {
    const expected = { filePaths: ["one.txt"], num: 3 };
    assert.deepStrictEqual(parseOptions(["-n", 3, "one.txt"]), expected);
  });

  it("should parsed the userOptions when more than one file is given", function() {
    const userOptions = ["one.txt", "two.txt"];
    const expected = { filePaths: ["one.txt", "two.txt"], num: 10 };
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
        return "1";
      }
    };
    const paths = { filePaths: ["path"] };
    assert.deepStrictEqual(loadContents(paths, fs), { lines: "1" });
  });

  it("should not load the lines when file does not exists", function() {
    const fs = {
      existsSync: function(path) {
        assert.equal(path, "path");
        return false;
      }
    };

    const paths = { filePaths: ["path"] };
    const expected = { error: `head: path: No such file or directory` };
    assert.deepStrictEqual(loadContents(paths, fs), expected);
  });
});

describe("extractFirstNLines", function() {
  it("should extract the first N lines when Lines are more than given lines", function() {
    const loadedLines = { lines: `1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12` };
    const expected = { lines: `1\n2\n3\n4\n5\n6\n7\n8\n9\n10` };
    const parsedOptions = { filePaths: ["one.txt"], num: 10 };
    assert.deepStrictEqual(
      extractFirstNLines(loadedLines, parsedOptions),
      expected
    );
  });

  it("should give all lines when Lines in file are less than given lines", function() {
    const loadedLines = { lines: `1\n2\n3` };
    const parsedOptions = { filePaths: ["one.txt"], num: 10 };
    assert.deepStrictEqual(extractFirstNLines(loadedLines, parsedOptions), {
      lines: `1\n2\n3`
    });
  });

  it("should give error object when invalid count is present", function() {
    const lines = `1\n2\n3`;
    const parsedOptions = { filePaths: ["one.txt"], num: 0 };
    const expected = { error: `head: illegal line count -- 0` };
    assert.deepStrictEqual(extractFirstNLines(lines, parsedOptions), expected);
  });
});

describe("performHeadOperation", function() {
  it("should give 10 lines for default case when all args are correct", function() {
    const userOptions = ["path"];
    const fs = {
      existsSync: function(path) {
        assert.equal(path, "path");
        return true;
      },
      readFileSync: function(path) {
        assert.equal(path, "path");
        return `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`;
      }
    };
    const expected = {
      output: `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`,
      error: ""
    };
    assert.deepStrictEqual(performHeadOperation(userOptions, fs), expected);
  });

  it("should give all lines for default case when all args are correct and file have less than 10 lines", function() {
    const userOptions = ["path"];
    const fs = {
      existsSync: function(path) {
        assert.equal(path, "path");
        return true;
      },
      readFileSync: function(path) {
        assert.equal(path, "path");
        return `1\n2\n3`;
      }
    };
    const expected = {
      output: `1\n2\n3`,
      error: ""
    };
    assert.deepStrictEqual(performHeadOperation(userOptions, fs), expected);
  });

  it("should give error on error stream when wrong file is present", function() {
    const userOptions = ["path"];
    const fs = {
      existsSync: function(path) {
        assert.equal(path, "path");
        return false;
      },
      readFileSync: function(path) {
        assert.equal(path, "path");
        return `1\n2\n3`;
      }
    };
    const expected = {
      error: `head: path: No such file or directory`,
      output: ""
    };
    assert.deepStrictEqual(performHeadOperation(userOptions, fs), expected);
  });

  it("should give error on error stream when wrong count is present", function() {
    const userOptions = ["-n", 0, "path"];
    const fs = {
      existsSync: function(path) {
        assert.equal(path, "path");
        return true;
      },
      readFileSync: function(path) {
        assert.equal(path, "path");
        return `1\n2\n3`;
      }
    };
    const expected = {
      error: `head: illegal line count -- 0`,
      output: ""
    };
    assert.deepStrictEqual(performHeadOperation(userOptions, fs), expected);
  });
});
