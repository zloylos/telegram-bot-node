var MESSAGE_TYPES = require('../consts/message-types');

/**
 * @class
 * @name TextAnalyzer
 * @static
 * @implements {IAnalyzer}
 */
module.exports = {
    is: function (message) {
        return typeof message.text !== 'undefined';
    },

    getData: function (message) {
        return {
            type: MESSAGE_TYPES.TEXT,
            weight: 0.5,
            text: message.text
        };
    }
};
