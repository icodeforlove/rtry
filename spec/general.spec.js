import rtry from '../dist/index';
import delay from '../dist/delay';

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

class Example1 {
    @rtry({verbose: false, delay: attempt => attempt.retry * 1})
    static method (success) {
    	if (!success) {
        	throw new Error('Example1');
        }
    }
}

@rtry({verbose: false, delay: attempt => attempt.retry * 1})
class Example2 {
    static method (success) {
        if (!success) {
        	throw new Error('Example2');
        }
    }
}

const example3 = rtry({verbose: false, delay: attempt => attempt.retry * 1}, (success) => {
	if (!success) {
		throw new Error('Example3');
	}
});

class Example4 {
	attempts = 0;
	scopeName = 'Example4'

    @rtry({
    	verbose: false,
    	delay: attempt => attempt.retry * 1,
    	beforeRetry: function () {
    		this.scopeName = 'Example4.Success';
    	}
    })
    async method () {
    	this.attempts++;

    	if (this.attempts <= 3) {
    		throw new Error('Example4');
    	}
    }

    @rtry({
    	verbose: false,
    	delay: attempt => attempt.retry * 1,
    	beforeRetry: async function () {
    		await delay(1);
    		this.scopeName = 'Example4.Success';
    	}
    })
    async method2 () {
    	this.attempts++;

    	if (this.attempts <= 3) {
    		throw new Error('Example4');
    	}
    }
}

const example5 = rtry({
	verbose: false,
	delay: attempt => attempt.retry * 1,
	beforeRetry: async function () {
		await delay(1);
		this.scopeName = 'Example4.Success';
	}
}, async function () {
	this.attempts++;

	if (this.attempts <= 3) {
		throw new Error('Example4');
	}
});

class Example6 {
    @rtry({verbose: false, delay: async attempt => {
    	await delay(1);
    	return attempt.retry * 1;
    }})
    static method (success) {
    	if (!success) {
        	throw new Error('Example6');
        }
    }
}

describe('General Tests', () => {
	it('can handle class level rtry fail', async function (callback) {
		let failedMessage;

		try {
			await Example1.method();
		} catch (error) {
			failedMessage = error.message;
		}

		expect(failedMessage).toBe('Example1');

		callback();
	});

	it('can handle class method level rtry fail', async function (callback) {
		//let example = new Example2();
		let failedMessage;

		try {
			await Example2.method();
		} catch (error) {
			failedMessage = error.message;
		}

		expect(failedMessage).toBe('Example2');

		callback();
	});

	it('can handle class function level rtry fail', async function (callback) {
		let failedMessage;

		try {
			await example3();
		} catch (error) {
			failedMessage = error.message;
		}

		expect(failedMessage).toBe('Example3');

		callback();
	});

	it('can handle class level rtry success', async function (callback) {
		let success = false;

		try {
			await Example1.method(true);
			success = true;
		} catch (error) {}

		expect(success).toBe(true);

		callback();
	});

	it('can handle class method level rtry success', async function (callback) {
		let success = false;

		try {
			await Example2.method(true);
			success = true;
		} catch (error) {}

		expect(success).toBe(true);

		callback();
	});

	it('can handle class function level rtry success', async function (callback) {
		let success;

		try {
			await example3(true);
			success = true;
		} catch (error) {}

		expect(success).toBe(true);

		callback();
	});

	it('can handle sync beforeRetry', async function (callback) {
		const example = new Example4();
		await example.method();

		expect(example.scopeName).toBe('Example4.Success');
		expect(example.attempts).toBe(4);

		callback();
	});

	it('can handle async beforeRetry', async function (callback) {
		const example = new Example4();
		await example.method2();

		expect(example.scopeName).toBe('Example4.Success');
		expect(example.attempts).toBe(4);

		callback();
	});

	it('can handle async beforeRetry with a standard function, and bind', async function (callback) {
		let scope = {attempts: 0, scopeName: 'Example4'};
		await example5.call(scope);

		expect(scope.scopeName).toBe('Example4.Success');
		expect(scope.attempts).toBe(4);

		callback();
	});

	it('can handle async delay for delay time', async function (callback) {
		let failedMessage;

		try {
			await Example6.method();
		} catch (error) {
			failedMessage = error.message;
		}

		expect(failedMessage).toBe('Example6');

		callback();
	});
});