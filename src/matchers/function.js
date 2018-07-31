'ust strict';

module.exports = (input, signature) => {
    return typeof input === 'function'
        && signature === '()';
};
