var _ = require('lodash');
var fs = require('fs');

module.exports = function (manifestPath) {
    var contents, lines;
    var currentHeader;
    const headers = ['CACHE MANIFEST', 'CACHE:', 'NETWORK:', 'FALLBACK:'];

    contents = fs.readFileSync(manifestPath).toString();

    // remove comments
    lines = _.map(contents.split(/[\n\r]/g), function (line) {
        var commentIndex = line.indexOf('#');
        return (commentIndex == -1) ? line : line.substr(0, commentIndex);
    });

    // remove empty lines
    lines = _.filter(lines, function (line) {
        return line.trim().length > 0;
    });

    currentHeader = null;
    return _.reduce(lines, function (accumulator, value) {
        var argsIndex;
        var line = value.trim();

        // header?
        if (headers.indexOf(line) != -1) {
            currentHeader = line;
            return accumulator;
        }

        // line under non-path header?
        if (currentHeader != 'CACHE MANIFEST' && currentHeader != 'CACHE:') {
            return accumulator;
        }

        // it's a path line; try to strip request args
        argsIndex = line.indexOf('?');
        if (argsIndex != -1) {
            line = line.substr(0, argsIndex);
        }
        return accumulator.concat(line);
    }, []);
};
