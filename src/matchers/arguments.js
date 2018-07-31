'ust strict';

const arrayMatcher = require('./array')

module.exports = (input, signature) => {
    return arrayMatcher(Array.from(input), `[${signature}]`)
};
