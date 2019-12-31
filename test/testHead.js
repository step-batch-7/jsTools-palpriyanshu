const assert = require('chai').assert;
const { fake, restore } = require('sinon');

const {
  parseOptions,
  isValidLineCount,
  selectReadStream,
  loadContents,
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

describe('selectReadStream', function () {
  let reader;
  beforeEach(() => {
    reader = { stdin: {}, createReadStream: function () { } };
  });

  it('should createReadStream when file path is given', function () {
    const stream = reader.createReadStream('one.txt');
    assert.strictEqual(selectReadStream('one.txt', reader), stream);
  });

  it('should give stdin when file path is not given', function () {
    assert.strictEqual(selectReadStream('', reader), reader.stdin);
  });
});

describe('loadContents', function () {
  let stream;
  const defaultHeadLines = 10;
  beforeEach(function () {
    stream = { setEncoding: fake(), on: fake(), pause: fake() };
  });

  afterEach(function () {
    restore();
  });

  context('when filePath is given', function () {
    it('should load the lines when filePath is present', function (done) {

      const afterLoading = function (contents) {
        assert.deepStrictEqual(contents, { lines: 'abc', error: '' });
        write({ output: 'abc', error: '' });
      };

      const write = (result) => {
        assert.strictEqual(result.output, 'abc');
        assert.strictEqual(result.error, '');
        done();
      };
      loadContents(stream, defaultHeadLines, afterLoading);
      assert(stream.setEncoding.calledWith('utf8'));
      assert(stream.on.firstCall.calledWith('data'));
      assert(stream.on.thirdCall.calledWith('end'));
      stream.on.firstCall.lastArg('abc');
      stream.on.thirdCall.lastArg();
    });

    it('should not load the lines when file does not exists', function (done) {
      const err = { path: 'badFile.txt' };
      const errMsg = `head: ${err.path}: No such file or directory`;
      const afterLoading = function (contents) {
        assert.deepStrictEqual(contents, { lines: '', error: errMsg });
        write({ output: '', error: errMsg });
      };
      const write = (result) => {
        assert.strictEqual(result.output, '');
        assert.strictEqual(result.error, errMsg);
        done();
      };

      loadContents(stream, defaultHeadLines, afterLoading);
      assert(stream.setEncoding.calledWith('utf8'));
      assert(stream.on.secondCall.calledWith('error'));
      stream.on.secondCall.lastArg(err);
    });
  });

  context('when filePath is not given', function () {
    it('should load the lines when content is present', function (done) {
      const afterLoading = function (contents) {
        assert.deepStrictEqual(contents, { lines: 'abc', error: '' });
        write({ output: 'abc', error: '' });
      };

      const write = (result) => {
        assert.strictEqual(result.output, 'abc');
        assert.strictEqual(result.error, '');
        done();
      };

      loadContents(stream, defaultHeadLines, afterLoading);
      assert(stream.setEncoding.calledWith('utf8'));
      assert(stream.on.firstCall.calledWith('data'));
      assert(stream.on.thirdCall.calledWith('end'));
      stream.on.firstCall.lastArg('abc');
      stream.on.thirdCall.lastArg();
    });

    it('should wait for stdin when content is absent', function (done) {
      const afterLoading = fake(), lineCount = 1;
      loadContents(stream, lineCount, afterLoading);
      assert(stream.setEncoding.calledWith('utf8'));
      assert(stream.on.firstCall.calledWith('data'));
      assert(stream.on.thirdCall.calledWith('end'));
      stream.on.firstCall.lastArg('123');
      assert(stream.on.calledThrice), assert(stream.pause.calledOnce);
      stream.on.thirdCall.lastArg();
      assert(afterLoading.calledWith({ error: '', lines: '123' })); 
      done();
    });
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
  afterEach(function () {
    restore();
  });

  context('when file is given', function () {
    let stream;
    beforeEach(function () {
      stream = { setEncoding: fake(), on: fake(), pause: fake() };
    });

    it('should give 10 lines of file for default case ', function (done) {
      const userOptions = ['one.txt'];

      const createReadStream = function (fileName) {
        assert.strictEqual(fileName, 'one.txt');
        return stream;
      };

      const reader = { createReadStream, stdin: {} };
      const write = (result) => {
        assert.strictEqual(result.output, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
        assert.strictEqual(result.error, '');
        done();
      };

      head(userOptions, reader, write);
      assert(stream.setEncoding.calledWith('utf8'));
      assert(stream.on.firstCall.calledWith('data'));
      assert(stream.on.thirdCall.calledWith('end'));
      stream.on.firstCall.lastArg('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
      stream.on.thirdCall.lastArg();
    });

    it('should give all lines when file has lines < 10', function (done) {
      const userOptions = ['one.txt'];

      const createReadStream = function (fileName) {
        assert.strictEqual(fileName, 'one.txt');
        return stream;
      };

      const reader = { createReadStream, stdin: {} };
      const write = (result) => {
        assert.strictEqual(result.output, 'abc');
        assert.strictEqual(result.error, '');
        done();
      };

      head(userOptions, reader, write);
      assert(stream.setEncoding.calledWith('utf8'));
      assert(stream.on.firstCall.calledWith('data'));
      assert(stream.on.thirdCall.calledWith('end'));
      stream.on.firstCall.lastArg('abc');
      stream.on.thirdCall.lastArg();
    });

    it('should give error when wrong file is present', function (done) {
      const userOptions = ['badFile.txt'];

      const createReadStream = function (fileName) {
        assert.strictEqual(fileName, 'badFile.txt');
        return stream;
      };

      const reader = { createReadStream, stdin: {} };
      const err = { path: 'badFile.txt' };
      const errMsg = `head: ${err.path}: No such file or directory`;
      const write = (result) => {
        assert.strictEqual(result.output, '');
        assert.strictEqual(result.error, errMsg);
        done();
      };

      head(userOptions, reader, write);
      assert(stream.setEncoding.calledWith('utf8'));
      assert(stream.on.secondCall.calledWith('error'));
      stream.on.secondCall.lastArg(err);
    });

    it('should give error when line count is less than 1', function (done) {
      const count = 0;
      const userOptions = ['-n', count, 'one.txt'];

      const createReadStream = function (fileName) {
        assert.strictEqual(fileName, 'badFile.txt');
        return stream;
      };

      const reader = { createReadStream, stdin: {} };
      const err = { path: 'one.txt' };
      const write = (result) => {
        assert.strictEqual(result.output, '');
        assert.strictEqual(result.error, 'head: illegal line count -- 0');
        done();
      };

      head(userOptions, reader, write);
      assert(stream.setEncoding.calledWith('utf8'));
      assert(stream.on.secondCall.calledWith('error'));
      stream.on.secondCall.lastArg(err);
    });

    it('should give error when line count is not integer', function (done) {
      const userOptions = ['-n', 'm', 'one.txt'];

      const createReadStream = function (fileName) {
        assert.strictEqual(fileName, 'badFile.txt');
        return stream;
      };

      const reader = { createReadStream, stdin: {} };
      const err = { path: 'one.txt' };
      const write = (result) => {
        assert.strictEqual(result.output, '');
        assert.strictEqual(result.error, 'head: illegal line count -- m');
        done();
      };

      head(userOptions, reader, write);
      assert(stream.setEncoding.calledWith('utf8'));
      assert(stream.on.secondCall.calledWith('error'));
      stream.on.secondCall.lastArg(err);
    });
  });

  context('when file is not given', function () {
    let stdin;
    beforeEach(function () {
      stdin = { setEncoding: fake(), on: fake(), pause: fake() };
    });

    it('should load the 10 lines from stdin for default case', function (done) {
      const userOptions = [''];

      const reader = { createReadStream: function () { }, stdin };
      const write = (result) => {
        assert.strictEqual(result.output, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
        assert.strictEqual(result.error, '');
        done();
      };

      head(userOptions, reader, write);
      assert(stdin.setEncoding.calledWith('utf8'));
      assert(stdin.on.firstCall.calledWith('data'));
      assert(stdin.on.thirdCall.calledWith('end'));
      stdin.on.firstCall.lastArg('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
      stdin.on.thirdCall.lastArg();
    });
  });
});
