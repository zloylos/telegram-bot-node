var inherit = require('inherit');
var path = require('path');
var fs = require('fs');

// Types of message.
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

        // Get all plugins from folder (recursive).
        var pluginsList = typeof plugins === 'string' ?
            getPlugins(plugins) :
            plugins;

        pluginsList.forEach(function (plugin) {
            var category = this._plugins[plugin.for];
            if (Array.isArray(category)) {
                category.push(plugin);
            } else {
                this._plugins[plugin.for] = [plugin];
            }
        }, this);
    },

    /**
     * @param {Object} data Information about the message from analyzers.
     * @returns {Promise}
     */
    process: function (data) {
        var bot = this._bot;
        var plugins = this._plugins;
        var pluginsCategory = [].concat(
                plugins[data.type],
                plugins[MESSAGE_TYPES.ALL]
            )
            .filter(Boolean);

        // If plugins not found in category.
        if (!pluginsCategory.length) {
            return;
        }

        var plugin = pluginsCategory
            .filter(function (plugin) {
                return plugin.is(data.message);
            })
            .sort(function (a, b) {
                return b.weight - a.weight;
            })[0];

        // If we doesn't have plugins, which match the message.
        if (!plugin) {
            return;
        }

        // Show plugin name in debug mode.
        if (bot.isDebugMode()) {
            console.log('Run: ', plugin.name);
        }

        var information = {
            message: data.message,
            data: data
        };

        // Run plugin.
        if (!bot.getUsersCollection()) {
            plugin.handler(information, bot);
        } else {
            bot.user.get().then(function (user) {
                information.user = user;
                plugin.handler(information, bot);
            });
        }
    }
});

/**
 * @ignore
 * @param {String} pluginsDir
 * @param {IPlugin[]} [plugins=[]]
 * @returns {IPlugins[]} All plugins form `pluginsDir` folder.
 */
function getPlugins(pluginsDir, plugins) {
    plugins = plugins || [];
    fs.readdirSync(pluginsDir)
        .forEach(function (item) {
            var itemPath = path.resolve(pluginsDir, item);
            var stats = fs.statSync(itemPath);

            if (stats.isDirectory()) {
                getPlugins(pluginsDir, plugins);
            } else {
                plugins.push(require(itemPath));
            }
        });

    return plugins;
}

module.exports = MessageController;
