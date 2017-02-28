# rtry [![Build Status](https://travis-ci.org/icodeforlove/rtry.png?branch=master)](https://travis-ci.org/icodeforlove/rtry)

### what?

rtry allows you to easily add promise retry logic to classes, and methods

## install

```
npm install --save rtry
```

## decorator usage

you can define a universal decorator like this

```javascript
import rtry from 'rtry';

class DecoratorExample {
    @rtry({retries: 10, verbose: true})
    static canRetry () {
        if (Math.random() < 0.5) {
            throw new Error('random error');
        }
    }
}
DecoratorExample.canRetry();
```

## function usage

```javascript
import rtry from 'rtry';

let functionExample = () => {
    const rand = Math.random();

    if (rand < 0.5) {
        throw new Error('random error');
    }

    return rand;
};

let functionExampleRetry = rtry({retries: 10, verbose: true}, functionExample);

functionExampleRetry().then(result => {
    console.log(result);
});
```

## options

- beforeRetry (function / async function)
- retries (number)
- delay (number / function / async function)
- verbose (boolean)

you can handle error logging in a custom way as well

```javascript
const debug = requre('debug')('example');

@rtry({beforeRetry: ({retry, error}) => debug(error.stack)})
class Example {
    static canError () {
        throw new Error('abcd');
    }
}
```