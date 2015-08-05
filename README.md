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
var TelegramBot = require('telegram-bot-node).Bot;
var myBot = new TelegramBot('<TOKEN>', {
  pooling: true,
  // Folder with plugins.
  plugins: path.resolve(__dirname, './lib/plugins/)
});

// Now listen `message` event.
myBot.on('message', function (msg) {
  myBot.handle(msg);
  // Run plugins.
  myBot.process();
});
```

### Add plugins
Create plugin, for example, weather. You can use custom file name.
`./lib/plugins/commands/weather.js` or simple `./lib/plugins/weather.js`:
```js
// Allowed message types: audio, video, document, command and other.
var MESSAGE_TYPES = require('telegram-bot-node').MESSAGE_TYPES;
var request = require('superagent');
var WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';
var K = 273.15;

module.exports = {
  // Type for match plugin on message.
  type: MESSAGE_TYPES.COMMAND,
  // Weight of plugin. If we have 2 or more plugins matched on one type, 
  // then will be call plugin with more weight.
  weight: 1,
  // Test message selected type.
  test: function (info) {
    // for messages, like: "/weather London"
    return info.data.command === 'weather';
  },
  // Handle function will call when type matcher and test passed.
  handle: function (info, bot) {
    // log: bot
    // all after command. For `/weather London` params = `London`.
    var city = info.data.params;
    request
      .get(WEATHER_URL)
      .query({q: city})
      .end(function (err, resp) {
        if (err || resp.statusCode != 200) {
          console.error(err || new Error('Status code: ' + resp.statusCode)));
        }
        var result = resp.body;
        var city = result.name;
        var temperature = Math.floor(result.main.temp - K);
        var description = result.weather[0].description;

        bot.sendMessage('Weather in ' + city + ': ' + temperature + '°C. ' + description);
      });
  }
};
```

### Message types.
For use plugins you must set type of plugin. Allowed types stores in `MESSAGE_TYPES` var.
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
* ALL
