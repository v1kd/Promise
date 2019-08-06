"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = /** @class */ (function () {
    function Promise(fn) {
        var _this = this;
        this.status = 'PENDING';
        this.callbacks = [];
        try {
            fn(function (value) { return _this.resolve(value); }, function (error) { return _this.reject(error); });
        }
        catch (error) {
            this.reject(error);
        }
    }
    Promise.prototype.then = function (callback) {
        var _this = this;
        var promiseResolve;
        var promiseReject;
        var promise = new Promise(function (resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
        });
        var callbackAfterFinish = function () {
            _this.assertResolved();
            if (_this.status === 'RESOLVED') {
                var value = _this.valueObj.value;
                try {
                    var newValue = callback(value);
                    if (newValue instanceof Promise) {
                        newValue.then(function (v) { return promiseResolve(v); });
                    }
                    else {
                        promiseResolve(newValue);
                    }
                }
                catch (error) {
                    promiseReject(error);
                }
            }
            else {
                var value = _this.errorObj.error;
                promiseReject(value);
            }
        };
        if (this.status !== 'PENDING') {
            callbackAfterFinish();
        }
        else {
            this.callbacks.push(callbackAfterFinish);
        }
        return promise;
    };
    Promise.prototype.catch = function (callback) {
        var _this = this;
        var promiseResolve;
        var promiseReject;
        var promise = new Promise(function (resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
        });
        var callbackAfterFinish = function () {
            _this.assertResolved();
            if (_this.status === 'REJECTED') {
                var error = _this.errorObj.error;
                try {
                    var newValue = callback(error);
                    if (newValue instanceof Promise) {
                        newValue.then(function (v) { return promiseResolve(v); });
                    }
                    else {
                        promiseResolve(newValue);
                    }
                }
                catch (error) {
                    promiseReject(error);
                }
            }
        };
        if (this.status !== 'PENDING') {
            callbackAfterFinish();
        }
        else {
            this.callbacks.push(callbackAfterFinish);
        }
        return promise;
    };
    Promise.prototype.resolve = function (value) {
        this.valueObj = { value: value };
        this.status = 'RESOLVED';
        this.finish();
    };
    Promise.prototype.reject = function (error) {
        this.errorObj = { error: error };
        this.status = 'REJECTED';
        this.finish();
    };
    Promise.prototype.finish = function () {
        this.callbacks.forEach(function (callback) { return callback(); });
        this.callbacks = [];
    };
    Promise.prototype.assertResolved = function () {
        invariant(this.status !== 'PENDING', 'Expected promise to be resolved or rejected');
    };
    Promise.reject = function (error) {
        return new Promise(function (_, reject) {
            reject(error);
        });
    };
    Promise.resolve = function (value) {
        return new Promise(function (resolve) {
            resolve(value);
        });
    };
    return Promise;
}());
function invariant(truth, msg) {
    if (!truth) {
        throw new Error("Invariant violation: " + msg);
    }
}
exports.default = Promise;
