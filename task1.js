const { Transform } = require("stream");

const reverseString = (str) => {
  const reversedArr = str.split("").reverse();
  return reversedArr.join("") + '\n';
};

const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    this.push(reverseString(chunk.toString()));
    callback();
  },
});

process.stdin.pipe(transformStream).pipe(process.stdout);