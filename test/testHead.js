const assert = require("assert");
const fs = require("fs");
const {
  parseOptions,
  loadContents,
  extractFirstNLines,
  joinLines
} = require("../src/head.js");

describe("parsedOptions", function() {
  it("should parsed the userOptions when only one file is given", function() {
    const expected = { filePaths: ["one.txt"], num: 10 };
    assert.deepStrictEqual(parseOptions(["one.txt"]), expected);
  });

  it("should parsed the userOptions when more than one file is given", function() {
    const userOptions = ["one.txt", "two.txt"];
    const expected = { filePaths: ["one.txt", "two.txt"], num: 10 };
    assert.deepStrictEqual(parseOptions(userOptions), expected);
  });
});

describe("loadContents", function() {
  it("should load the lines when file exists", function() {
    const fileSys = {
      exists: function(path) {
        assert.equal(path, "path");
        return true;
      },
      reader: function(path) {
        assert.equal(path, "path");
        return " ";
      }
    };
    const paths = { filePaths: ["path"] };
    assert.deepStrictEqual(loadContents(fileSys, paths.filePaths, false), {
      lines: " "
    });
  });

  it("should not load the lines when file does not exists", function() {
    const fileSys = {
      exists: function(path) {
        assert.equal(path, "path");
        return false;
      },
      reader: function(path) {
        assert.equal(path, "path");
        return " ";
      }
    };

    const paths = { filePaths: ["path"] };
    assert.deepStrictEqual(loadContents(fileSys, paths.filePaths, true), {
      error: `head: path: No such file or directory`
    });
  });
});

describe("extractFirstNLines", function() {
  it("should extract the first N lines when Lines are more than given lines", function() {
    const lines = `1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12`;
    const expected = {
      lines: [["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]]
    };
    const errorStatus = { isError: false };
    assert.deepStrictEqual(
      extractFirstNLines(lines, 10, errorStatus),
      expected
    );
  });

  it("should give all lines when Lines in file are less than given lines", function() {
    const lines = `1\n2\n3`;
    const expected = {
      lines: [["1", "2", "3"]]
    };
    const errorStatus = { isError: false };
    assert.deepStrictEqual(
      extractFirstNLines(lines, 10, errorStatus),
      expected
    );
  });

  it("should give empty object error is present", function() {
    const lines = `1\n2\n3`;
    const errorStatus = { isError: true };
    assert.deepStrictEqual(extractFirstNLines(lines, 10, errorStatus), {});
  });
});

describe("joinLines", function() {
  it("should Join the lines when no error present", function() {
    const lines = [["1", "2", "3"]];
    const errorStatus = { isError: false };
    assert.strictEqual(joinLines(lines, errorStatus), `1\n2\n3`);
  });

  it("should not Join the lines when error is present", function() {
    const lines = [["1", "2", "3"]];
    const errorStatus = { isError: true };
    assert.strictEqual(joinLines(lines, errorStatus), "");
  });
});