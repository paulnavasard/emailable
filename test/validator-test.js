var should = require('chai').should()
  , validator = require('../lib/validator');

describe('test', function() {
  it('should validate a good email', function(done) {
    validator('pnavasard@katalus.com', function(err, result) {
      result.valid.should.be.true;
      done();
    });
  });

  it('should error out on an invalid email address', function(done) {
    validator('pnavasard@katalus', function(err, result, message) {
      result.valid.should.be.false;
      result.message.should.match(/invalid email address/i);
      done();
    });
  });

  it('should error out on valid domain invalid user', function(done) {
    validator('pnavasard4@katalus.com', function(err, result) {
      result.valid.should.be.false;
      done();
    });
  });

  it('should error on invalid domain', function(done) {
    validator('pnavasard@katalusbuttmunch.com', function(err, result, message) {
      result.valid.should.be.false;
      result.message.should.match(/enotfound/i);
      done();
    });
  });
});
