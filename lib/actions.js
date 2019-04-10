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
    if (typeof Actions[sandboxName] === 'function' && (!module || !module.hot)) {
      throw new Error('An action called "' + sandboxName + '" already exists! Please pick another sandbox name!');
    }
    Actions[sandboxName] = Actions[sandboxName] || {};
    ActionCreators[sandboxName] = ActionCreators[sandboxName] || {};
    if (Actions[sandboxName][actionName] && (!module || !module.hot)) {
      throw new Error('An action called "' + actionName + '" in the ' + sandboxName + ' sandbox already exists! Please pick another action name!');
    }

    Actions[sandboxName][actionName] = function (payload) {
      return action(payload);
    };
    ActionCreators[sandboxName][actionName] = actionCreator;
    return;
  }

  if (_typeof(Actions[actionName]) === 'object' && (!module || !module.hot)) {
    throw new Error('An action called "' + actionName + '" in the ' + sandboxName + ' sandbox already exists! Please pick another action name!');
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
  if (Actions[effectName] && (!module || !module.hot)) {
    throw new Error('An action called "' + effectName + '" already exists! Please pick another name for this effect!');
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