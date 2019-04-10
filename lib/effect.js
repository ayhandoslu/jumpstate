'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EffectRegistry = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (name, callback) {
  if (typeof name !== 'string') {
    throw new Error('Named effects require a valid string as the name eg. Effect("myAction", () => {...})');
  }

  var callbackWrapper = function callbackWrapper(action) {
    var payload = action.payload,
        _jumpstateTimestamp = action._jumpstateTimestamp;

    var response = callback(payload, _middleware.getState, _middleware.dispatch);
    if (_jumpstateTimestamp) {
      Promise.resolve(response).then(effectPromises[_jumpstateTimestamp].resolve).catch(effectPromises[_jumpstateTimestamp].reject).then(function () {
        delete effectPromises[_jumpstateTimestamp];
      });
    }
  };

  EffectRegistry[name] = callbackWrapper;

  var actionCreator = function actionCreator(payload) {
    var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var meta = _extends({}, ext);
    delete meta.type;
    delete meta.payload;
    return _extends({
      type: name,
      payload: payload
    }, meta);
  };

  var eventDispatcher = function eventDispatcher(payload) {
    var _jumpstateTimestamp = guidv4();
    return new Promise(function (resolve, reject) {
      effectPromises[_jumpstateTimestamp] = { resolve: resolve, reject: reject };
      (0, _middleware.dispatch)(actionCreator(payload, { _jumpstateTimestamp: _jumpstateTimestamp }));
    });
  };

  eventDispatcher.actionCreator = actionCreator;

  (0, _actions.addEffect)(name, eventDispatcher, actionCreator);

  eventDispatcher.cancel = function () {
    delete EffectRegistry[name];
    (0, _actions.removeAction)(name);
  };

  return eventDispatcher;
};

var _middleware = require('./middleware');

var _actions = require('./actions');

var EffectRegistry = exports.EffectRegistry = {};
var effectPromises = {};
var guidv4 = function guidv4() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};