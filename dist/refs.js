"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refSetter = void 0;

var refSetter = function refSetter() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  return function (element) {
    refs.forEach(function (ref) {
      if (ref) {
        if (typeof ref === 'function') {
          ref(element);
        } else {
          ref.current = element;
        }
      }
    });
  };
};

exports.refSetter = refSetter;