var validator = require('./lib/validator');

var v = validator('adfasdfsfdasfd83843@gmail.com', function(err, valid) {
  console.log('Valid: ' + valid);
});
v.on('resolveMx', function(hosts) { console.dir(hosts); });
v.on('connect', function() { console.log('connected'); });
v.on('error', function(err) { console.error(err); });
