'use strict';

module.exports = (p1, p2) => {
    let p2parsed;

    try {
        p2parsed = JSON.parse(p2);

        if (typeof p2parsed !== 'string') {
            throw 'not a string';
        }
    } catch (err) {

    }

    return p1 === p2parsed;
};
