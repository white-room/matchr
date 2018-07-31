'ust strict';

const { isMatchingSignature } = require('../util')

module.exports = (input, signature) => {
    if (signature[0] !== '[') return false;
    if (signature === '[]') return true;
    if (input.length === 0) return false;

    let parsedValue = parseSignature(signature)
    let usePartialMatch = parsedValue.includes('...')

    if (usePartialMatch) {
        return parsedValue
            .filter(x => x !== '...')
            .every((v, i) => isMatchingSignature(input[i], v))

    } else if (input.length === parsedValue.length) {
        return parsedValue.every((v, i) => isMatchingSignature(input[i], v))
    } else {
        return false;
    }
};

function parseSignature(signature) {
    return signature.slice(1, signature.length - 1)
        .split(',')
        .map(a => a.trim())
}
