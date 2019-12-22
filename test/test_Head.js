const assert = require("assert");
const fs = require("fs");
const { Head } = require("../src/head.js");

describe("Head", function() {
  describe("parsedOptions", function() {
    it("should parsed the userOptions when only one file is given", function() {
      const head = new Head();
      const expected = { filePaths: ["one.txt"], num: 10 };
      assert.deepStrictEqual(head.parseOptions(["one.txt"]), expected);
    });

    it("should parsed the userOptions when more than one file is given", function() {
      const head = new Head();
      const userOptions = ["one.txt", "two.txt"];
      const expected = { filePaths: ["one.txt", "two.txt"], num: 10 };
      assert.deepStrictEqual(head.parseOptions(userOptions), expected);
    });
  });

  describe("loadLines", function() {
    it("should load the lines when file exists", function() {
      const head = new Head();
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
      const expected = {
        lines: [[" "]],
        filePath: ["path"]
      };
      assert.deepStrictEqual(head.loadLines(fileSys, "path"), expected);
    });

    it("should not load the lines when file does not exists", function() {
      const head = new Head();
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

      const generateErrorMessage = function() {
        return `head: path: no such file or directory`;
      };
      assert.strictEqual(
        head.loadLines(fileSys, "path", generateErrorMessage),
        generateErrorMessage()
      );
    });
  });

  describe("extractFirstNLines", function() {
    it("should extract the first N lines when Lines are more than given lines", function() {
      const head = new Head();
      const lines = `1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12`;
      const expected = {
        lines: [["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]],
        filePath: ["path"]
      };
      assert.deepStrictEqual(head.extractFirstNLines(lines, "path"), expected);
    });

    it("should give all lines when Lines in file are less than given lines", function() {
      const head = new Head();
      const lines = `1\n2\n3`;
      const expected = {
        lines: [["1", "2", "3"]],
        filePath: ["path"]
      };
      assert.deepStrictEqual(head.extractFirstNLines(lines, "path"), expected);
    });
  });

  describe("joinLines", function() {
    it("should Join the lines", function() {
      const head = new Head();
      const lines = { lines: [["1", "2", "3"]] };
      assert.strictEqual(head.joinLines(lines), "1\n2\n3");
    });
  });
});
