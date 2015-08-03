/**
 * @class Plugin interface for telegram bot.
 * @name IPlugin
 * @interface
 * @static
 */
var plugin = {
    /**
     * Type of messages, when plugin should be run.
     * @field
     * @type {String}
     */
    type: 'TEXT',

    /**
     * @param {Object} info
     * @param {TelegramMessage} info.message
     * @param {Object} info.data Information from analyzer.
     * @returns {Boolean}
     *
     * @example
     * // If this is text message.
     * is: function (message) {
     *     return typeof message.text === 'string';
     * }
     */
    is: function (information) {},

    /**
     * @param {Object} info
     * @param {TelegramMessage} info.message
     * @param {Object} info.data Information from analyzer.
     * @param {Object} [info.user] User object.
     * @param {TelegramBot} bot
     */
    handler: function (info, bot) {}
};
