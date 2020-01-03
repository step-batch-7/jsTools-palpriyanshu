const assert = require('chai').assert;
const StreamReader = require('../src/streamReader.js');
const { fake } = require('sinon');

const {
  parseOptions,
  isValidLineCount,
  extractFirstNLines,
  head
} = require('../src/headLib.js');

describe('parseOptions', function () {
  it('should parsed the userOptions when only one file is given', function () {
    const expected = { fileName: 'one.txt', num: 10 };
    assert.deepStrictEqual(parseOptions(['one.txt']), expected);
  });

  it('should parsed the userOptions when lines is specified', function () {
    const expected = { fileName: 'one.txt', num: 3 };
    const count = 3;
    assert.deepStrictEqual(parseOptions(['-n', count, 'one.txt']), expected);
  });

  it('should parsed the userOptions when no file & line is given', function () {
    const userOptions = [''];
    const expected = { fileName: '', num: 10 };
    assert.deepStrictEqual(parseOptions(userOptions), expected);
  });
});

describe('isValidLineCount', function () {
  it('should validate when line count is positive integer', function () {
    const count =2;
    assert.ok(isValidLineCount(count));
  });

  it('should invalidate when line count is 0 ', function () {
    const count =0;
    assert.notOk(isValidLineCount(count));
  });

  it('should invalidate when line count is not a integer ', function () {
    assert.notOk(isValidLineCount('y'));
  });
});

describe('extractFirstNLines', function () {
  it('should give all lines when file has less than given lines', function () {
    const num = 5;
    assert.deepStrictEqual(extractFirstNLines('content', num), 'content');
  });
  
  it('should give the first N lines when a file has many lines', function () {
    const num = 3;
    const content = '1\n2\n3\n4\n5\n6\n7\n8';
    assert.deepStrictEqual(extractFirstNLines(content, num), '1\n2\n3');
  });

  it('should give no lines when line count 0 is given', function () {
    const num = 0;
    const content = '1\n2\n3\n4\n5\n6\n7\n8';
    assert.deepStrictEqual(extractFirstNLines(content, num), '');
  });


});

describe('head', function () {
  let stream, streamPicker;
  beforeEach(function () {
    stream = { setEncoding: fake(), on: fake(), destroy: fake() };
    streamPicker = {};
  });

  it('should give 10 lines when line count is not given', function (done) {
    const userOptions = ['one.txt'];

    streamPicker.pick = function(filePath){
      assert.strictEqual(filePath, 'one.txt');
      return stream;
    };

    const displayResult = (result) => {
      assert.strictEqual(result.output, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
      assert.strictEqual(result.error, '');
      done();
    };
    
    head(userOptions, streamPicker, StreamReader, displayResult);
    assert.ok(stream.setEncoding.calledWith('utf8'));
    assert.ok(stream.on.firstCall.calledWith('data'));
    stream.on.firstCall.lastArg('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
  });

  it('should give specified lines when line count is given', function (done) {
    const userOptions = ['one.txt'];

    streamPicker.pick = function (filePath) {
      assert.strictEqual(filePath, 'one.txt');
      return stream;
    };

    const displayResult = (result) => {
      assert.strictEqual(result.output, 'abc');
      assert.strictEqual(result.error, '');
      done();
    };

    head(userOptions, streamPicker, StreamReader, displayResult);
    assert.ok(stream.setEncoding.calledWith('utf8'));
    assert.ok(stream.on.firstCall.calledWith('data'));
    stream.on.firstCall.lastArg('abc');
  });

  it('should give error when wrong file is present', function (done) {
    const userOptions = ['badFile.txt'];

    streamPicker.pick = function (filePath) {
      assert.strictEqual(filePath, 'badFile.txt');
      return stream;
    };

    const err = { path: 'badFile.txt' };
    const errMsg = `head: ${err.path}: No such file or directory`;
    const displayResult = (result) => {
      assert.strictEqual(result.output, '');
      assert.strictEqual(result.error, errMsg);
      done();
    };

    head(userOptions, streamPicker, StreamReader, displayResult);
    assert.ok(stream.setEncoding.calledWith('utf8'));
    assert.ok(stream.on.secondCall.calledWith('error'));
    stream.on.secondCall.lastArg(err);
  });

  it('should give error when line count is less than 1', function (done) {
    const count = 0;
    const userOptions = ['-n', count, 'one.txt'];

    streamPicker.pick = function (filePath) {
      assert.strictEqual(filePath, 'one.txt');
      return stream;
    };

    const err = { path: 'one.txt' };
    const displayResult = (result) => {
      assert.strictEqual(result.output, '');
      assert.strictEqual(result.error, 'head: illegal line count -- 0');
      done();
    };

    head(userOptions, streamPicker, StreamReader, displayResult);
    assert.ok(stream.setEncoding.calledWith('utf8'));
    assert.ok(stream.on.secondCall.calledWith('error'));
    stream.on.secondCall.lastArg(err);
  });

  it('should give error when line count is not integer', function (done) {
    const userOptions = ['-n', 'm', 'one.txt'];

    streamPicker.pick = function (filePath) {
      assert.strictEqual(filePath, 'one.txt');
      return stream;
    };

    const err = { path: 'one.txt' };
    const displayResult = (result) => {
      assert.strictEqual(result.output, '');
      assert.strictEqual(result.error, 'head: illegal line count -- m');
      done();
    };

    head(userOptions, streamPicker, StreamReader, displayResult);
    assert.ok(stream.setEncoding.calledWith('utf8'));
    assert.ok(stream.on.secondCall.calledWith('error'));
    stream.on.secondCall.lastArg(err);
  });
});


