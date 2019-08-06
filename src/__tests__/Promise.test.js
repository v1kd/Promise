"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Promise_1 = __importDefault(require("../Promise"));
describe('Non async', function () {
    it('Should await for single then', function () {
        var a = 0;
        new Promise_1.default(function (resolve) {
            resolve(1);
        }).then(function (value) { return (a = value); });
        expect(a).toEqual(1);
    });
    it('Should await for multiple thens', function () {
        var a = 0;
        new Promise_1.default(function (resolve) {
            resolve(1);
        }).then(function (value) { return value + 1; })
            .then(function (value) { return value + 1; })
            .then(function (value) { return value + 1; })
            .then(function (value) { return (a = value); });
        expect(a).toEqual(4);
    });
    it('Should catch when rejected', function () {
        var a = 0;
        new Promise_1.default(function (_, reject) {
            reject(3);
        })
            .catch(function (rejected) { return (a = rejected); });
        expect(a).toEqual(3);
    });
    it('Should catch when thrown', function () {
        var error;
        var message = 'Error thrown';
        new Promise_1.default(function () {
            throw new Error(message);
        }).catch(function (e) { return (error = e); });
        expect(error.message).toEqual(message);
    });
    it('Should skip then and catch when rejected', function () {
        var a = 0;
        var thenMock = jest.fn()
            .mockReturnValue(1);
        new Promise_1.default(function (_, reject) {
            reject(3);
        }).then(thenMock)
            .catch(function (value) { return (a = value); });
        expect(a).toEqual(3);
        expect(thenMock).not.toBeCalled();
    });
});
