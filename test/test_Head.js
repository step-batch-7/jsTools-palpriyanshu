const assert = require("assert");
const fs = require("fs");
const Head = require("../src/head.js");

describe("Head", function() {
  describe("filterUserOptions", function() {
    it("should give user options when cmd line args are given", function() {
      const header = new Head();
      assert.deepStrictEqual(
        header.filterUserOptions(["node", "head.js", "one.txt"]),
        ["one.txt"]
      );
    });
  });

  describe("parsedOptions", function() {
    it("should parsed the userOptions when only one file is given", function() {
      const header = new Head();
      const expected = { filePaths: ["one.txt"], num: 10 };
      assert.deepStrictEqual(header.parseOptions(["one.txt"]), expected);
    });

    it("should parsed the userOptions when more than one file is given", function() {
      const header = new Head();
      const userOptions = ["one.txt", "two.txt"];
      const expected = { filePaths: ["one.txt", "two.txt"], num: 10 };
      assert.deepStrictEqual(header.parseOptions(userOptions), expected);
    });

    it("should parsed the userOptions when number of lines are specified ", function() {
      const header = new Head();
      const userOptions = ["-n", 3, "one.txt"];
      const expected = { filePaths: ["one.txt"], num: 3 };
      assert.deepStrictEqual(header.parseOptions(userOptions), expected);
    });
  });

  describe("loadLines", function() {
    it("should load the lines when file exists", function() {
      const header = new Head();
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
      const expected = { lines: [[" "]], num: 10 };
      assert.deepStrictEqual(header.loadLines(fileSys, "path"), " ");
    });

    it("should not load the lines when file does not exists", function() {
      const header = new Head();
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
      assert.strictEqual(
        header.loadLines(fileSys, "path"),
        `head: path: No such file or directory`
      );
    });
  });
});
