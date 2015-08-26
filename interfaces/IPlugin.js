/**
 * @class Plugin interface for telegram bot.
 * @name IPlugin
 * @interface
 * @static
 */
var plugin = {
    /**
     * Type of messages, when a plugin should be run.
     * @field
     * @type {String}
     */
    type: 'TEXT',

    /**
     * Weight of a plugin.
     * @field
     * @type {Number}
     */
     weight: 0.2,

    /**
     * @param {Object} info
     * @param {TelegramMessage} info.message
     * @param {Object} info.data Information from a message analyzer.
     * @returns {Boolean}
     *
     * @example
     * // If this is text message.
     * test: function (info) {
     *     return typeof info.message.text === 'string';
     * }
     *
     * @example
     * // If is the `weather` command (`/weather`).
     * test: function (info) {
     *     return info.data.command === 'weather';
     * }
     */
    test: function (information) {},

    /**
     * @param {Object} info
     * @param {TelegramMessage} info.message
     * @param {Object} info.data Information from analyzer.
     * @param {Object} [info.user] User object.
     * @param {TelegramBot} bot
     * @returns {Promise|any} Promise of any object if you don't use async operations.
     */
    handler: function (info, bot) {}
};
