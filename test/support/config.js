'use strict';

var path = require('path'),
    crypto = require('crypto'),
    Readable = require('stream').Readable;

class RandomStream extends Readable {
  constructor(size) {
    super({encoding: 'binary', objectMode: 'false'});
    this.data = crypto.randomBytes(size);
  }

  _read () {
    this.push(this.data);
    this.push(null);
  }

}

var kb500 = 500 * 1024,
    fileSize = Math.floor(Math.random() * kb500 + kb500),
    fileSizePart = Math.floor(fileSize * Math.random()),
    fileContent = crypto.randomBytes(fileSize),
    fileHost = 'http://test.server.com',
    filePath = '/someFile.zip',
    fileUrl = fileHost + filePath;

module.exports = {
  server: {
    url: fileUrl,
    host: fileHost,
    path: filePath,
    fileSize: fileSize,
    partialSize: fileSizePart,
    file: fileContent,
    brokenFile: () => new RandomStream(fileSizePart),
    headers: {
      'accept-ranges': 'bytes',
      age: '18',
      'content-type': 'application/zip',
      date: 'Fri, 25 Sep 2015 12:16:50 GMT',
      etag: '"3726-51fadf2270500"',
      'last-modified': 'Mon, 14 Sep 2015 05:00:36 GMT',
      server: 'Apache/2.4.6 (Amazon) PHP/5.4.17',
      via: '1.1 varnish',
      'x-varnish': '1348446493 1348446101',
      'content-length': fileSize.toString(),
      connection: 'Close'
    }
  },
  downloadLocation: path.resolve(__dirname, './download')
};
