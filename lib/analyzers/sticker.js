var MESSAGE_TYPES = require('../consts/message-types');

/**
 * @class
 * @name StickerAnalyzer
 * @static
 * @implements {IAnalyzer}
 */
module.exports = {
    is: function (message) {
        return typeof message.sticker !== 'undefined';
    },

    getData: function (message) {
        return {
            type: MESSAGE_TYPES.STICKER,
            message: message,
            sticker: message.sticker
        };
    }
};
