'use strict';

const matchr = require('../src/matchr');

const UNMATCHABLE = '__UNMATCHABLE__';
const EXPECTED = '__EXPECTED__';

it('is a function', () => {
    expect(matchr).toEqual(expect.any(Function));
});

it('matches fallback when there is no match', () => {
    const myMatchr = matchr.fn({
        _: 'foo'
    });

    expect(myMatchr('fizz')).toEqual('foo');
});

it('throws if no match is found and there is no fallback', () => {
    expect(() => matchr('foo', {})).toThrow();
});

it('matches strings', () => {
    const myMatchr = matchr.fn({
        '"foo"': 'bar'
    });

    expect(myMatchr('foo')).toEqual('bar');
});

it('matches numbers', () => {
    const myMatchr = matchr.fn({
        1: 'foo',
        2.5: 'bar',
        .995: 'baz'
    });

    expect(myMatchr(1)).toEqual('foo');
    expect(myMatchr(2.5)).toEqual('bar');
    expect(myMatchr(.995)).toEqual('baz');
});

it('matches booleans', () => {
    const myMatchr = matchr.fn({
        true: 'foo',
        false: 'bar'
    });

    expect(myMatchr(true)).toEqual('foo');
    expect(myMatchr(false)).toEqual('bar');
});

it('matches functions', () => {
    const myMatchr = matchr.fn({
        '()': 'foo'
    });

    expect(myMatchr(() => {})).toEqual('foo');
    expect(myMatchr(function() {})).toEqual('foo');
    expect(myMatchr(Math.round)).toEqual('foo');
});

describe('objects', () => {
    it('matches object shorthand', () => {
        const myMatchr = matchr.fn({
            '{}': 'foo'
        });

        expect(myMatchr({})).toEqual('foo');
    });

    it('matches object with required properties', () => {
        const myMatchr = matchr.fn({
            '{foo, bar}': 'foo'
        });

        expect(myMatchr({
            foo: 1,
            bar: 1
        })).toEqual('foo');
    });

    it('matches object with some required properties', () => {
        const myMatchr = matchr.fn({
            '{foo, bar}': 'foo',
            '{foo, bar, ...}': 'bar'
        });

        expect(myMatchr({
            foo: 1,
            bar: 1,
            baz: 1
        })).toEqual('bar');
    });

    it('matches properties and their values', () => {
        const myMatchr = matchr.fn({
            '{fizz: 1, buzz: 2}': 'foo',
            '{fizz: 1, buzz: 3}': 'bar',
            '{}': 'baz'
        });

        expect(myMatchr({
            fizz: 1,
            buzz: 2
        })).toEqual('foo');
    });

    it('does not match objects missing required properties', () => {
        const myMatchr = matchr.fn({
            '{foo, bar}': 'foo',
            _: 'bar'
        });

        expect(myMatchr({ foo: 1 })).toEqual('bar');
    });
});

describe('arrays', () => {
    it('matches array shorthand', () => {
        const myMatchr = matchr.fn({
            '[]': 'foo'
        });

        expect(myMatchr([])).toEqual('foo');
    });

    it('matches array contents', () => {
        const myMatchr = matchr.fn({
            '["foo", true, []]': 'foo',
            '["foo", "bar", false, {}, ()]': 'bar'
        });

        expect(myMatchr(['foo', true, []])).toEqual('foo');
        expect(myMatchr(['foo', 'bar', false, { foo: 1 }, () => {}])).toEqual('bar');
    });

    it('matches array with some contents', () => {
        const myMatchr = matchr.fn({
            '["foo", true, []]': 'foo',
            '["foo", "bar", false, {}, ()]': 'bar',
            '[1, 2, ...]': 'baz'
        });

        expect(myMatchr(['foo', true, []])).toEqual('foo');
        expect(myMatchr([1, 2, 'foo'])).toEqual('baz');
    });
});

describe('arguments', () => {
    let myMatchrWrapper;
    let spies;

    beforeEach(() => {
        spies = [
            jest.fn(),
            jest.fn(),
            jest.fn()
        ];

        myMatchrWrapper = function() {
            return matchr(arguments, {
                '1, 2, true': spies[0],
                '1, 2': spies[1],
                '1, [], "foo"': spies[2]
            });

            return matchr(arguments, [
                [[1, 3, true], spies[0]],
                ['a', spies[1]],
                []
            ]);
        };
    });

    it('matches arguments', () => {
        myMatchrWrapper(1, 2, true);
        expect(spies[0]).toBeCalled();
    });

    it('matches arguments', () => {
        myMatchrWrapper(1, 2);
        expect(spies[1]).toBeCalled();
    });

    it('matches arguments', () => {
        myMatchrWrapper(1, ['foo'], 'foo');
        expect(spies[2]).toBeCalled();
    });
});

describe('types', () => {
    it('matches types', () => {
        const myMatchr = matchr.fn({
            '<String>': 1,
            '<Number>': 2,
            '<Boolean>': 3,
            '<Object>': 4,
            '<Array>': 5,
            '<Promise>': 6,
            '<Animal>': 7
        });

        expect(myMatchr('foo')).toEqual(1);
        expect(myMatchr(1)).toEqual(2);
        expect(myMatchr(false)).toEqual(3);
        expect(myMatchr({})).toEqual(4);
        expect(myMatchr([])).toEqual(5);
        expect(myMatchr(new Promise(() => {}))).toEqual(6);
    });

    it('cannot match types that are not on the global scope', () => {
        const myMatchr = matchr.fn({
            '<Animal>': 'foo',
            _: 'bar'
        });

        class Animal {}

        expect(myMatchr(new Animal())).toEqual('bar');
    });
});

describe('matchr.fn()', () => {
    it('returns a function', () => {
        expect(matchr.fn()).toEqual(expect.any(Function));
    });

    it('matches values', () => {
        const myMatchr = matchr.fn({
            '"foo"': 1,
            '"bar"': 2,
            _: 3
        });

        expect(myMatchr('foo')).toEqual(1);
        expect(myMatchr('bar')).toEqual(2);
        expect(myMatchr(UNMATCHABLE)).toEqual(3);
    });
});
