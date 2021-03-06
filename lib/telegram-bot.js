var inherit = require('inherit');
var TelegramBot = require('node-telegram-bot-api');

var MessageController = require('./message-controller');
var UserController = require('./user-controller');
var messageAnalyzer = require('./message-analyzer');

/**
 * @class
 * @name Bot
 * @augments {NodeTelegramBotApi}
 */
var Bot = inherit(TelegramBot, {
    /**
     * @param {String} token Telegram bot token.
     * @param {Object} options
     * @param {String|IPlugins[]} [options.plugins]
     * @param {String} [options.name] [Bot name for command plugins]
     * @param {Boolean|Object} [options.polling=false] Set true to enable polling.
     * @param {String|Number} [options.polling.timeout=4] Polling time.
     * @param {Boolean|Object} [options.webHook=false] Set true to enable WebHook.
     * @param {String} [options.webHook.key] PEM private key to webHook server.
     * @param {String} [options.webHook.cert] PEM certificate key to webHook server.
     * @see https://core.telegram.org/bots/api
     */
    __constructor: function (token, options) {
        this.__base.apply(this, arguments);

        this._name = options.name;

        this.user = new UserController(this);
        this._messageController = new MessageController(this, options.plugins);

        this._chatId = null;
        this._usersCollection = null;
        this._currentMessage = null;

        this._messagesQueue = [];
        this._isRunning = false;
    },

    /**
     * @returns {String} Bot name in lower case.
     */
    getName: function () {
        return this._name.toLowerCase();
    },

    /**
     * @param {Number} chatId
     * @returns {Bot}
     */
    setChatId: function (chatId) {
        this._chatId = chatId;

        return this;
    },

    /**
     * @param {MongoDBCollection} collection
     * @returns {Bot}
     */
    setUsersCollection: function (collection) {
        this._usersCollection = collection;
        this.user.setUsersCollection(collection);

        return this;
    },

    /**
     * @returns {MongoDBCollection|null}
     */
    getUsersCollection: function () {
        return this._usersCollection;
    },

    /**e
     * @returns {TelegramMessage}
     */
    getCurrentMessage: function () {
        return this._currentMessage;
    },

    sendMessage: function (message, options) {
        return this.__base.call(this, this._chatId, message, options);
    },

    forwardMessage: function (fromChatId, messageId) {
        return this.__base.call(this, this._chatId, fromChatId, messageId);
    },

    sendPhoto: function (photo, options) {
        return this.__base.call(this, this._chatId, photo, options);
    },

    sendAudio: function (audio, options) {
        return this.__base.call(this, this._chatId, audio, options);
    },

    sendVideo: function (video, options) {
        return this.__base.call(this, this._chatId, video, options);
    },

    sendDocument: function (doc, options) {
        return this.__base.call(this, this._chatId, doc, options);
    },

    sendSticker: function (sticker, options) {
        return this.__base.call(this, this._chatId, sticker, options);
    },

    sendChatAction: function (action) {
        return this.__base.call(this, this._chatId, action);
    },

    sendLocation: function (latitude, longitude, options) {
        return this.__base.call(this, this._chatId, latitude, longitude, options);
    },

    /**
     * Handle message.
     * @param {Object} message Telegram message.
     * @returns {Bot}
     */
    handle: function (message) {
        this._messagesQueue.push(message);
        this.process();
        return this;
    },

    /**
     * Process the messages queue.
     */
    process: function () {
        if (!this._messagesQueue.length) {
            return;
        }

        if (!this._isRunning) {
            var message = this._currentMessage = this._messagesQueue.shift();
            var data = messageAnalyzer.analyze(message);
            var onProcessed = this._onProcessed.bind(this);

            this.setChatId(message.chat.id);
            this._isRunning = true;

            var result = this._messageController.process(data)
                .then(onProcessed, onProcessed);

            if (typeof result.catch === 'function') {
                result.catch(onProcessed);
            }
            if (typeof result.fail === 'function') {
                result.fail(onProcessed);
            }
        } else {
            this._processTimeout = setTimeout(this.process.bind(this), 1);
        }
    },

    _onProcessed: function () {
        if (this._processTimeout) {
            clearTimeout(this._processTimeout);
            this._processTimeout = null;
        }

        this._isRunning = false;

        if (this._messagesQueue.length) {
            this.process();
        }
    }
});

module.exports = Bot;
