const sinon = require('sinon');
const assert = require('assert');
const EventEmitter = require('events');

const {
  parseOptions,
  loadFirst10Lines,
  extractFirstNLines,
  head
} = require('../src/headLib.js');

describe('parsedOptions', function() {
  it('should parsed the userOptions when only one file is given', function() {
    const expected = { filePaths: ['one.txt'], num: 10 };
    assert.deepStrictEqual(parseOptions(['one.txt']), expected);
  });

  it('should parsed the userOptions when lines is specified', function() {
    const expected = { filePaths: ['one.txt'], num: 3 };
    const count = 3;
    assert.deepStrictEqual(parseOptions(['-n', count, 'one.txt']), expected);
  });

  it('should parsed the userOptions when no file & line is given', function() {
    const userOptions = [''];
    const expected = { filePaths: [''], num: 10 };
    assert.deepStrictEqual(parseOptions(userOptions), expected);
  });

  it('should parsed the userOptions when multiple files are given', function() {
    const userOptions = ['one.txt', 'two.txt'];
    const expected = { filePaths: ['one.txt', 'two.txt'], num: 10 };
    assert.deepStrictEqual(parseOptions(userOptions), expected);
  });
});

describe('loadFirstNLines', function() {
  it('should load the lines when file exists', function() {
    const readerWriter = {};

    readerWriter.readFile = function(path, encoder, onLoading) {
      assert.strictEqual(path, 'path');
      assert.strictEqual(encoder, 'utf8');
      onLoading(null, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
    };

    readerWriter.write = sinon.stub();
    readerWriter.write.withArgs('1\n2\n3\n4\n5\n6\n7\n8\n9\n10', '');

    const parsedOptions = { filePaths: ['path'], num: 10 };
    loadFirst10Lines(parsedOptions, readerWriter);
  });

  it('should not load the lines when file does not exists', function() {
    const readerWriter = {};

    readerWriter.readFile = function(path, encoder, onLoading) {
      assert.strictEqual(path, 'path');
      assert.strictEqual(encoder, 'utf8');
      onLoading('head: path: No such file or directory', null);
    };

    readerWriter.write = sinon.stub();
    readerWriter.write.withArgs('', 'head: path: No such file or directory');

    const paths = { filePaths: ['path'] };
    loadFirst10Lines(paths, readerWriter);
  });

  it('should load the lines from stdin when file is not given', function() {
    const readerWriter = {};

    readerWriter.stdin = new EventEmitter();
    readerWriter.stdin.setEncoding = sinon.spy();
    readerWriter.stdin.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
    readerWriter.stdin.emit('end');

    readerWriter.write = sinon.stub();
    readerWriter.write.withArgs('1\n2\n3\n4\n5\n6\n7\n8\n9\n10', '');

    const parsedOptions = { filePaths: [''], num: 10 };
    loadFirst10Lines(parsedOptions, readerWriter);
  });
});

describe('extractFirstNLines', function() {
  it('should extract the first N lines when a file has many lines', function() {
    const parsedOptions = { filePaths: ['path'], num: 10 };
    const contents = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12';
    const expected = { output: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10', error: '' };
    assert.deepStrictEqual(
      extractFirstNLines(parsedOptions, contents),
      expected
    );
  });

  it('should give all lines when file has less than given lines', function() {
    const contents = '1\n2\n3';
    const parsedOptions = { filePaths: ['path'], num: 10 };
    assert.deepStrictEqual(extractFirstNLines(parsedOptions, contents), {
      output: '1\n2\n3',
      error: ''
    });
  });
});

describe('head', function() {
  it('should give 10 lines of file for default case ', function() {
    const userOptions = ['path'];

    const readerWriter = {};
    readerWriter.readFile = function(path, encoder, onLoading) {
      assert.equal(path, 'path');
      assert.equal(encoder, 'utf8');
      onLoading(null, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
    };

    readerWriter.write = sinon.stub();
    readerWriter.write.withArgs('1\n2\n3\n4\n5\n6\n7\n8\n9\n10', '');

    head(userOptions, readerWriter);
  });

  it('should give all lines when file has less than 10 lines', function() {
    const userOptions = ['path'];

    const readerWriter = {};
    readerWriter.readFile = function(path, encoder, onLoading) {
      assert.equal(path, 'path');
      assert.equal(encoder, 'utf8');
      onLoading(null, '1\n2\n3');
    };

    readerWriter.write = sinon.stub();
    readerWriter.write.withArgs('1\n2\n3', '');

    head(userOptions, readerWriter);
  });

  it('should give error when wrong file is present', function() {
    const userOptions = ['badPath'];

    const readerWriter = {};
    readerWriter.readFile = function(path, encoder, onLoading) {
      assert.equal(path, 'badPath');
      assert.equal(encoder, 'utf8');
      onLoading('head: badPath: No such file or directory', null);
    };

    readerWriter.write = sinon.stub();
    readerWriter.write.withArgs('', 'head: path: No such file or directory');

    head(userOptions, readerWriter);
  });

  it('should give error when line count is less than 1', function() {
    const userOptions = ['-n', '0', 'path'];

    const readerWriter = {};
    readerWriter.readFile = function(path, encoder, onLoading) {
      assert.equal(path, 'path');
      assert.equal(encoder, 'utf8');
      onLoading('head: illegal line count --0', null);
    };

    readerWriter.write = sinon.stub();
    readerWriter.write.withArgs('', 'head: illegal line count --0');

    head(userOptions, readerWriter);
  });

  it('should give error when line count is not integer', function() {
    const userOptions = ['-n', 'm', 'path'];

    const readerWriter = {};
    readerWriter.readFile = function(path, encoder, onLoading) {
      assert.equal(path, 'path');
      assert.equal(encoder, 'utf8');
      onLoading('head: illegal line count --m', null);
    };

    readerWriter.write = sinon.stub();
    readerWriter.write.withArgs('', 'head: illegal line count --m');

    head(userOptions, readerWriter);
  });
});
