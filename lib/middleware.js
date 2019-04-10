'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getState = exports.dispatch = undefined;
exports.default = createMiddleware;

var _effect = require('./effect');

var _hook = require('./hook');

var warningFn = function warningFn() {
  console.warn('It looks like you\'re trying to use Jumpstate without the middleware! For Jumpstate to work, you need to run CreateJumpstateMiddleware() and apply it as middleware to your Redux Store.');
};
var resolvedDispatch = warningFn;
var resolvedGetState = warningFn;

var dispatch = exports.dispatch = function dispatch() {
  return resolvedDispatch.apply(undefined, arguments);
};
var getState = exports.getState = function getState() {
  return resolvedGetState.apply(undefined, arguments);
};

function createMiddleware(options) {
  return function (stateUtils) {
    resolvedDispatch = stateUtils.dispatch;
    resolvedGetState = stateUtils.getState;
    return function (next) {
      return function (action) {
        var result = next(action);
        if (_effect.EffectRegistry[action.type]) {
          _effect.EffectRegistry[action.type](action);
        }
        _hook.HookRegistry.forEach(function (effect) {
          return effect(action);
        });
        return result;
      };
    };
  };
}