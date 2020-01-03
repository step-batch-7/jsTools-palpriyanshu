class StreamReader{
  constructor(stream){
    this.stream = stream;
    this.count = 0;
    this.content = {lines: '', error: ''};
  }

  read(lineCount, afterReading) {
    const onData = (data) => { 
      this.count++;
      if (this.count >= lineCount) {
        this.stream.destroy();
      }
      this.content.lines = data;
      afterReading(this.content);
    };

    this.stream.setEncoding('utf8');
    this.stream.on('data', onData);
    this.stream.on('error', (err) => {
      this.content.error = `head: ${err.path}: No such file or directory`;
      afterReading(this.content);
    });
  }
}

module.exports = StreamReader;
