var validator = require('./lib/validator');

var v = validator('kjklasdjklk@gmail.com');
v.on('resolveMx', function(hosts) { console.dir(hosts); });
v.on('connect', function() { console.log('connected'); });
v.on('error', function(err) { console.error(err); });
v.run(function(err, valid){
  console.log('Valid: ' + valid);
});
