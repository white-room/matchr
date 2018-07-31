'use strict';

module.exports = (input, signature) => {
    let parsedValue;

    try {
        parsedValue = JSON.parse(signature);

        if (typeof parsedValue !== 'string') {
            throw 'not a string';
        }
    } catch (err) {

    }

    return input === parsedValue;
};
