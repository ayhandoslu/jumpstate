'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.addAction = addAction;
exports.addEffect = addEffect;
exports.removeAction = removeAction;
exports.reset = reset;
var Actions = exports.Actions = {};
var ActionCreators = exports.ActionCreators = {};

function addAction(actionName, action, actionCreator, sandboxName) {
  if (sandboxName) {
    if (typeof Actions[sandboxName] === 'function') {
      return;
    }
    Actions[sandboxName] = Actions[sandboxName] || {};
    ActionCreators[sandboxName] = ActionCreators[sandboxName] || {};
    if (Actions[sandboxName][actionName]) {
      return;
    }

    Actions[sandboxName][actionName] = function (payload) {
      return action(payload);
    };
    ActionCreators[sandboxName][actionName] = actionCreator;
    return;
  }

  if (_typeof(Actions[actionName]) === 'object') {
    return;
  }
  if (Actions[actionName]) {
    return true;
  }
  Actions[actionName] = function (payload) {
    return action(payload);
  };
  ActionCreators[actionName] = actionCreator;
}

function addEffect(effectName, action, actionCreator) {
  if (Actions[effectName]) {
    return;
  }
  Actions[effectName] = function (payload) {
    return action(payload);
  };
  ActionCreators[effectName] = actionCreator;
}

function removeAction(actionName, sandboxName) {
  if (sandboxName) {
    delete Actions[sandboxName][actionName];
    delete ActionCreators[sandboxName][actionName];
    return;
  }
  delete Actions[actionName];
  delete ActionCreators[actionName];
}

function reset() {
  for (var key in Actions) {
    if (Actions.hasOwnProperty(key)) {
      delete Actions[key];
      delete ActionCreators[key];
    }
  }
}