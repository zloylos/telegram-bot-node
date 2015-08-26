var inherit = require('inherit');
var vow = require('vow');
var path = require('path');
var fs = require('fs');

// Types of messages.
var MESSAGE_TYPES = require('./consts/message-types');

/**
 * @class
 * @name MessageController
 */
var MessageController = inherit({
    /**
     * @param {TelegramBot} bot
     * @param {String|IPlugin} [plugins]
     */
    __constructor: function (bot, plugins) {
        plugins = plugins || [];

        this._bot = bot;
        this._plugins = {};

        // Get recursive all plugins from folder.
        var pluginsList = typeof plugins === 'string' ?
            getPlugins(plugins) :
            plugins;

        pluginsList.forEach(function (plugin) {
            var category = this._plugins[plugin.type];
            if (Array.isArray(category)) {
                category.push(plugin);
            } else {
                this._plugins[plugin.type] = [plugin];
            }
        }, this);
    },

    /**
     * @param {Object} data Information about the message from analyzers.
     * @returns {Promise}
     */
    process: function (data) {
        data = data || {};

        var bot = this._bot;
        var message = bot.getCurrentMessage();
        var plugins = this._plugins;
        var pluginsCategory = [].concat(plugins[data.type], plugins[MESSAGE_TYPES.ALL]).filter(Boolean);
        var information = {
            message: message,
            data: data
        };

        // If plugins not found in category.
        if (!pluginsCategory.length) {
            return vow.reject(new Error('Not found plugins for category'));
        }

        var plugin = pluginsCategory
            .filter(function (plugin) {
                var isCommand = data.type === MESSAGE_TYPES.COMMAND;
                // If we have bot name and get message in group chat like this:
                // `/start@myBot` -> we should not react on the message if bot name is not `myBot`.
                if (isCommand && data.commandFor && bot.getName()) {
                    return data.commandFor === bot.getName() && plugin.test(information);
                } else {
                    return plugin.test(information);
                }
            })
            .sort(weightComparator)[0];

        // If we have not plugins, which match the message.
        if (!plugin) {
            return vow.reject(new Error('Have not plugins, which mathch the message'));
        }

        // Run plugin.
        var result;
        if (!bot.getUsersCollection()) {
            result = plugin.handler(information, bot);
            return isPromise(result) ?
                result :
                vow.resolve(result);
        } else {
            return bot.user.get().then(function (user) {
                information.user = user;
                return plugin.handler(information, bot);
            });
        }
    }
});

/**
 * @ignore
 * @param {String} dir
 * @returns {IPlugin[]} All plugins from `dir` folder.
 */
function getPlugins(dir, plugins) {
    plugins = plugins || [];
    fs.readdirSync(dir)
        .forEach(function (item) {
            var itemPath = path.resolve(dir, item);
            var stats = fs.statSync(itemPath);

            if (stats.isDirectory()) {
                getPlugins(itemPath, plugins);
            } else {
                var itemExtension = item.split('.').pop();
                if (itemExtension === 'js') {
                    plugins.push(require(itemPath));
                }
            }
        });

    return plugins;
}

/**
 * Check the object is a promise.
 * @param {Object} value
 * @returns {Boolean}
 */
function isPromise(value) {
    return value && typeof value.then === 'function';
}

/**
 * Weight comparator for plugins.
 * @param {IPlugin} a
 * @param {IPlugin} b
 * @returns {Number}
 */
function weightComparator (a, b) {
    var aWeight = a.weight || 0;
    var bWeight = b.weight || 0;

    return b.weight - a.weight;
}

module.exports = MessageController;
