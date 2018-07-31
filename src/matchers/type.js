'ust strict';

const { type } = require('../patterns');

module.exports = (input, signature) => {
    if (signature[0] !== type.start) return false;

    const regexMatch = signature.match(type.regex);
    const constructor = regexMatch && regexMatch[1];

    return constructor && input.constructor === ((global || window)[constructor]);
};
