'ust strict';

const { isMatchingSignature } = require('../util')

module.exports = (input, signature) => {
    if (signature[0] !== '{') return false;
    if (signature === '{}') return true;

    const props = signature.replace(/[{}]/g, '')
        .split(',')
        .map(x => x.split(':').map(y => y.trim()));
    const usePartialMatch = props.some(([k, v]) => k === '...');
    const inputProps = Object.keys(input);

    if (usePartialMatch) {
        return matchSomeProps(inputProps, props);
    } else if (inputProps.length === props.length) {
        return matchAllProps(inputProps, props);
    } else {
        return false;
    }
};

function matchAllProps(inputProps, props) {
    return props.every(([k, v]) => {
        if (!inputProps.includes(k)) return;
        return v ? isMatchingSignature(inputProps[k], v) : true;
    });
}

function matchSomeProps(inputProps, props) {
    return props
        .filter(([k, v]) => k !== '...')
        .every(([k, v]) => inputProps.includes(k));
}
