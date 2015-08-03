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
            weight: 1,
            audio: message.audio
        };
    }
};
