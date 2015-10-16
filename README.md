# telegram-bot-node
Plugins-driven telegram bot on Node.js.

## Requirements
* nodejs >= 0.10
* npm >= 1.2.0

## Install
```
npm i --save telegram-bot-node
```

## Quck guide
### Setup bot
```js
var path = require('path');
var TelegramBot = require('telegram-bot-node').Bot;
var myBot = new TelegramBot('<TOKEN>', {
  name: 'myBeatifulBot',
  polling: true,
  // Folder with plugins.
  plugins: path.resolve(__dirname, './lib/plugins/')
});

// Now listen `message` event for polling.
myBot.on('message', function (msg) {
  myBot.handle(msg);
});
```

### Plugins
All plugins looks like this:
```js
var plugin = {
  // Type for match a plugin to a message.
  type: MESSAGE_TYPES.COMMAND,
  // Weight of plugin. If we have 2 or more plugins matched on one type, 
  // then will be call plugin with more weight.
  weight: 1,
  // Checking that a plugin is we need.
  // Returns boolean. True if passed and false if not.
  test: function (info) {
    return info.data.command === 'weather';
  },
  // Function-handler for messages, like: "/weather London".
  // It will be call if type of message and type of plugin the same. 
  // And test function is passed.
  handler: function (info, bot) {}
};
```

Information object:
```js
var info = {
  data: {}, // information from message analyzers
  message: {}, // current telegram message
  user: {} || undefined // telegram user
};
```
For use plugins you must set type of a plugin. Allowed types store in `MESSAGE_TYPES` var.
```js
var MESSAGE_TYPES = require('telegram-bot-node').MESSAGE_TYPES;
```
Types:
* COMMAND
* LOCATION
* TEXT
* PHOTO
* AUDIO
* VIDEO
* ACTION
* CONTACT
* STICKER
* DOCUMENT
* ALWAYS
* ALL

### Example: create weather plugin
Create weather plugin. You can use custom file name, for example `./lib/plugins/commands/weather.js` or simple `./lib/plugins/weather.js`:
```js
var MESSAGE_TYPES = require('telegram-bot-node').MESSAGE_TYPES;
var request = require('superagent');
// Promises lib, you can use bluebirs, vow or other.
var vow = require('vow');
var WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';
var K = 273.15;


module.exports = {
  // Match only on commands.
  type: MESSAGE_TYPES.COMMAND,
  weight: 1,
  test: function (info) {
    // Check that the command is `weather`.
    return info.data.command === 'weather';
  },
  handler: function (info, bot) {
    // Command `/weather London` has info.data.params = `London`
    var deferred = vow.defer();
    var city = info.data.params;
    request
      .get(WEATHER_URL)
      .query({q: city})
      .end(function (err, resp, body) {
        if (err || resp.statusCode !== 200) {
          var error = err || new Error('Status code: ' + resp.statusCode));
          console.error(error);
          return deferred.reject(error);
        }
        var result = body;
        var city = result.name;
        var temperature = Math.floor(result.main.temp - K);
        var description = result.weather[0].description;
        bot.sendMessage('Weather in ' + city + ': ' + temperature + '°C. ' + description)
          .then(function (resp) {
            deferred.resolve(resp);
          }, function (reason) {
            deferred.reject(reason);
          });
      });
      return deferred.promise();
  }
};
```
