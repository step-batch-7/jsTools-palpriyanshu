const assert = require('assert');
const {fake} = require('sinon');
const StreamReader = require('../src/streamReader.js');

describe('StreamReader', function () {
  let stream;
  const defaultHeadLines = 10;
  beforeEach(function () {
    stream = {setEncoding: fake(), on: fake(), destroy: fake()};
  });

  context('when filePath is given', function () {
    it('should load the lines when filePath is present', function (done) {
      const streamReader = new StreamReader(stream);

      const afterReading = function (contents) {
        assert.deepStrictEqual(contents, {lines: 'abc', error: ''});
        callBack({output: 'abc', error: ''});
      };

      const callBack = (result) => {
        assert.strictEqual(result.output, 'abc');
        assert.strictEqual(result.error, '');
        done();
      };
      streamReader.read(defaultHeadLines, afterReading);
      assert.ok(stream.setEncoding.calledWith('utf8'));
      assert.ok(stream.on.firstCall.calledWith('data'));
      stream.on.firstCall.lastArg('abc');
      assert.ok(stream.destroy.notCalled);
    });

    it('should not load the lines when file does not exists', function (done) {
      const streamReader = new StreamReader(stream);
      const err = {path: 'badFile.txt'};
      const errMsg = `head: ${err.path}: No such file or directory`;

      const afterReading = function (contents) {
        assert.deepStrictEqual(contents, {lines: '', error: errMsg});
        callBack({output: '', error: errMsg});
      };
      const callBack = (result) => {
        assert.strictEqual(result.output, '');
        assert.strictEqual(result.error, errMsg);
        done();
      };

      streamReader.read(defaultHeadLines, afterReading);
      assert.ok(stream.setEncoding.calledWith('utf8'));
      assert.ok(stream.on.secondCall.calledWith('error'));
      stream.on.secondCall.lastArg(err);
      assert.ok(stream.destroy.notCalled);
    });
  });

  context('when filePath is not given', function () {
    it('should load the lines when content is present', function (done) {
      const streamReader = new StreamReader(stream);

      const afterReading = function (contents) {
        assert.deepStrictEqual(contents, {lines: 'abc', error: ''});
        callBack({output: 'abc', error: ''});
      };

      const callBack = (result) => {
        assert.strictEqual(result.output, 'abc');
        assert.strictEqual(result.error, '');
        done();
      };

      streamReader.read(defaultHeadLines, afterReading);
      assert.ok(stream.setEncoding.calledWith('utf8'));
      assert.ok(stream.on.firstCall.calledWith('data'));
      stream.on.firstCall.lastArg('abc');
      assert.ok(stream.on.calledTwice);
      assert.ok(stream.destroy.notCalled);
    });

    it('should wait for stdin when content is absent', function (done) {
      const streamReader = new StreamReader(stream);
      const afterReading = fake(), lineCount = 1;
      
      streamReader.read(lineCount, afterReading);
      assert.ok(stream.setEncoding.calledWith('utf8'));
      assert.ok(stream.on.firstCall.calledWith('data'));
      stream.on.firstCall.lastArg('123');
      assert.ok(stream.on.calledTwice);
      assert.ok(stream.destroy.calledOnce);
      assert.ok(afterReading.calledWith({error: '', lines: '123'}));
      done();
    });
  });
});
