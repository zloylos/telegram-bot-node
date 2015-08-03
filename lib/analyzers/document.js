var MESSAGE_TYPES = require('../consts/message-types');

/**
 * @class
 * @name DocumentAnalyzer
 * @static
 * @implements {IAnalyzer}
 */
module.exports = {
    is: function (message) {
        return typeof message.document !== 'undefined';
    },

    getData: function (message) {
        return {
            type: MESSAGE_TYPES.DOCUMENT,
            message: message,
            document: message.document
        };
    }
};
