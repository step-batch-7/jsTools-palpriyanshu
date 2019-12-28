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
    const lineCount = 3;
    assert.deepStrictEqual(
      parseOptions(['-n', lineCount, 'one.txt']),
      expected
    );
  });

  it('should parsed the userOptions when multiple files are given', function() {
    const userOptions = ['one.txt', 'two.txt'];
    const expected = { filePaths: ['one.txt', 'two.txt'], num: 10 };
    assert.deepStrictEqual(parseOptions(userOptions), expected);
  });
});

describe('loadFirstNLines', function() {
  it('should load the lines when file exists', function() {
    const readFile = function(path, encoder, onLoading) {
      assert.strictEqual(path, 'path');
      assert.strictEqual(encoder, 'utf8');
      onLoading(null, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
    };

    const write = sinon.stub();
    write.withArgs('1\n2\n3\n4\n5\n6\n7\n8\n9\n10', '');

    const stdin = new EventEmitter();
    stdin.pause = sinon.spy();

    const paths = { filePaths: ['path'] };
    loadFirst10Lines(paths, readFile, write, stdin);
  });

  it('should load the lines from stdin when file is not given', function() {
    const write = sinon.stub();
    write.withArgs('1\n2\n3\n4\n5\n6\n7\n8\n9\n10', '');

    const stdin = new EventEmitter();
    stdin.pause = sinon.spy();
    stdin.setEncoding = sinon.spy();
    stdin.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');

    const readFile = sinon.spy();

    const parsedOptions = { filePaths: [''], num: 10 };
    loadFirst10Lines(parsedOptions, readFile, write, stdin);
  });

  it('should wait when content is not present at stdin', function() {
    const write = sinon.stub();
    write.withArgs('1\n2\n', '');

    const stdin = new EventEmitter();
    stdin.setEncoding = sinon.spy();

    const parsedOptions = { filePaths: [''], num: 2 };
    stdin.emit('data', '1\n2\n');
    loadFirst10Lines(parsedOptions, '', write, stdin);
  });

  it('should not load the lines when file does not exists', function() {
    const readFile = function(path, encoder, onLoading) {
      assert.equal(path, 'path');
      assert.strictEqual(encoder, 'utf8');
      onLoading('head: path: No such file or directory', null);
    };

    const write = sinon.stub();
    write.withArgs('', 'head: path: No such file or directory');

    const paths = { filePaths: ['path'] };
    loadFirst10Lines(paths, readFile, write);
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

  it('should give error object when invalid count is present', function() {
    const contents = '1\n2\n3';
    const parsedOptions = { filePaths: ['path'], num: 0 };
    const expected = { error: 'head: illegal line count -- 0', output: '' };
    assert.deepStrictEqual(
      extractFirstNLines(parsedOptions, contents),
      expected
    );
  });
});

describe('head', function() {
  it('should give 10 lines of file for default case ', function() {
    const userOptions = ['path'];

    const readFile = function(path, encoder, onLoading) {
      assert.equal(path, 'path');
      assert.equal(encoder, 'utf8');
      onLoading(null, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
    };

    const write = sinon.stub();
    write.withArgs('1\n2\n3\n4\n5\n6\n7\n8\n9\n10', '');

    const stdin = {};

    head(userOptions, readFile, write, stdin);
  });

  it('should give all lines when file has less than given lines', function() {
    const userOptions = ['path'];

    const readFile = function(path, encoder, onLoading) {
      assert.equal(path, 'path');
      assert.equal(encoder, 'utf8');
      onLoading(null, '1\n2\n3');
    };

    const write = sinon.stub();
    write.withArgs('1\n2\n3', '');

    const stdin = {};

    head(userOptions, readFile, write, stdin);
  });

  it('should give error when wrong file is present', function() {
    const userOptions = ['path'];

    const readFile = function(path, encoder, onLoading) {
      assert.equal(path, 'path');
      assert.equal(encoder, 'utf8');
      onLoading('head: path: No such file or directory', null);
    };

    const write = sinon.stub();
    write.withArgs('', 'head: path: No such file or directory');

    const stdin = {};

    head(userOptions, readFile, write, stdin);
  });

  it('should give error when wrong count is present', function() {
    const userOptions = ['-n', '0', 'path'];

    const readFile = function(path, encoder, callBack) {
      assert.equal(path, 'path');
      assert.equal(encoder, 'utf8');
      callBack(null, '1\n2\n3');
    };

    const write = sinon.stub();
    write.withArgs('', 'head: illegal line count --0');

    const stdin = {};

    head(userOptions, readFile, write, stdin);
  });
});
