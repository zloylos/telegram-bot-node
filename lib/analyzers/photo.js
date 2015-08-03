var MESSAGE_TYPES = require('../consts/message-types');

/**
 * @class
 * @name PhotoAnalyzer
 * @static
 * @implements {IAnalyzer}
 */
module.exports = {
    is: function (message) {
        return typeof message.photo !== 'undefined';
    },

    getData: function (message) {
        return {
            type: MESSAGE_TYPES.PHOTO,
            message: message,
            photo: message.photo
        };
    }
};
