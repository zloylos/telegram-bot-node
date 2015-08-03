var MESSAGE_TYPES = require('../consts/message-types');

/**
 * @class
 * @name VideoAnalyzer
 * @static
 * @implements {IAnalyzer}
 */
module.exports = {
    is: function (message) {
        return typeof message.video !== 'undefined';
    },

    getData: function (message) {
        return {
            type: MESSAGE_TYPES.VIDEO,
            weight: 1,
            video: message.video
        };
    }
};
