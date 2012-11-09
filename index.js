var validator = require('./lib/validator'),
    express = require('express'),
    gate = require('gate'),
    app = express(),
    port = process.env.PORT || 3000;

app.use(express.bodyParser());
app.use(express.errorHandler());
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/check', function(req, res) {
  var emailsParam = req.param('emails'),
      emails, g;
  if (emailsParam === void 0) {
    res.send(400, 'Include emails');
    return;
  }

  emails = emailsParam.split(/\s/);

  g = gate.create();
  emails.forEach(function(e) {
    if (e.length) {
      validator(e, g.latch(e, 1));
    }
  });

  g.await(function(err, results) {
    res.render('check', {results: results});
  });
});

app.listen(port);
