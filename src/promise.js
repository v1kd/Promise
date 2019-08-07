"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status;
(function (Status) {
    Status[Status["PENDING"] = 0] = "PENDING";
    Status[Status["FULFILLED"] = 1] = "FULFILLED";
    Status[Status["REJECTED"] = -1] = "REJECTED";
})(Status || (Status = {}));
var Promise = /** @class */ (function () {
    function Promise(fn) {
        var _this = this;
        this.status = Status.PENDING;
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
        var promiseFn = function (resolve, reject) {
            var callbackAfterFinish = function () {
                _this.assertResolved();
                if (_this.status === Status.FULFILLED) {
                    var value = _this.value;
                    try {
                        var newValue = callback(value);
                        if (newValue instanceof Promise) {
                            newValue.then(function (v) { return resolve(v); });
                        }
                        else {
                            resolve(newValue);
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                }
                else {
                    var value = _this.error;
                    reject(value);
                }
            };
            if (_this.status !== Status.PENDING) {
                callbackAfterFinish();
            }
            else {
                _this.callbacks.push(callbackAfterFinish);
            }
        };
        return new Promise(promiseFn);
    };
    Promise.prototype.catch = function (callback) {
        var _this = this;
        var promiseFn = function (resolve, reject) {
            var callbackAfterFinish = function () {
                _this.assertResolved();
                if (_this.status === Status.REJECTED) {
                    var error = _this.error;
                    try {
                        var newValue = callback(error);
                        if (newValue instanceof Promise) {
                            newValue.then(function (v) { return resolve(v); });
                        }
                        else {
                            resolve(newValue);
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            };
            if (_this.status !== Status.PENDING) {
                callbackAfterFinish();
            }
            else {
                _this.callbacks.push(callbackAfterFinish);
            }
        };
        return new Promise(promiseFn);
    };
    Promise.prototype.resolve = function (value) {
        this.value = value;
        this.status = Status.FULFILLED;
        this.finish();
    };
    Promise.prototype.reject = function (error) {
        this.error = error;
        this.status = Status.REJECTED;
        this.finish();
    };
    Promise.prototype.finish = function () {
        this.callbacks.forEach(function (callback) { return callback(); });
        this.callbacks = [];
    };
    Promise.prototype.assertResolved = function () {
        invariant(this.status !== Status.PENDING, 'Expected promise to be resolved or rejected');
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
    Promise.all = function (promises) {
        var results = [];
        var counter = 0;
        var hasRejected = false;
        return new Promise(function (resolve, reject) {
            promises.forEach(function (promise, i) {
                promise.then(function (result) {
                    results[i] = result;
                    ++counter;
                    if (counter >= promises.length) {
                        resolve(results);
                    }
                }).catch(function (value) {
                    if (!hasRejected) {
                        hasRejected = true;
                        reject(value);
                    }
                });
            });
        });
    };
    Promise.race = function (promises) {
        var isDone = false;
        return new Promise(function (resolve, reject) {
            promises.forEach(function (promise, i) { return promise
                .then(function (value) {
                if (isDone)
                    return;
                isDone = true;
                resolve(value);
            })
                .catch(function (error) {
                if (isDone)
                    return;
                isDone = true;
                reject(error);
            }); });
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
