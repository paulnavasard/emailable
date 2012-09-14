var dns = require('dns'),
    net = require('net'),
    EventEmitter = require('events').EventEmitter;

module.exports = function(email, cb) {
  var instance = new Validator(email, cb);
  instance.run();
  return instance;
};

function Validator(email, cb) {
  EventEmitter.call(this);
  this.email = email;
  this.segments = this.parseEmail(email);
  this._data = "";
  this._cb = cb;
  this.debug = false;

  for(var key in this) {
    if (key.substr(0,1) === "_" && typeof this[key] === 'function') {
      this[key] = this[key].bind(this);
    }
  }
}

Validator.prototype = proto = new EventEmitter();

proto.parseEmail = function() {
  var pattern = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i,
  match = pattern.exec(this.email);
  return match == void 0 ? undefined : {
    email: match[0],
    user: match[1],
    host: match[2]
  };
};

proto.sendCommand = function(cmd) {
  this.stream.write(new Buffer(cmd+"\r\n", "utf-8"));
};

proto._resolveMxHosts = function() {
  dns.resolveMx(this.segments.host,this._onResolve);
};

proto._onResolve = function(err, hosts) {
  if (err) {
    this._error(err);
    return;
  }
  var host = hosts[0].exchange;
  this.emit('resolveMx', hosts);
  this.stream = net.createConnection(25, host, this._onConnect);
};

proto._onConnect = function() {
  this.emit('connect');
  this.stream.on('data', this._onData);
};

proto._onData = function(chunk) {
  var line;

  if (!chunk || !chunk.length) return;

  this._data += chunk.toString();

  if (chunk[chunk.length - 1] !== 0x0A) return; //newline

  line = this._data.trim();
  this._data = "";
  this.debug && console.log('DATA: ' + line);

  var action = this._actions.shift();
  if (action) {
    action(line);
  }
};

proto._parseGreeting = function(line) {
  if (line.substr(0,3) !== "220") {
    this._error('Not a happy greeting: ' + line);
    return;
  }

  this.sendCommand('HELO example.com');
};

proto._mailFrom = function(line) {
  if (line.substr(0,1) !== "2") {
    this._error('Did not like HELO: ' + line);
    return;
  }

  this.sendCommand('MAIL FROM:<test@example.com>');
};

proto._rcpt = function(line) {
  if (line.substr(0,1) !== "2") {
    this._error('Did not like MAIL FROM: ' + line);
    return;
  }

  this.sendCommand('RCPT TO:<' + this.email +'>');
};

proto._finish = function(line) {
  var valid = line.substr(0,1) === "2";
  this._cb(void 0, valid);

  this.sendCommand('QUIT');
};

proto._error = function(message) {
  var errorObj = typeof message == 'string' ? new Error(message) : message;
  this._cb && this._cb(errorObj, false);
};

proto.run = function(cb) {
  this._actions = [
    this._parseGreeting,
    this._mailFrom,
    this._rcpt,
    this._finish
  ];
  this._resolveMxHosts();
};
