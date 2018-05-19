'ust strict';

const arrayMatcher = require('./array')

module.exports = (p1, p2) => {
    return arrayMatcher(Array.from(p1), `[${p2}]`)
};
