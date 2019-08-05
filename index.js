"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Promise_1 = __importDefault(require("./src/Promise"));
var p1 = new Promise_1.default(function (resolve, reject) {
    setTimeout(function () {
        resolve('Some string');
    }, 1000);
});
// p1.then(val => val + 1)
//   .then(val => {
//     throw new Error('Hello');
//   })
//   .then(val => val + 1)
//   .then(val => console.log(val))
//   .catch(val => console.log('rejected', val));
p1.then(function (val) { return new Promise_1.default(function (resolve) {
    setTimeout(function () {
        resolve(val);
    }, 1000);
}); })
    .then(function (val) { return console.log('resolved', val); });
