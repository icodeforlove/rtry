"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (ms) {
    return new _promise2.default(function (resolve) {
        setTimeout(function () {
            resolve();
        }, ms);
    });
};

module.exports = exports["default"];