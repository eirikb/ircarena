'use strict';

var ircdjs = require('ircdjs');
var _ = require('underscore');
var cp = require('child_process');

var config = require('./config.json');

var winston = require('winston')
winston.remove(winston.transports.Console);

config.servers.forEach(function(serverConfg) {
  init(serverConfg);
});

function init(serverConfig) {
  var server = new ircdjs.Server();
  server.config = {
    port: serverConfig.port
  };

  server.start();

  _.times(config.maxClients, function(id) {

    var n = cp.fork(__dirname + '/client.js');
    n.send({
      id: id,
      nicks: config.nicks,
      serverConfig: serverConfig
    });
  });
}
