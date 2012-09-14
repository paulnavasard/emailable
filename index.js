var validator = require('./lib/validator'),
    express = require('express'),
    app = express();

app.engine('jade', require('jade').__express);
app.use(express.bodyParser());

app.get('/', function(req, res) {
  res.render('index.jade');
});

app.post('/check', function(req, res) {
  var email = req.param('email');
  if (email === void 0) {
    res.send(400, 'Include an email');
    return;
  }

  validator(email, function(err, valid) {
    var text = valid ? 'Yep' : 'Nope';
    res.send(text);
  });
});

app.listen(3000);
