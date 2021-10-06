import fs from "fs";
import { pipeline, Transform } from "stream";
import csv from "csvtojson";

const readableStream = fs.createReadStream("csv/example.csv");
const writableStream = fs.createWriteStream("result.txt");
const converter = csv({ ignoreColumns: /Amount/, noheader: false, headers: ['book', 'author', 'price'] });

const handleError = (error) => {
  if (error) console.error(error);
};

// This is only for check, you can remove this stream
const loggingStream = new Transform({
  transform(chunk, encoding, callback) {
    console.log('Writing line by line, now line: ', chunk.toString());
    this.push(chunk);
    callback();
  },
});

pipeline(readableStream, converter, loggingStream, writableStream, handleError);

/* 
Solution with pipe method:

const writableStream = fs.createWriteStream("result.txt");
const converter = csv({ ignoreColumns: /Amount/, noheader: false, headers: ['book', 'author', 'price'] })
  .on("data", (data) => {
    console.log("Writing line by line, now line: ", data.toString());
    writableStream.write(data);
  })
converter.fromFile("csv/example.csv")
*/