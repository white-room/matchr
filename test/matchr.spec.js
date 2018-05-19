'use strict';

const matchr = require('../src/matchr');

const UNMATCHABLE = '__UNMATCHABLE__';
let signatures;

beforeEach(() => {
    signatures = {pa
        0: '"foo"',
        1: 1,
        2: true,
        3: false,
        4: '{}',
        5: '[]',
        6: '()',
        7: '<Promise>',
        8: '*'
    };
});

it('is a function', () => {
    expect(matchr).toEqual(expect.any(Function));
});

it('matches fallback when there is no match', () => {
    expectInput(UNMATCHABLE).toCall(signatures, 8);
});

it('throws if no match is found and there is no fallback', () => {
    delete signatures[8];
    expect(() => expectInput(UNMATCHABLE).toCall(signatures, -1)).toThrow();
});

it('matches strings', () => {
    expectInput('foo').toCall(signatures, 0);
});

it('matches numbers', () => {
    expectInput(1).toCall(signatures, 1);
});

it('matches booleans', () => {
    expectInput(true).toCall(signatures, 2);
    expectInput(false).toCall(signatures, 3);
});

it('matches functions', () => {
    expectInput(() => {}).toCall(signatures, 6);
    expectInput(function() {}).toCall(signatures, 6);
    expectInput(Math.round).toCall(signatures, 6);
});

it.skip('matches types', () => {
    expectInput(new Promise(() => {})).toCall(signatures, 7);
});

describe('objects', () => {
    beforeEach(() => {
        signatures = {
            0: '{ foo, bar }',
            1: '{ foo, bar, ... }',
            2: '{ fizz: 1, buzz: true }',
            3: '{ fizz: 1, buzz: false }',
            4: '{}'
        };
    });

    it('matches object shorthand', () => {
        expectInput({}).toCall(signatures, 4);
    });

    it('matches object with required properties', () => {
        expectInput({ foo: 1, bar: 1 }).toCall(signatures, 0);
    });

    it('matches object with some required properties', () => {
        expectInput({ foo: 1, bar: 1, baz: 1 }).toCall(signatures, 1);
    });

    it('does not match objects missing required properties', () => {
        expectInput({ foo: 1 }).toCall(signatures, 4);
    });

    it('matches properties and their values', () => {
        expectInput({ fizz: 1, buzz: false }).toCall(signatures, 3);
    });
});

describe('arrays', () => {
    beforeEach(() => {
        signatures = {
            0: '["foo", "bar", false, {}, ()]',
            1: '[1, 2, ...]',
            2: '["foo", true, []]',
            3: '[]'
        };
    });

    it('matches array shorthand', () => {
        expectInput([]).toCall(signatures, 3);
    });

    it('matches array contents', () => {
        expectInput(['foo', true, []]).toCall(signatures, 2);
        expectInput(['foo', 'bar', false, { foo: 1 }, () => {}]).toCall(signatures, 0);
    });

    it('matches array with some contents', () => {
        expectInput([1, 2, 'foo']).toCall(signatures, 1);
    });
});

describe('arguments', () => {
    let fn;
    let spies;

    beforeEach(() => {
        spies = [
            jest.fn(),
            jest.fn(),
            jest.fn()
        ];
        signatures = {
            '1, 2, true': spies[0],
            '1, 2': spies[1],
            '1, [], "foo"': spies[2]
        };

        fn = function() {
            return matchr(arguments, signatures);
        };
    });

    it('matches arguments', () => {
        fn(1, 2, true);
        expect(spies[0]).toBeCalled();
    });

    it('matches arguments', () => {
        fn(1, 2);
        expect(spies[1]).toBeCalled();
    });

    it('matches arguments', () => {
        fn(1, ['foo'], 'foo');
        expect(spies[2]).toBeCalled();
    });
});

describe('types', () => {
    beforeEach(() => {
        signatures = {
            0: '<String>',
            1: '<Number>',
            2: '<Boolean>',
            3: '<Object>',
            4: '<Array>',
            5: '<Promise>',
            6: '<Animal>'
        };
    });

    it('matches types', () => {
        expectInput('foo').toCall(signatures, 0);
        expectInput(1).toCall(signatures, 1);
        expectInput(false).toCall(signatures, 2);
        expectInput({}).toCall(signatures, 3);
        expectInput([]).toCall(signatures, 4);
        expectInput(new Promise(() => {})).toCall(signatures, 5);
    });

    it('throws for types that are not on the global scope', () => {
        class Animal {}

        expect(() => expectInput(new Animal()).toCall(signatures, -1)).toThrow();
    });

});

function expectInput(input) {
    return {
        toCall: (signatures, calledIdx) => {
            const matcherMap = {};
            const spies = [];

            Object.values(signatures).forEach(sig => {
                const spy = jest.fn();
                spies.push(spy);
                matcherMap[sig] = spy;
            });

            matchr(input, matcherMap);

            if (calledIdx >= 0) {
                expect(spies[calledIdx]).toBeCalled();
                spies.splice(calledIdx, 1);
            }

            spies.every(spy => expect(spy).not.toBeCalled());
        }
    };
}
