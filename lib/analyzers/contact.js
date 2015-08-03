var MESSAGE_TYPES = require('../consts/message-types');

/**
 * @class
 * @name ContactAnalyzer
 * @static
 * @implements {IAnalyzer}
 */
module.exports = {
    is: function (message) {
        return typeof message.contact !== 'undefined';
    },

    getData: function (message) {
        return {
            type: MESSAGE_TYPES.CONTACT,
            weight: 1,
            contact: message.contact
        };
    }
};
