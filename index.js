'use strict';

var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

module.exports = (link, options) => new Promise(function (resolve, reject) {

  var targetName = path.basename(decodeURIComponent(url.parse(link).pathname)),
      targetPath = path.resolve(process.cwd(), targetName);

  http.get(link, function (res) {

    var out = fs.createWriteStream(targetPath);

    out.on('finish', () => resolve({
      filename: targetPath,
      headers: res.headers
    }));

    res.pipe(out);

  });
});
