'ust strict';

module.exports = (input, signature) => {
    return /^(true|false)$/.test(signature)
        && input === JSON.parse(signature);
};
