import * as React from 'react';

const ValueContext = React.createContext();
const OnChangeContext = React.createContext();
const LabelContext = React.createContext();
const ExpandedContext = React.createContext();

function moveDown(children, value, onChange) {
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
  children[0].focus();
  onChange(children[0].getValue());
}

function moveToBottom(children, value, onChange) {
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
      <ExpandedContext.Provider value={expandedContextValue}>
        <OnChangeContext.Provider value={onChange}>
          <LabelContext.Provider value={labelContextValue}>
            <ValueContext.Provider value={value}>
              {children}
            </ValueContext.Provider>
          </LabelContext.Provider>
        </OnChangeContext.Provider>
      </ExpandedContext.Provider>
    </div>
  );
}

export function ListboxButton({ children, ...rest }) {
  const { isExpanded, setExpanded } = React.useContext(ExpandedContext);

  return (
    <button
      {...rest}
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
  const optionRefs = React.useRef([]);
  const { isExpanded, setExpanded } = React.useContext(ExpandedContext);
  const onChange = React.useContext(OnChangeContext);
  const value = React.useContext(ValueContext);

  React.useEffect(() => {
    if (isExpanded) {
      const selectedChild = optionRefs.current.find((option) => {
        return option.getValue() === value;
      });

      if (selectedChild) {
        selectedChild.focus();
      } else {
        optionRefs.current[0].focus();
      }
    }
  }, [isExpanded, value]);

  return (
    <ul
      {...rest}
      role='listbox'
      hidden={!isExpanded}
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          setExpanded(false);
        } else if (
          event.key === 'Home' ||
          (event.key === 'ArrowUp' && event.metaKey)
        ) {
          return moveToTop(optionRefs.current, value, onChange);
        } else if (
          event.key === 'End' ||
          (event.key === 'ArrowDown' && event.metaKey)
        ) {
          return moveToBottom(optionRefs.current, value, onChange);
        } else if (event.key === 'ArrowUp' || event.key === 'Up') {
          return moveUp(optionRefs.current, value, onChange);
        } else if (event.key === 'ArrowDown' || event.key === 'Down') {
          return moveDown(optionRefs.current, value, onChange);
        }
      }}
    >
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
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

  return (
    <li
      {...rest}
      ref={elementRef}
      role='option'
      tabIndex={-1}
      aria-selected={value === selectedValue}
      data-value={value}
      onClick={() => {
        setExpanded(false);
        onChange(value);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          setExpanded(false);
          return onChange(value);
        }
      }}
    >
      {children}
    </li>
  );
});
