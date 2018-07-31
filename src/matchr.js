'use strict';

const typeMatcher = require('./matchers/type');
const { identifyType, getMatcher, getType, log } = require('./util');

const matchr = (input, cases) => {
    if (typeof cases !== 'object') {
        throw new Error('must provide cases');
    }

    const inputType = identifyType(input);
    const matcher = getMatcher(inputType);
    const signatures = Object.keys(cases);
    const matchingSignature = signatures.find(s => matcher(input, s));
    const result = cases[matchingSignature];

    if (typeof result !== 'undefined') {
        log('[matchr] matched', input, matchingSignature, result);

        if (typeof result === 'function') {
            return inputType === 'arguments'
                ? result.apply(result, input)
                : result();
        } else {
            return result;
        }
    } else if (typeof cases._ !== 'undefined') {
        log('[matchr] nothing matched, using fallback');
        return cases._;
    } else {
        throw new Error('[matchr] no matches found for input: ' + input);
    }
};

matchr.fn = (cases) => (input) => matchr(input, cases);

matchr.args = (args, cases) => {
    return matchr(input, {
        ...cases,
        _: throw new Error('invalid arguments!')
    });
};

module.exports = matchr;
