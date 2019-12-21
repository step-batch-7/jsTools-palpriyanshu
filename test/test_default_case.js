const assert = require("assert");
const Head = require("../src/header.js");

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
    it("should parsed the userOptions", function() {
      const header = new Head();
      const expected = { filePaths: ["one.txt"], num: 10 };
      assert.deepStrictEqual(header.parsedOptions(["one.txt"]), expected);
    });
  });
});
