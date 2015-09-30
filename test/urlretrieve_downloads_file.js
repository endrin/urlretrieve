'use strict';

const nock = require('nock'),
      chai = require('chai'),
      expect = chai.expect,
      path = require('path'),
      fs = require('fs');

      chai.use(require('chai-as-promised'));

const Config = require('./support/config');

const urlretrieve = require('../index.js');

describe("urlretrieve downloads file", function () {

  context("No errors, no options given", function () {
    beforeEach(function () {
      nock(Config.server.host)
        .get(Config.server.path)
        .reply(
          200,
          Config.server.file,
          Config.server.headers
        );

      this.workDir = process.cwd();
      process.chdir(Config.downloadLocation);

      this.expectedPath = path.resolve(
        Config.downloadLocation, '.' + Config.server.path
      );
      this.result = urlretrieve(Config.server.url);

    });

    afterEach(function () {
      try {
        fs.unlinkSync(this.expectedPath);
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
      }

      process.chdir(this.workDir);
    });

    it('should return all received headers', function () {
      return expect(this.result).to.eventually
        .have.property('headers')
        .that.deep.equals(Config.server.headers);
    });

    it('should return name of downloaded file', function () {
      return expect(this.result).to.eventually
        .have.property('filename')
        .that.deep.equals(this.expectedPath);
    });

    it('should download requested file to taget location', function () {
      return expect(this.result).to.eventually
        .satisfy(function (res) {
          var downloadedFile = fs.readFileSync(res.filename);
          expect(downloadedFile).to.be.deep.equal(Config.server.file);

          return true;
        });
    });

  });

});
