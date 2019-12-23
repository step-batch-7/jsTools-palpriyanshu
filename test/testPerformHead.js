const assert = require("assert");
const { performHeadOperation } = require("../src/performHead.js");

describe("performHeadOperation", function() {
  it("should give 10 lines for default case when all args are correct", function() {
    const userOptions = ["./appTest/one.txt"];
    const expected = {
      output: `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`,
      error: ``
    };
    assert.deepStrictEqual(performHeadOperation(userOptions), expected);
  });

  it("should give all lines for default case when all args are correct and file have less than 10 lines", function() {
    const userOptions = ["./appTest/two.txt"];
    const expected = {
      output: `1\n2\n3`,
      error: ``
    };
    assert.deepStrictEqual(performHeadOperation(userOptions), expected);
  });

  it("should give error on error stream when wrong file is present", function() {
    const userOptions = ["badFile.txt"];
    const expected = {
      output: ``,
      error: `head: badFile.txt: No such file or directory`
    };
    assert.deepStrictEqual(performHeadOperation(userOptions), expected);
  });
});
