'ust strict';

module.exports = (p1, p2) => {
    if (p2[0] !== '{') {
        return false;
    }

    if (p2 === '{}') {
        return true;
    }

    const sigProps = p2.replace(/[{}]/g, '')
        .split(',')
        .map(x => x.split(':').map(y => y.trim()));


    const usePartialMatch = sigProps.some(([k, v]) => k === '...');
    const inputProps = Object.keys(p1);

    if (usePartialMatch) {
        return sigProps
            .filter(([k, v]) => k !== '...')
            .every(([k, v]) => {
                return inputProps.includes(k);
            });
    } else if (inputProps.length === sigProps.length) {
        return sigProps.every(([k, v]) => {
            if (inputProps.includes(k)) {
                if (v) {
                    let val = stringToValue(v);

                    if (['boolean', 'string', 'number'].includes(typeof val)) {
                        return p1[k] === val;
                    } else {
                        return typeof input[k] === typeof val;
                    }
                } else {
                    return true;
                }
            }
        });
    } else {
        return false;
    }
};


function stringToValue(input) {
    let x = input.trim();

    if (/(true|false|[0-9]+|{}|\[\]|\w+)/.test(x)) {
        return JSON.parse(x);
    }
}
