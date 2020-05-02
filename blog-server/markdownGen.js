var commonmark = require('commonmark');
exports.markdownGen = function(str) {
    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();
    var parsed = reader.parse(str); // parsed is a 'Node' tree
    // transform parsed if you like...
    var result = writer.render(parsed); // result is a String
    return result;
}