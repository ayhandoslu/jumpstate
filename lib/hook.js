'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HookRegistry = undefined;

exports.default = function (callback) {
  var callbackWrapper = function callbackWrapper(action) {
    callback(action, _middleware.getState, _middleware.dispatch);
  };

  HookRegistry.push(callbackWrapper);

  var returnMethod = function returnMethod() {
    callbackWrapper();
  };

  returnMethod.cancel = function () {
    HookRegistry.splice(HookRegistry.indexOf(callbackWrapper), 1);
  };

  return returnMethod;
};

var _middleware = require('./middleware');

var HookRegistry = exports.HookRegistry = [];