"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = /** @class */ (function () {
    function Promise(fn) {
        var _this = this;
        this.status = 'PENDING';
        this.resolvedCallbacks = [];
        this.rejectedCallbacks = [];
        fn(function (value) { return _this.resolve(value); }, function (error) { return _this.reject(error); });
    }
    Promise.prototype.then = function (callback) {
        var promiseResolve = function () { };
        var promise = new Promise(function (resolve, reject) {
            promiseResolve = resolve;
        });
        if (this.status === 'RESOLVED') {
            var newValue = callback(nullthrows(this.valueObj).value);
            promiseResolve(newValue);
        }
        else {
            var callbackAfterResolve = function (value) {
                var newValue = callback(value);
                promiseResolve(newValue);
            };
            this.resolvedCallbacks.push(callbackAfterResolve);
        }
        return promise;
    };
    Promise.prototype.catch = function (error) {
        return new Promise(function () { });
    };
    Promise.prototype.resolve = function (value) {
        this.valueObj = { value: value };
        this.status = 'RESOLVED';
        this.resolvedCallbacks.forEach(function (callback) { return callback(value); });
        this.resolvedCallbacks = [];
    };
    Promise.prototype.reject = function (error) {
        this.errorObj = { error: error };
        this.status = 'REJECTED';
    };
    return Promise;
}());
function nullthrows(value) {
    if (value == null) {
        throw Error('Expected no null or undefined');
    }
    return value;
}
exports.default = Promise;
