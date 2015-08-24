var MESSAGE_TYPES = require('../consts/message-types');

/**
 * @class
 * @name CommandAnalyzer
 * @static
 * @implements {IAnalyzer}
 */
module.exports = {
    is: function (message) {
        return typeof message.text !== 'undefined' &&
            message.text[0] === '/';
    },

    getData: function (message) {
        var messageArray = message.text.split(' ');
        var command = messageArray[0].trim().substr(1).toLowerCase();

        if (command.indexOf('@')) {
            var command = command.split('@');
            var commandFor = command.pop();
            command = command.shift();
        }

        return {
            type: MESSAGE_TYPES.COMMAND,
            weight: 1,
            command: command,
            commandFor: commandFor,
            params: messageArray.length > 1 ?
                messageArray.slice(1).join(' ').trim() :
                null
        };
    }
};
