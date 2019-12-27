const assert = require("assert");

const {
  parseOptions,
  loadFirst10Lines,
  extractFirstNLines,
  head
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

describe("loadFirstNLines", function() {
  it("should load the lines when file exists", function() {
    const readFile = function(path, encoder, onLoading) {
      assert.strictEqual(path, "path");
      assert.strictEqual(encoder, "utf8");
      onLoading(null, `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`);
    };

    const write = function(output, error) {
      assert.strictEqual(output, `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`);
      assert.strictEqual(error, ``);
    };

    const paths = { filePaths: ["path"] };
    loadFirst10Lines(paths, readFile, write);
  });

  it("should load the lines from stdin when file is not given", function() {
    const write = function(output, error) {
      assert.strictEqual(output, `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`);
      assert.strictEqual(error, ``);
    };

    const read = function(onLoading) {
      onLoading.bind(parsedOptions, write, "", `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`);
    };
    
    const readFile = function() {
      return;
    };

    const parsedOptions = { filePaths: [""], num: 10 };
    loadFirst10Lines(parsedOptions, readFile, write, read);
  });

  it("should not load the lines when file does not exists", function() {
    const readFile = function(path, encoder, onLoading) {
      assert.equal(path, "path");
      assert.strictEqual(encoder, "utf8");
      onLoading(`head: path: No such file or directory`, null);
    };

    const write = function(output, error) {
      assert.strictEqual(output, ``);
      assert.strictEqual(error, `head: path: No such file or directory`);
    };

    const paths = { filePaths: ["path"] };
    loadFirst10Lines(paths, readFile, write);
  });
});

describe("extractFirstNLines", function() {
  it("should extract the first N lines when Lines are more than given lines", function() {
    const parsedOptions = { filePaths: ["path"], num: 10 };
    const contents = `1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12`;
    const expected = { output: `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`, error: "" };
    assert.deepStrictEqual(
      extractFirstNLines(parsedOptions, contents),
      expected
    );
  });

  it("should give all lines when Lines in file are less than given lines", function() {
    const contents = `1\n2\n3`;
    const parsedOptions = { filePaths: ["path"], num: 10 };
    assert.deepStrictEqual(extractFirstNLines(parsedOptions, contents), {
      output: `1\n2\n3`,
      error: ""
    });
  });

  it("should give error object when invalid count is present", function() {
    const contents = `1\n2\n3`;
    const parsedOptions = { filePaths: ["path"], num: 0 };
    const expected = { error: `head: illegal line count -- 0`, output: "" };
    assert.deepStrictEqual(
      extractFirstNLines(parsedOptions, contents),
      expected
    );
  });
});

describe("head", function() {
  it("should give 10 lines for default case when all args are correct", function() {
    const userOptions = ["path"];

    const readFile = function(path, encoder, onLoading) {
      assert.equal(path, "path");
      assert.equal(encoder, "utf8");
      onLoading(null, `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`);
    };

    const write = function(output, error) {
      assert.strictEqual(output, `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`);
      assert.strictEqual(error, "");
    };
    head(userOptions, readFile, write);
  });

  it("should give all lines for default case when all args are correct and file have less than 10 lines", function() {
    const userOptions = ["path"];

    const readFile = function(path, encoder, onLoading) {
      assert.equal(path, "path");
      assert.equal(encoder, "utf8");
      onLoading(null, `1\n2\n3`);
    };

    const write = function(output, error) {
      assert.strictEqual(output, `1\n2\n3`);
      assert.strictEqual(error, "");
    };

    head(userOptions, readFile, write);
  });

  it("should give error on error stream when wrong file is present", function() {
    const userOptions = ["path"];

    const readFile = function(path, encoder, onLoading) {
      assert.equal(path, "path");
      assert.equal(encoder, "utf8");
      onLoading(`head: path: No such file or directory`, null);
    };

    const write = function(output, error) {
      assert.strictEqual(output, "");
      assert.strictEqual(error, `head: path: No such file or directory`);
    };

    head(userOptions, readFile, write);
  });

  it("should give error on error stream when wrong count is present", function() {
    const userOptions = ["-n", 0, "path"];

    const readFile = function(path, encoder, callBack) {
      assert.equal(path, "path");
      assert.equal(encoder, "utf8");
      callBack(null, `1\n2\n3`);
    };

    const write = function(output, error) {
      assert.strictEqual(output, ``);
      assert.strictEqual(error, `head: illegal line count -- 0`);
    };

    head(userOptions, readFile, write);
  });
});
