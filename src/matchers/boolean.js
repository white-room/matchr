'ust strict';

module.exports = (p1, p2) => {
    return /^(true|false)$/.test(p2) && p1 === JSON.parse(p2);
};
