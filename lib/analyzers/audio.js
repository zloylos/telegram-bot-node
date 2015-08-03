var MESSAGE_TYPES = require('../consts/message-types');

/**
 * @class
 * @name AudioAnalyzer
 * @static
 * @implements {IAnalyzer}
 */
module.exports = {
    is: function (message) {
        return typeof message.audio !== 'undefined';
    },

    getData: function (message) {
        return {
            type: MESSAGE_TYPES.AUDIO,
            message: message,
            audio: message.audio
        };
    }
};
