import * as React from 'react';
import { createSignal } from 'react-signal';

const ValueContext = React.createContext();
const OnChangeContext = React.createContext();
const LabelContext = React.createContext();
const ExpandedContext = React.createContext();

const ButtonFocusSignal = createSignal();

function moveDown(children, value, onChange) {
  if (children.length === 0) return;

  const selectedIndex = children.findIndex((child) => {
    return child.getValue() === value;
  });
  let nextIndex = selectedIndex + 1;
  nextIndex = nextIndex === children.length ? 0 : nextIndex;
  const nextChild = children[nextIndex];
  nextChild.focus();
  onChange(nextChild.getValue());
}

function moveUp(children, value, onChange) {
  if (children.length === 0) return;

  const selectedIndex = children.findIndex((child) => {
    return child.getValue() === value;
  });
  let nextIndex = selectedIndex - 1;
  nextIndex = nextIndex === -1 ? children.length - 1 : nextIndex;
  const nextChild = children[nextIndex];
  nextChild.focus();
  onChange(nextChild.getValue());
}

function moveToTop(children, value, onChange) {
  if (children.length === 0) return;

  children[0].focus();
  onChange(children[0].getValue());
}

function moveToBottom(children, value, onChange) {
  if (children.length === 0) return;

  children[children.length - 1].focus();
  onChange(children[children.length - 1].getValue());
}

export function Listbox({ children, value, onChange, ...rest }) {
  const ref = React.useRef();
  const [label, setLabel] = React.useState(null);
  const [isExpanded, setExpanded] = React.useState(false);
  const labelContextValue = React.useMemo(() => ({ label, setLabel }), [label]);
  const expandedContextValue = React.useMemo(
    () => ({ isExpanded, setExpanded }),
    [isExpanded]
  );

  React.useEffect(() => {
    function handleWindowClick(event) {
      if (!ref.current.contains(event.target)) {
        setExpanded(false);
      }
    }

    window.addEventListener('click', handleWindowClick, false);

    return () => {
      window.removeEventListener('click', handleWindowClick, false);
    };
  }, []);

  return (
    <div {...rest} ref={ref}>
      <ButtonFocusSignal.Provider>
        <ExpandedContext.Provider value={expandedContextValue}>
          <OnChangeContext.Provider value={onChange}>
            <LabelContext.Provider value={labelContextValue}>
              <ValueContext.Provider value={value}>
                {children}
              </ValueContext.Provider>
            </LabelContext.Provider>
          </OnChangeContext.Provider>
        </ExpandedContext.Provider>
      </ButtonFocusSignal.Provider>
    </div>
  );
}

export function ListboxButton({ children, ...rest }) {
  const { isExpanded, setExpanded } = React.useContext(ExpandedContext);
  const ref = React.useRef();

  ButtonFocusSignal.useSubscription(() => {
    ref.current.focus();
  });

  return (
    <button
      {...rest}
      ref={ref}
      aria-haspopup={'listbox'}
      aria-expanded={isExpanded}
      onClick={(event) => {
        event.preventDefault();
        setExpanded((expanded) => !expanded);
      }}
    >
      {children}
    </button>
  );
}

export function useListboxButtonLabel() {
  const { label } = React.useContext(LabelContext);
  return label;
}

export function ListboxButtonLabel() {
  return useListboxButtonLabel();
}

export function ListboxList({ children, ...rest }) {
  const ref = React.useRef();
  const optionRefs = React.useRef([]);
  const { isExpanded, setExpanded } = React.useContext(ExpandedContext);
  const onChange = React.useContext(OnChangeContext);
  const value = React.useContext(ValueContext);

  React.useEffect(() => {
    if (isExpanded) {
      const options = optionRefs.current.filter(Boolean);
      const selectedChild = options.find((option) => {
        return option.getValue() === value;
      });

      if (selectedChild) {
        selectedChild.focus();
      } else if (options.length > 0) {
        options[0].focus();
      } else {
        ref.current.focus();
      }
    }
  }, [isExpanded, value]);

  return (
    <ul
      {...rest}
      ref={ref}
      role='listbox'
      tabIndex={-1}
      hidden={!isExpanded}
      onKeyDown={(event) => {
        if (event.key === 'Tab' || event.key === 'Escape') {
          setExpanded(false);
        } else if (
          event.key === 'Home' ||
          (event.key === 'ArrowUp' && event.metaKey)
        ) {
          return moveToTop(optionRefs.current.filter(Boolean), value, onChange);
        } else if (
          event.key === 'End' ||
          (event.key === 'ArrowDown' && event.metaKey)
        ) {
          return moveToBottom(
            optionRefs.current.filter(Boolean),
            value,
            onChange
          );
        } else if (event.key === 'ArrowUp' || event.key === 'Up') {
          return moveUp(optionRefs.current.filter(Boolean), value, onChange);
        } else if (event.key === 'ArrowDown' || event.key === 'Down') {
          return moveDown(optionRefs.current.filter(Boolean), value, onChange);
        }
      }}
    >
      {React.Children.map(children, (child, index) => {
        return !child
          ? null
          : React.cloneElement(child, {
              ref: (element) => {
                optionRefs.current[index] = element;
              },
            });
      })}
    </ul>
  );
}

export const ListboxOption = React.forwardRef(function Option(
  { children, value, ...rest },
  ref
) {
  const elementRef = React.useRef();
  const selectedValue = React.useContext(ValueContext);
  const { setLabel } = React.useContext(LabelContext);
  const onChange = React.useContext(OnChangeContext);
  const { setExpanded } = React.useContext(ExpandedContext);
  const focusButton = ButtonFocusSignal.usePublish();
  const isSelected = value === selectedValue;

  React.useImperativeHandle(ref, () => ({
    getValue: () => value,
    focus: () => {
      elementRef.current.focus();
    },
  }));

  React.useEffect(() => {
    if (isSelected) {
      setLabel(elementRef.current.textContent);
    }
  }, [isSelected, setLabel]);

  function handleChange() {
    setExpanded(false);
    onChange(value);
    focusButton();
  }

  return (
    <li
      {...rest}
      ref={elementRef}
      role='option'
      tabIndex={-1}
      aria-selected={value === selectedValue}
      data-value={value}
      onClick={handleChange}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          return handleChange();
        }
      }}
    >
      {children}
    </li>
  );
});
