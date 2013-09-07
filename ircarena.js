'use strict';

var ircdjs = require('ircdjs');
var _ = require('underscore');
var Client = require('./client.js').Client;

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


    var c = new Client(config.nicks, serverConfig);
  });
}
