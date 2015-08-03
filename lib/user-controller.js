var inherit = require('inherit');

/**
 * @class
 * @name UserController
 */
var UserController = inherit({
    /**
     * @param {TelegramBot} bot Application
     */
    __constructor: function (bot) {
        this._bot = bot;
        this._dbUsersCollection = null;
    },

    /**
     * Set users collection from MongoDB.
     * @param {MongoCollection} usersCollection Collection with users.
     * @returns {UserController}
     */
    setUsersCollection: function (usersCollection) {
        this._dbUsersCollection = usersCollection;
        return this;
    },

    /**
     * Set info for current user.
     * @param {Object} data
     * @returns {Promise}
     */
    setData: function (data) {
        var user = this._bot.getCurrentMessage().from;
        return this._dbUsersCollection.updateOne(
            {_id: user.id},
            {$set: data},
            {upsert: true, w: 1}
        );
    },

    /**
     * Get current user.
     * @returns {Promise}
     */
    get: function () {
        var user = this._bot.getCurrentMessage().from;
        return this._dbUsersCollection.find({_id: user.id})
            .toArray()
            .then(function (results) {
                return results[0];
            });
    }
});

module.exports = UserController;
