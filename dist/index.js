'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = function (options, func) {
    if ((typeof options === 'undefined' ? 'undefined' : (0, _typeof3.default)(options)) === 'object' && typeof func === 'function') {
        return wrap.apply(undefined, arguments);
    } else {
        return decorator.apply(undefined, arguments);
    }
};

var _decreator = require('decreator');

var _decreator2 = _interopRequireDefault(_decreator);

var _delay = require('./delay');

var _delay2 = _interopRequireDefault(_delay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wrap(options, func) {
    var maxAttemptsSetting = options.retries || 5;
    var delaySetting = options.delay || 10;
    var verboseSetting = options.verbose || false;
    var beforeRetryOption = options.beforeRetry || null;

    var retry = 1;

    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var scope,
            _args = arguments;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        scope = this;

                    case 1:
                        if (!true) {
                            _context.next = 35;
                            break;
                        }

                        _context.prev = 2;

                        if (!scope) {
                            _context.next = 9;
                            break;
                        }

                        _context.next = 6;
                        return func.call.apply(func, [scope].concat(Array.prototype.slice.call(_args)));

                    case 6:
                        return _context.abrupt('return', _context.sent);

                    case 9:
                        return _context.abrupt('return', func.apply(undefined, _args));

                    case 10:
                        _context.next = 33;
                        break;

                    case 12:
                        _context.prev = 12;
                        _context.t0 = _context['catch'](2);

                        if (!(typeof delaySetting === 'function')) {
                            _context.next = 22;
                            break;
                        }

                        _context.next = 17;
                        return delaySetting({ retry: retry });

                    case 17:
                        _context.t1 = _context.sent;
                        _context.next = 20;
                        return (0, _delay2.default)(_context.t1);

                    case 20:
                        _context.next = 24;
                        break;

                    case 22:
                        _context.next = 24;
                        return (0, _delay2.default)(delaySetting);

                    case 24:

                        retry++;

                        if (retry > maxAttemptsSetting) {
                            _context.next = 29;
                            break;
                        }

                        if (verboseSetting) {
                            console.log('[retry] retry ' + (retry - 1) + ' failed, retrying');
                        }
                        _context.next = 30;
                        break;

                    case 29:
                        throw _context.t0;

                    case 30:
                        if (!beforeRetryOption) {
                            _context.next = 33;
                            break;
                        }

                        _context.next = 33;
                        return beforeRetryOption.call(scope, { retry: retry, error: _context.t0 });

                    case 33:
                        _context.next = 1;
                        break;

                    case 35:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[2, 12]]);
    }));
}

var decorator = (0, _decreator2.default)(function (target, key, descriptor, options) {
    (0, _defineProperty2.default)(target, key, {
        value: wrap(options || {}, target[key])
    });

    return target;
});

;
module.exports = exports['default'];