var lastCheck = new Date().getTime();

module.exports = function(app, messages, callback) {

  //go through the messages and check if there is a command hidden
  messages.forEach(function(m) {
    var mDate = new Date(m.date).getTime();
    //search in the message for the keyword sono
    if(m.message.indexOf('@sonos') !== -1 && mDate > lastCheck && m.from.name !== 'Sonos') {
      lastCheck = mDate;
      var valid = false;

      console.log('SONOS command')
      if(m.message.indexOf('shut') !== -1 && m.message.indexOf('up') !== -1) {
        valid = true;
        app.sonos.setVolume(0, function(err){
          app.postMessage('Ok :(')
        });
      }

      if(m.message.indexOf('louder++') !== -1) {
        valid = true;
        app.sonos.getVolume(function(err, volume) {
          app.sonos.setVolume(volume + 15, function() {
            app.postMessage('Volume is now ' + (volume+15));
          });
        });
      } else if(m.message.indexOf('louder') !== -1) {
        valid = true;
        app.sonos.getVolume(function(err, volume) {
          app.sonos.setVolume(volume + 5, function() {
            app.postMessage('Volume is now ' + (volume+5));
          });
        });
      }

      if(m.message.indexOf('quieter--') !== -1) {
        valid = true;
        app.sonos.getVolume(function(err, volume) {
          app.sonos.setVolume(volume - 15, function() {
            app.postMessage('Volume is now ' + (volume-15));
          });
        });
      } else if(m.message.indexOf('quieter') !== -1) {
        valid = true;
        app.sonos.getVolume(function(err, volume) {
          app.sonos.setVolume(volume - 5, function() {
            app.postMessage('Volume is now ' + (volume-5));
          });
        });
      }


      if(m.message.indexOf('volume?') !== -1) {
        valid = true;
        app.sonos.getVolume(function(err, volume) {
          app.postMessage('Vol ' + volume);
        });
      }

      if(m.message.indexOf('next') !== -1) {
        valid = true;
        app.sonos.next(function(err, success) {
          if(err || ! success) {
            console.log(err);
            app.postMessage('No can do, sorry');
          }
        });
      }

      if(m.message.indexOf('previous') !== -1) {
        valid = true;
        app.sonos.previous(function(err, success) {
          if(err || ! success) {
            console.log(err);
            app.postMessage('No can do, sorry');
          }
        });
      }

      if(m.message.indexOf('state?') !== -1) {
        valid = true;
        app.sonos.getCurrentState(function(err, state) {
          app.postMessage('Current state is ' + state);
        });
      }

      if(m.message.indexOf('help?') !== -1) {
        valid = true;
        app.postMessage('Here you go: <br /><br />"@sonos help?" - lists all commands<br />"@sonos shut up" - sets volume to 0<br />"@sonos volume?" - Tells you current volume<br />"@sonos louder/louder++" - increases volume by 5/15<br />"@sonos quieter/quieter--" - decreases volume by 5/15<br />"@sonos next" - Play next song in queue<br />"@sonos previous" - Play previous song in queue');
      }

      if(!valid) {
        app.postMessage('I don\'t understand you. Type "@sonos help?" for more Information');
      }
    }
  });
};
