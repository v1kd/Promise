"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Promise_1 = __importDefault(require("./Promise"));
new Promise_1.default(function (resolve, reject) {
    console.log('Print');
    resolve(2);
});
