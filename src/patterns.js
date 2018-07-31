'use strict';

function expression(start, body, end) {
    let exp = arguments.length === 3
        ? start + '(' + body + ')' + end
        : body;
    let regex = new RegExp(`^${exp}$`, 'i');

    return {
        regex,
        start: regex.toString()[2]
    };
}

module.exports = {
    any: expression('_'),
    arguments: expression('[object Arguments]'),
    array: expression('[', '.*', ']'),
    function: '()=>{}',
    object: expression('{', '.*', '}'),
    type: expression('<', '\\w+', '>'),
};
