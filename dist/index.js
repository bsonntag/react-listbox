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

var _reactSignal = require("react-signal");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var ValueContext = React.createContext();
var OnChangeContext = React.createContext();
var LabelContext = React.createContext();
var ExpandedContext = React.createContext();
var ButtonFocusSignal = (0, _reactSignal.createSignal)();

function moveDown(children, value, onChange) {
  if (children.length === 0) return;
  var currentIndex = children.findIndex(function (child) {
    return child.hasFocus();
  });
  var nextChild = children[(currentIndex + 1) % children.length];
  nextChild.focus();

  if (onChange) {
    onChange(nextChild.getValue());
  }
}

function moveUp(children, value, onChange) {
  if (children.length === 0) return;
  var currentIndex = children.findIndex(function (child) {
    return child.hasFocus();
  });
  var previousIndex = currentIndex - 1;
  previousIndex = previousIndex < 0 ? children.length - 1 : previousIndex;
  var previousChild = children[previousIndex];
  previousChild.focus();

  if (onChange) {
    onChange(previousChild.getValue());
  }
}

function moveToTop(children, value, onChange) {
  if (children.length === 0) return;
  children[0].focus();

  if (onChange) {
    onChange(children[0].getValue());
  }
}

function moveToBottom(children, value, onChange) {
  if (children.length === 0) return;
  children[children.length - 1].focus();

  if (onChange) {
    onChange(children[children.length - 1].getValue());
  }
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
  }), /*#__PURE__*/React.createElement(ButtonFocusSignal.Provider, null, /*#__PURE__*/React.createElement(ExpandedContext.Provider, {
    value: expandedContextValue
  }, /*#__PURE__*/React.createElement(OnChangeContext.Provider, {
    value: onChange
  }, /*#__PURE__*/React.createElement(LabelContext.Provider, {
    value: labelContextValue
  }, /*#__PURE__*/React.createElement(ValueContext.Provider, {
    value: value
  }, children))))));
}

function ListboxButton(_ref2) {
  var children = _ref2.children,
      rest = _objectWithoutProperties(_ref2, ["children"]);

  var _React$useContext = React.useContext(ExpandedContext),
      isExpanded = _React$useContext.isExpanded,
      setExpanded = _React$useContext.setExpanded;

  var ref = React.useRef();
  ButtonFocusSignal.useSubscription(function () {
    ref.current.focus();
  });
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    ref: ref,
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
      autoSelect = _ref3.autoSelect,
      rest = _objectWithoutProperties(_ref3, ["children", "autoSelect"]);

  var ref = React.useRef();
  var optionRefs = React.useRef([]);

  var _React$useContext3 = React.useContext(ExpandedContext),
      isExpanded = _React$useContext3.isExpanded,
      setExpanded = _React$useContext3.setExpanded;

  var onChange = React.useContext(OnChangeContext);
  var value = React.useContext(ValueContext);
  var onChangeRef = React.useRef(onChange);
  React.useEffect(function () {
    onChangeRef.current = onChange;
  });
  React.useEffect(function () {
    if (isExpanded) {
      var options = optionRefs.current.filter(Boolean);
      var selectedChild = options.find(function (option) {
        return option.getValue() === value;
      });

      if (selectedChild) {
        selectedChild.focus();
      } else if (options.length > 0) {
        var firstChild = options[0];
        firstChild.focus();

        if (autoSelect) {
          // Use a ref so that this effect doesn't re-run when `onChange` changes.
          onChangeRef.current(firstChild.getValue());
        }
      } else {
        ref.current.focus();
      }
    }
  }, [autoSelect, isExpanded, value]);
  return /*#__PURE__*/React.createElement("ul", _extends({}, rest, {
    ref: ref,
    role: "listbox",
    tabIndex: -1,
    hidden: !isExpanded,
    onKeyDown: function onKeyDown(event) {
      if (event.key === 'Tab' || event.key === 'Escape') {
        setExpanded(false);
      } else if (event.key === 'Home' || event.key === 'ArrowUp' && event.metaKey) {
        return moveToTop(optionRefs.current.filter(Boolean), value, autoSelect ? onChange : null);
      } else if (event.key === 'End' || event.key === 'ArrowDown' && event.metaKey) {
        return moveToBottom(optionRefs.current.filter(Boolean), value, autoSelect ? onChange : null);
      } else if (event.key === 'ArrowUp' || event.key === 'Up') {
        return moveUp(optionRefs.current.filter(Boolean), value, autoSelect ? onChange : null);
      } else if (event.key === 'ArrowDown' || event.key === 'Down') {
        return moveDown(optionRefs.current.filter(Boolean), value, autoSelect ? onChange : null);
      }
    }
  }), React.Children.map(children, function (child, index) {
    return !child ? null : React.cloneElement(child, {
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

  var focusButton = ButtonFocusSignal.usePublish();
  var isSelected = value === selectedValue;
  React.useImperativeHandle(ref, function () {
    return {
      getValue: function getValue() {
        return value;
      },
      hasFocus: function hasFocus() {
        return elementRef.current === window.document.activeElement;
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

  function handleChange() {
    setExpanded(false);
    onChange(value);
    focusButton();
  }

  return /*#__PURE__*/React.createElement("li", _extends({}, rest, {
    ref: elementRef,
    role: "option",
    tabIndex: -1,
    "aria-selected": value === selectedValue,
    "data-value": value,
    onClick: handleChange,
    onKeyDown: function onKeyDown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        return handleChange();
      }
    }
  }), children);
});
exports.ListboxOption = ListboxOption;