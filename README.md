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
  // Folder with plugins for bot
  plugins: path.resolve(__dirname, './lib/plugins/)
});

// Now listen `message` event.
myBot.on('message', function (msg) {
  myBot.handle(msg);
  // Run plugins.
  myBot.process();
});

### Add plugins
Create file with custom name into plugins folder.
```js
// Allowed message types: audio, video, document, command and other.
var MESSAGE_TYPES = require('telegram-bot-node').MESSAGE_TYPES;

module.exports = {
  // Type for match plugin on message.
  type: MESSAGE_TYPES.COMMAND,
  // Weight of plugin. If we have 2 or more plugins matched on one type, 
  // then will be call plugin with more weight.
  weight: 1,
  // Test message selected type.
  test: function (info) {
    // for messages, like: "/help bot"
    return info.data.command === 'help';
  },
  // Handle function will call when type matcher and test passed.
  handle: function (info, bot) {
    // log: bot
    console.log(info.data.params);
    bot.sendMessage('How can I help you?');
  }
}
```
