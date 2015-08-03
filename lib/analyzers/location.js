var MESSAGE_TYPES = require('../consts/message-types');

/**
 * @class
 * @name LocationAnalyzer
 * @static
 * @implements {IAnalyzer}
 */
module.exports = {
    is: function (message) {
        return typeof message.location !== 'undefined';
    },

    getData: function (message) {
        return {
            type: MESSAGE_TYPES.LOCATION,
            message: message,
            location: message.location
        };
    }
};
