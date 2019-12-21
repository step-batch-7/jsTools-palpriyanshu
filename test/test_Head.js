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
      assert.deepStrictEqual(header.parsedOptions(["one.txt"]), expected);
    });

    it("should parsed the userOptions when more than one file is given", function() {
      const header = new Head();
      const userOptions = ["one.txt", "two.txt"];
      const expected = { filePaths: ["one.txt", "two.txt"], num: 10 };
      assert.deepStrictEqual(header.parsedOptions(userOptions), expected);
    });

    it("should parsed the userOptions when number of lines are specified ", function() {
      const header = new Head();
      const userOptions = ["-n", 3, "one.txt"];
      const expected = { filePaths: ["one.txt"], num: 3 };
      assert.deepStrictEqual(header.parsedOptions(userOptions), expected);
    });
  });
});
