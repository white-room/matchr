'ust strict';

module.exports = (p1, p2) => {
    return typeof p1 === 'function' && p2 === '()';
};
