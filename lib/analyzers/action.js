var MESSAGE_TYPES = require('../consts/message-types');

var ACTIONS = {
    NEW_CHAT_USER: 'new_chat_participant',
    USER_LEFT_CHAT: 'left_chat_participant',
    NEW_TITLE: 'new_chat_title',
    NEW_PHOTO: 'new_chat_photo',
    DELETE_PHOTO: 'delete_chat_photo',
    CREATED: 'group_chat_created'
};

/**
 * @class
 * @name ActionAnalyzer
 * @static
 * @implements {IAnalyzer}
 */
module.exports = {
    is: function (message) {
        for (var action in ACTIONS) {
            if (ACTIONS.hasOwnProperty(action)) {
                if (typeof message[ACTIONS[action]] !== 'undefined') {
                    return true;
                }
            }
        }
        return false;
    },

    getData: function (message) {
        var data = {
            type: MESSAGE_TYPES.ACTION,
            weight: 1
        };

        for (var action in ACTIONS) {
            if (ACTIONS.hasOwnProperty(action)) {
                if (typeof message[ACTIONS[action]] !== 'undefined') {
                    data.action = action;
                    break;
                }
            }
        }

        switch (data.action) {
            case ACTIONS.NEW_CHAT_USER:
            case ACTIONS.USER_LEFT_CHAT:
                data.user = message[ACTIONS.NEW_CHAT_USER] || message[ACTIONS.USER_LEFT_CHAT];
                break;

            case ACTIONS.NEW_TITLE:
                data.title = message[ACTIONS.NEW_TITLE];
                break;

            case ACTIONS.NEW_PHOTO:
            case ACTIONS.DELETE_PHOTO:
                data.photo = message[ACTIONS.NEW_PHOTO] || message[ACTIONS.DELETE_PHOTO];
                break;

            case ACTIONS.CREATED: 
                data.newChat = message[ACTIONS.CREATED];
                break;
        }

        return data;
    }
};
