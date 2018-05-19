'use strict';

const typeMatcher = require('./matchers/type')
const { getMatcher, getType, log } = require('./util')

const matchr = (input, cases) => {
    let matcher = getMatcher(input)
    let matchedSignature = Object.keys(cases)
        .find(signature => matcher(input, signature) || typeMatcher(input, signature));
    let matchedValue = cases[matchedSignature];
    let output;

    if (matchedValue) {
        log('[matchr] matched', input, matchedSignature, matchedValue)
        output = matchedValue;
    } else {
        log('[matchr] nothing matched, trying fallback')
        output = cases['*']
    }   

    return send(input, output)
};

function send(input, value) {
    if (typeof value === 'function') {
        return getType(input) === 'arguments'
            ? value.apply(value, input)
            : value();
    } else if (value) {
        return value;
    } else {
        throw new Error('[matchr] no matches found for input: ' + input)
    }
}

module.exports = matchr;
