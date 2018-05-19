'ust strict';

module.exports = (p1, p2) => {
    if (p2[0] !== '<') {
        return;
    }

    const groups = p2.match(/^<(\w+)>$/);
    const constructor = groups && groups[1];

    return constructor && p1.constructor === ((global || window)[constructor]);
};
