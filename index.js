"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Promise_1 = __importDefault(require("./src/Promise"));
var p1 = new Promise_1.default(function (resolve, reject) {
    setTimeout(function () {
        resolve(1);
    }, 1000);
});
p1.then(function (val) { return val + 1; })
    .then(function (val) { return val + 1; })
    .then(function (val) { return val + 1; })
    .then(function (val) { return console.log(val); });
