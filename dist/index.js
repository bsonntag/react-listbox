"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Listbox = Listbox;
exports.ListboxButton = ListboxButton;
exports.useListboxButtonLabel = useListboxButtonLabel;
exports.ListboxButtonLabel = ListboxButtonLabel;
exports.ListboxList = ListboxList;
exports.ListboxOption = void 0;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var ValueContext = React.createContext();
var OnChangeContext = React.createContext();
var LabelContext = React.createContext();
var ExpandedContext = React.createContext();

function moveDown(children, value, onChange) {
  var selectedIndex = children.findIndex(function (child) {
    return child.getValue() === value;
  });
  var nextIndex = selectedIndex + 1;
  nextIndex = nextIndex === children.length ? 0 : nextIndex;
  var nextChild = children[nextIndex];
  nextChild.focus();
  onChange(nextChild.getValue());
}

function moveUp(children, value, onChange) {
  var selectedIndex = children.findIndex(function (child) {
    return child.getValue() === value;
  });
  var nextIndex = selectedIndex - 1;
  nextIndex = nextIndex === -1 ? children.length - 1 : nextIndex;
  var nextChild = children[nextIndex];
  nextChild.focus();
  onChange(nextChild.getValue());
}

function moveToTop(children, value, onChange) {
  children[0].focus();
  onChange(children[0].getValue());
}

function moveToBottom(children, value, onChange) {
  children[children.length - 1].focus();
  onChange(children[children.length - 1].getValue());
}

function Listbox(_ref) {
  var children = _ref.children,
      value = _ref.value,
      onChange = _ref.onChange,
      rest = _objectWithoutProperties(_ref, ["children", "value", "onChange"]);

  var ref = React.useRef();

  var _React$useState = React.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      label = _React$useState2[0],
      setLabel = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      isExpanded = _React$useState4[0],
      setExpanded = _React$useState4[1];

  var labelContextValue = React.useMemo(function () {
    return {
      label: label,
      setLabel: setLabel
    };
  }, [label]);
  var expandedContextValue = React.useMemo(function () {
    return {
      isExpanded: isExpanded,
      setExpanded: setExpanded
    };
  }, [isExpanded]);
  React.useEffect(function () {
    function handleWindowClick(event) {
      if (!ref.current.contains(event.target)) {
        setExpanded(false);
      }
    }

    window.addEventListener('click', handleWindowClick, false);
    return function () {
      window.removeEventListener('click', handleWindowClick, false);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    ref: ref
  }), /*#__PURE__*/React.createElement(ExpandedContext.Provider, {
    value: expandedContextValue
  }, /*#__PURE__*/React.createElement(OnChangeContext.Provider, {
    value: onChange
  }, /*#__PURE__*/React.createElement(LabelContext.Provider, {
    value: labelContextValue
  }, /*#__PURE__*/React.createElement(ValueContext.Provider, {
    value: value
  }, children)))));
}

function ListboxButton(_ref2) {
  var children = _ref2.children,
      rest = _objectWithoutProperties(_ref2, ["children"]);

  var _React$useContext = React.useContext(ExpandedContext),
      isExpanded = _React$useContext.isExpanded,
      setExpanded = _React$useContext.setExpanded;

  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    "aria-haspopup": 'listbox',
    "aria-expanded": isExpanded,
    onClick: function onClick(event) {
      event.preventDefault();
      setExpanded(function (expanded) {
        return !expanded;
      });
    }
  }), children);
}

function useListboxButtonLabel() {
  var _React$useContext2 = React.useContext(LabelContext),
      label = _React$useContext2.label;

  return label;
}

function ListboxButtonLabel() {
  return useListboxButtonLabel();
}

function ListboxList(_ref3) {
  var children = _ref3.children,
      rest = _objectWithoutProperties(_ref3, ["children"]);

  var optionRefs = React.useRef([]);

  var _React$useContext3 = React.useContext(ExpandedContext),
      isExpanded = _React$useContext3.isExpanded,
      setExpanded = _React$useContext3.setExpanded;

  var onChange = React.useContext(OnChangeContext);
  var value = React.useContext(ValueContext);
  React.useEffect(function () {
    if (isExpanded) {
      var selectedChild = optionRefs.current.find(function (option) {
        return option.getValue() === value;
      });

      if (selectedChild) {
        selectedChild.focus();
      } else {
        optionRefs.current[0].focus();
      }
    }
  }, [isExpanded, value]);
  return /*#__PURE__*/React.createElement("ul", _extends({}, rest, {
    role: "listbox",
    hidden: !isExpanded,
    onKeyDown: function onKeyDown(event) {
      if (event.key === 'Tab' || event.key === 'Escape') {
        setExpanded(false);
      } else if (event.key === 'Home' || event.key === 'ArrowUp' && event.metaKey) {
        return moveToTop(optionRefs.current, value, onChange);
      } else if (event.key === 'End' || event.key === 'ArrowDown' && event.metaKey) {
        return moveToBottom(optionRefs.current, value, onChange);
      } else if (event.key === 'ArrowUp' || event.key === 'Up') {
        return moveUp(optionRefs.current, value, onChange);
      } else if (event.key === 'ArrowDown' || event.key === 'Down') {
        return moveDown(optionRefs.current, value, onChange);
      }
    }
  }), React.Children.map(children, function (child, index) {
    return React.cloneElement(child, {
      ref: function ref(element) {
        optionRefs.current[index] = element;
      }
    });
  }));
}

var ListboxOption = React.forwardRef(function Option(_ref4, ref) {
  var children = _ref4.children,
      value = _ref4.value,
      rest = _objectWithoutProperties(_ref4, ["children", "value"]);

  var elementRef = React.useRef();
  var selectedValue = React.useContext(ValueContext);

  var _React$useContext4 = React.useContext(LabelContext),
      setLabel = _React$useContext4.setLabel;

  var onChange = React.useContext(OnChangeContext);

  var _React$useContext5 = React.useContext(ExpandedContext),
      setExpanded = _React$useContext5.setExpanded;

  var isSelected = value === selectedValue;
  React.useImperativeHandle(ref, function () {
    return {
      getValue: function getValue() {
        return value;
      },
      focus: function focus() {
        elementRef.current.focus();
      }
    };
  });
  React.useEffect(function () {
    if (isSelected) {
      setLabel(elementRef.current.textContent);
    }
  }, [isSelected, setLabel]);
  return /*#__PURE__*/React.createElement("li", _extends({}, rest, {
    ref: elementRef,
    role: "option",
    tabIndex: -1,
    "aria-selected": value === selectedValue,
    "data-value": value,
    onClick: function onClick() {
      setExpanded(false);
      onChange(value);
    },
    onKeyDown: function onKeyDown(event) {
      if (event.key === 'Enter') {
        setExpanded(false);
        return onChange(value);
      }
    }
  }), children);
});
exports.ListboxOption = ListboxOption;