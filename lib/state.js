'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var isSandboxed = arguments.length > 1;
  var sandboxName = isSandboxed ? arguments.length <= 0 ? undefined : arguments[0] : undefined;
  var actions = isSandboxed ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 0 ? undefined : arguments[0];

  if (isSandboxed && (typeof sandboxName !== 'string' || !sandboxName.length)) {
    throw new Error('Sandboxed states names must be a valid string');
  }

  var initialState = actions.initial;
  delete actions.initial;

  var namedActions = {};

  var currentState = void 0;

  var reducerWithActions = function reducerWithActions(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (namedActions[action.type]) {
      currentState = namedActions[action.type](state, action.payload);
    } else {
      currentState = state || initialState;
    }
    return currentState;
  };

  reducerWithActions.getState = function () {
    return currentState;
  };

  reducerWithActions.actionCreators = {};
  reducerWithActions.actionTypes = {};

  Object.keys(actions).forEach(function (actionName) {
    var resolvedActionName = sandboxName ? sandboxName + '_' + actionName : actionName;

    namedActions[resolvedActionName] = actions[actionName];

    var actionCreator = function actionCreator(payload) {
      var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var meta = _extends({}, ext);
      delete meta.type;
      delete meta.payload;
      return _extends({
        type: resolvedActionName,
        payload: payload
      }, meta);
    };

    reducerWithActions.actionCreators[actionName] = actionCreator;

    reducerWithActions.actionTypes[actionName] = resolvedActionName;

    var actionMethod = function actionMethod(payload) {
      var action = actionCreator(payload);

      return (0, _middleware.dispatch)(action);
    };

    reducerWithActions[actionName] = actionMethod;

    (0, _actions.addAction)(actionName, actionMethod, actionCreator, sandboxName);

    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'testing') {
      reducerWithActions['_' + actionName] = actions[actionName];
    }
  });

  return reducerWithActions;
};

var _middleware = require('./middleware');

var _actions = require('./actions');