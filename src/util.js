'use strict';

const debug = false;

function getMatcher(type) {
    try {
        return require(`./matchers/${type}`);
    } catch (err) {
        throw new Error('not found');
    }
}

function identifyType(input) {
    let type = typeof input;

    if (type === 'object') {
        if (Array.isArray(input))
            type = 'array';
        else if (input.toString && input.toString() === '[object Arguments]') {
            type = 'arguments';
        }
    } else if (type === 'string' && /^<\w+>$/.test(type)) {
        type = 'type';
    }

    log('[getType]', input, type);

    return type;
}

function isMatchingSignature(input, signature) {
    const inputType = identifyType(input);
    const matcher = getMatcher(inputType);

    if (!matcher) {
        throw new Error('failed');
    }

    return matcher(input, signature);
}

function log() {
    if (debug) {
        console.log.apply(console, arguments);
    }
}

module.exports = {
    identifyType,
    isMatchingSignature,
    getMatcher,
    log
};
