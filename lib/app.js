var Sonos = require('sonos').Sonos;
var https = require('https');
var HipChat = require('node-hipchat');

var commands = require('./commands');


var app = function(config) {
  app.config = config;
  app.hipClient = new HipChat(config.apiKey);

  console.log('Connecting Sonos...');
  app.sonos = new Sonos(config.ipAddress, config.port);

  app.lastTitle = null;

  setInterval(app.getTrack, config.pollInterval);
  setInterval(app.checkCommands, 6000);

  return app;
}

app.postMessage = function(msg) {
      app.hipClient.postMessage({
        room_id: app.config.roomID,
        from: app.config.msgFrom,
        message: msg,
        color: app.config.msgColor
      });
}

app.getTrack = function() {
 console.log('Polling...');
    app.sonos.currentTrack(function(e, track){
      if (e){
        console.error(e);
        return;
      }
      if (!track){
        console.error(track);
        return;
      };

      var title = track.title;
      if (!title) return;
      if (title == app.lastTitle) return;
      app.lastTitle = title;
      var item = track._item;

      var path = '';
      if (item){
        console.log(item);
        try {
          path = decodeURIComponent(item.res[0]['_']);
        } catch (e){}
      }

      var message = '&#9835; ' + track.title + (track.artist ? (' &ndash; ' + track.artist) : '');

      app.postMessage(message);

    });
};

app.checkCommands = function() {

      app.hipClient.getHistory({
        room_id: app.config.roomID
      }, function(history) {
        var msg = history ? history.messages : [];
        commands(app, msg, function(){});
      });
};

module.exports = app;
