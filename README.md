[![Build Status](https://travis-ci.org/madski/matchr.svg?branch=master)](https://travis-ci.org/madski/matchr)
[![Coverage Status](https://coveralls.io/repos/github/madski/matchr/badge.svg?branch=master)](https://coveralls.io/github/madski/matchr?branch=master)

pattern-matchr
==============

Flexible pattern matching for Node.js with no dependencies. Match input patterns to return values for succint pattern matching, flow control, type checking, function overloading, and more.

## Install
```sh
$ npm i pattern-matchr'
```

## Usage
`pattern-matchr` is a function that matches the input value to one of the cases described in the cases object, which consist of key (the pattern) and value pairs. Cases are evaluated in the order they are defined stop at the first matching case. By default, functions defined as return values will be executed and the result will be returned. The underscore `_` pattern defines the default/fallback value.

* `@param input (any)` the value to match
* `@param cases (object)` each key/value pair describes the pattern and its' return value

```nodejs
const match = require('pattern-matchr')

let input = 2;
let result = match(input, {
    2: 'a return value',
    1: () => 'a return value from a function',
    _: () => throw new Error('no matches found!')
})

// result === 'a return value'
```

## Reuse & Sharing
`.fn()` accepts a pattern definition object and returns a function that accepts only an input value. This can be useful for re-using and sharing matchers.

```nodejs
# my-matcher.js
const match = require('pattern-matchr');

module.exports = match.fn({
    '[]': doFoo,
    '{}': doBar
})

# my-module.js
const myMatcher = require('./my-matcher');
const result = myMatcher(someValue);
```

## Patterns
The real convenience comes from the ability to describe input values in a variety of patterns:

```nodejs
// objects
match(input, {
    // strings
    foo: 'a string',
    'foo bar baz': 'a complex string',
    
    // numbers
    .95: 'a number',
    2: 'an integer',
    '-2': a negative number',
    
    // boolean
    true: 'truthy',
    false: 'falsey',
    
    // arrays
    '[]': 'any array',
    '[...]': 'any array',
    '["foo", 2, true]': 'an array with specific values',
    '["foo", 2, true, ...]': 'an array with some specific values',
    
    // function arguments
    '"foo", 2, true': 'specific values and number of args',
    '"foo", 2, true, ...': 'specific values and variadic number of args',
    
    // objects
    '{}': 'any object',
    '{...}': 'any object',
    '{foo, bar}': 'an object with required properties,
    '{foo, bar, ...}: 'an object with some required properties, but may contain others',
    '{foo: 1, bar: false}': 'an object with required properties and specific values',
    
    // types
    '<Promise>': 'an instance of a Promise',
    '<Date>': 'an instance of a Date',
    '<Object>': 'an instance of an Object'
    
    // functions
    '()': 'any function',
    'fn()': 'any function',
    '()=>{}': 'any function',
    
    // any
    _: 'default/fallback/wildcard value',
})
```

## Precedence
If you're using many cases, remember that each case is evaluated from first to last; define more specific patterns first (ex: an array with specific values), followed by general ones (ex: any array), and lastly the default.

```nodejs
let input = [1, 2, 3];

match(input, {
    '[]': 'will always be matched',
    '[1, 2, ...]': 'will never be matched because of the first pattern',
    _: 'will match if anything but an array is passed'
})
```

## Examples
### Function Overloading
When arguments are used with functions as return values, the `this` context will be preserved in the called functions.

```nodejs
function myFunction() {
    return match(arguments, {
        '"foo", "bar", "baz"': doSomething,
        '[1, 2, "a", true, ...]': doSomethingElse,
        _: doSomethingDefault
    })
}

const MyModule = {
    myOtherFunction: function() {
        return match(argument, {
          '{}': this.doFoo,
          '[]': this.doBar
        })
    },
    doFoo: function() { ... },
    doBar: function() { ... },
};
```

### Type Checking

```nodejs
function myFunction(a, b, c) {
    match(arguments, {
        '<Boolean>, <Number>, {foo, bar}': true,
        _: () => throw new Error('invalid args');
    });
    
    // or use match.args() which adds the catch all Error for you
    match.args(arguments, {
        '<Boolean>, <Number>, {foo, bar}': true,
    });
    
    ...
}
```

### Type Casting
```nodejs
let date = match(a, {
    '<Date>': a,
    '<Number>': () => new Date(a)
});
```

### Flow Control
```nodejs
let isValid = match(someInput, {
    '{foo, bar}': true,
    _: false
});

if (isValid) ...
```

