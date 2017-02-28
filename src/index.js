import decreator from 'decreator';
import delay from './delay';

function wrap(options, func) {
    const maxAttemptsSetting = options.retries || 5;
    const delaySetting = options.delay || 10;
    const verboseSetting = options.verbose || false;
    const beforeRetryOption = options.beforeRetry || null;

    let retry = 1;

    return async function () {
    	const scope = this;

        while (true) {
            try {
            	if (scope) {
                	return await func.call(scope, ...arguments);
                } else {
                	return func(...arguments);
                }
            } catch (error) {
                if (typeof delaySetting === 'function') {
                    await delay(await delaySetting({retry}));
                } else {
                    await delay(delaySetting);
                }

                retry++;

                if (!(retry > maxAttemptsSetting)) {
                	if (verboseSetting) {
                    	console.log(`[retry] retry ${retry - 1} failed, retrying`);
                    }
                } else {
                    throw error;
                }

                if (beforeRetryOption) {
                	await (beforeRetryOption.call(scope, {retry, error}));
                }
            }
        }
    };
}

const decorator = decreator((target, key, descriptor, options) => {
    Object.defineProperty(target, key, {
        value: wrap(options || {}, target[key]),
    });

    return target;
});

export default function (options, func) {
    if (typeof options === 'object' && typeof func === 'function') {
        return wrap(...arguments);
    } else {
        return decorator(...arguments);
    }
};