'use strict';

const debug = false;

const matchers = {};

function getMatcher(input) {
    let inputType = getType(input);
    let matcher = matchers[inputType] || require('./matchers/' + inputType);

    if (!matcher) {
        throw new Error('[matchr] type not supported: ' + inputType);
    }

    return matcher
}

function checkForTypeSignatureOrFalse(p1, p2) {
    matchers.type || (matchers.type = require('./matchers/type'));
    return isTypeSignature(p2) && matchers.type(p1, p2)
}

function isMatch(input, signature) {
    return getMatcher(input)(input, signature);
}

function getType(input) {
    let type = typeof input;

    if (type === 'object') {
        if (Array.isArray(input))
            type = 'array';
        else if (input.toString && input.toString() === '[object Arguments]') {
            type = 'arguments'
        }
    }

    log('[getType]', input, type)

    return type;
}

function isTypeSignature(p1) {
    return /^<w\+>$/.test(p1)
}

function log() {
    if (debug) {
        console.log.apply(console, arguments);
    }
}

module.exports = {
    checkForTypeSignatureOrFalse,
    isMatch,
    getMatcher,
    getType,
    log
}
