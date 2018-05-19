'ust strict';

const { isMatch } = require('../util')

module.exports = (p1, p2) => {
    if (p2[0] !== '[') {
        return false;
    }

    if (p2 === '[]') {
        return true;
    }

    if (p1.length === 0) {
        return false;
    }

    let p2parsed = parseSignature(p2)
    let usePartialMatch = p2parsed.includes('...')

    if (usePartialMatch) {
        return p2parsed
            .filter(x => x !== '...')
            .every((v, i) => isMatch(p1[i], v))

    } else if (p1.length === p2parsed.length) {
        return p2parsed.every((v, i) => isMatch(p1[i], v))
    } else {
        return false;
    }
};

function parseSignature(sig) {
    let parsed = sig.trim();

    return parsed.slice(1, parsed.length - 1)
        .split(',')
        .map(x => x.trim())
}
