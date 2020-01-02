class StreamPicker{
  constructor(createReadStream, stdin){
    this.createReadStream = createReadStream;
    this.stdin = stdin;
  }

  pick(filePath){
    return filePath? this.createReadStream(filePath): this.stdin;
  }
}

module.exports = StreamPicker;
