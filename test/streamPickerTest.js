const assert = require('assert');
const {stub} = require('sinon');
const StreamPicker = require('../src/streamPicker.js');

describe('streamPicker', function () {
  let myFileStream, streamPicker;
  const createReadStream = stub();
  const stdin = {};
  beforeEach(() => {
    streamPicker = new StreamPicker(createReadStream, stdin);
    myFileStream = {};
  });

  it('should createReadStream when file path is given', function () {
    
    createReadStream.withArgs('myFile').returns(myFileStream);
    assert.strictEqual(streamPicker.pick('myFile'), myFileStream);
  });

  it('should give stdin when file path is not given', function () {
    assert.strictEqual(streamPicker.pick(), stdin);
  });
});
