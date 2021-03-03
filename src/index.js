import * as React from 'react';
import { createSignal } from 'react-signal';
import { refSetter } from './refs';

const ValueContext = React.createContext();
const OnChangeContext = React.createContext();
const LabelContext = React.createContext();
const ExpandedContext = React.createContext();

const ButtonFocusSignal = createSignal();

function moveDown(children, value, onChange) {
  if (children.length === 0) return;

  const currentIndex = children.findIndex((child) => child.hasFocus());
  const nextChild = children[(currentIndex + 1) % children.length];
  nextChild.focus();
  if (onChange) {
    onChange(nextChild.getValue());
  }
}

function moveUp(children, value, onChange) {
  if (children.length === 0) return;

  const currentIndex = children.findIndex((child) => child.hasFocus());
  let previousIndex = currentIndex - 1;
  previousIndex = previousIndex < 0 ? children.length - 1 : previousIndex;
  const previousChild = children[previousIndex];
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

export const Listbox = React.forwardRef(function Listbox(
  { children, value, onChange, ...rest },
  forwardedRef
) {
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
    <div {...rest} ref={refSetter(ref, forwardedRef)}>
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
});

export const ListboxButton = React.forwardRef(function ListboxButton(
  { children, ...rest },
  forwardedRef
) {
  const { isExpanded, setExpanded } = React.useContext(ExpandedContext);
  const ref = React.useRef();

  ButtonFocusSignal.useSubscription(() => {
    ref.current.focus();
  });

  return (
    <button
      {...rest}
      ref={refSetter(ref, forwardedRef)}
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
});

export function useListboxButtonLabel() {
  const { label } = React.useContext(LabelContext);
  return label;
}

export function ListboxButtonLabel() {
  return useListboxButtonLabel();
}

export const ListboxList = React.forwardRef(function ListboxList(
  { children, autoSelect, ...rest },
  forwardedRef
) {
  const ref = React.useRef();
  const optionRefs = React.useRef([]);
  const { isExpanded, setExpanded } = React.useContext(ExpandedContext);
  const onChange = React.useContext(OnChangeContext);
  const value = React.useContext(ValueContext);
  const onChangeRef = React.useRef(onChange);

  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  React.useEffect(() => {
    if (isExpanded) {
      const options = optionRefs.current.filter(Boolean);
      const selectedChild = options.find((option) => {
        return option.getValue() === value;
      });

      if (selectedChild) {
        selectedChild.focus();
      } else if (options.length > 0) {
        const firstChild = options[0];
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

  return (
    <ul
      {...rest}
      ref={refSetter(ref, forwardedRef)}
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
          return moveToTop(
            optionRefs.current.filter(Boolean),
            value,
            autoSelect ? onChange : null
          );
        } else if (
          event.key === 'End' ||
          (event.key === 'ArrowDown' && event.metaKey)
        ) {
          return moveToBottom(
            optionRefs.current.filter(Boolean),
            value,
            autoSelect ? onChange : null
          );
        } else if (event.key === 'ArrowUp' || event.key === 'Up') {
          return moveUp(
            optionRefs.current.filter(Boolean),
            value,
            autoSelect ? onChange : null
          );
        } else if (event.key === 'ArrowDown' || event.key === 'Down') {
          return moveDown(
            optionRefs.current.filter(Boolean),
            value,
            autoSelect ? onChange : null
          );
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
});

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
    hasFocus: () => {
      return elementRef.current === window.document.activeElement;
    },
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
