var inherit = require('inherit');
var fs = require('fs');
var path = require('path');

// Get all analyzers from `analyzers` folder.
var analyzers = getAnalyzers(path.resolve(__dirname, './analyzers/'));

/**
 * @class
 * @name MessageAnalyzer
 * @static
 */
module.exports = {
    /**
     * Analyze user message and return info.
     * @param {TelegramMessage} message Telegram message.
     * @returns {Object|Null} Analyzers info about the message.
     */
    analyze: function (message) {
        var analyzer = analyzers
            .filter(function (analyzer) {
                return analyzer.is(message);
            })
            .sort(weightComparator);

        return analyzer.length ?
            analyzer[0].getData(message) :
            null;
    }
};

/**
 * @ignore
 * @param {String} analyzersDir
 * @returns {IAnalyzers[]}
 */
function getAnalyzers(analyzersDir) {
    return fs.readdirSync(analyzersDir)
        .filter(function (file) {
            var fileInfo = path.parse(file);
            return fileInfo.ext == '.js';
        })
        .map(function (file) {
            return require(path.resolve(analyzersDir, file));
        });
}

/**
 * @param {IAnalyzer} a
 * @param {IAnalyzer} b
 * @returns {Number}
 */
function weightComparator(a, b) {
    return b.weight - a.weight;
}
