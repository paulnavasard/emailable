var should = require('chai').should()
  , validator = require('../lib/validator');

describe('test', function() {
  it('should validate a good email', function(done) {
    validator('pnavasard@katalus.com', function(err, result) {
      result.should.equal(true);
      done();
    });
  });

  it('should error out on valid domain invalid user', function(done) {
    validator('pnavasard4@katalus.com', function(err, result) {
      console.log(err);
      result.should.equal(false);
      done();
    });
  });
});
