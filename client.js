'use strict';

var irc = require('irc');
var _ = require('underscore');
var quotes = require('./quotes.json');

function r(n) {
  if (Array.isArray(n)) return n[Math.floor(Math.random() * n.length)];
  return Math.floor(Math.random() * n);
}

var interval;

exports.Client = function(nicks, serverConfig) {
  var nick = r(nicks);
  nick = nick.replace(/[ -]/g, '_').slice(0, 9);

  var channels = _.clone(serverConfig.channels);

  var port = serverConfig.port;
  var client = new irc.Client('localhost', nick, {
    port: port,
    channels: channels
  });

  client.addListener('error', function(message) {
    console.log(nick, 'error:', message);
  });

  client.addListener('registered', function() {
    var intervalTime = 2000 + r(10000);

    var action = function() {
      var channel = r(channels);

      var a = {
        msg: function() {
          if (!channel) return;
          var m = r(quotes);
          var isAction = m.match(/^\[(.*)\]$/);

          if (isAction) client.action(channel, isAction[1]);
          else client.say(channel, m);
        },
        /*
         * Currently not possible?
        part: function() {
          if (!channel) return;
          channels = _.without(channels, channel);
          client.part(channel);
        },
        join: function() {
          channel = r(_.difference(serverConfig.channels, channels));
          if (!channel) return;

          channels.push(channel);
          client.join(channel);
        }
      */
      };
      var as = r(_.keys(a));
      a[as]();
    };

    interval = setInterval(function() {
      action(client, nick);
    }, intervalTime);
  });
};
