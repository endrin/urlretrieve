'use strict';

const nock = require('nock'),
      chai = require('chai'),
      expect = chai.expect,
      path = require('path'),
      fs = require('fs'),
      mkdirp = require('mkdirp');

      chai.use(require('chai-as-promised'));

const Config = require('./support/config');

const urlretrieve = require('../index.js');

describe("urlretrieve error handling", function () {

  before(function (done) {
    mkdirp(Config.downloadLocation, done);
  });

  context("No errors, no options given", function () {

    beforeEach(function () {
      nock(Config.server.host)
        .get(Config.server.path)
        .reply(
          200,
          Config.server.brokenFile,
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

    it('should throw "content too short" error', function () {
      return expect(this.result).to.be.rejected
      .and.eventually.satisfy(function (err) {
        expect(err.message).to.be.equal('Content too short');
        expect(err.size).to.be.equal(Config.server.partialSize);
        expect(err.headers).to.be.equal(Config.server.headers);
        return true;
      });
    });

    it('should delete broken file at taget location');

  });

});
