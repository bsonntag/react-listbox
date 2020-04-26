import * as React from 'react';
import styled from 'styled-components';
import {
  Listbox,
  ListboxButton,
  ListboxButtonLabel,
  ListboxList,
  ListboxOption,
} from '.';

export default {
  component: Listbox,
  title: 'Listbox',
};

function StatefulListbox(props) {
  const [value, setValue] = React.useState();
  return <Listbox {...props} value={value} onChange={setValue} />;
}

export const simple = () => (
  <StatefulListbox>
    <ListboxButton>
      <ListboxButtonLabel />
    </ListboxButton>
    <ListboxList>
      <ListboxOption>Choose a fruit</ListboxOption>
      <ListboxOption value='apple'>Apple</ListboxOption>
      <ListboxOption value='banana'>Banana</ListboxOption>
      <ListboxOption value='orange'>Orange</ListboxOption>
    </ListboxList>
  </StatefulListbox>
);

const StyledStatefulListbox = styled(StatefulListbox)`
  display: inline-block;
  position: relative;
`;

const StyledListboxButton = styled(ListboxButton)`
  appearance: none;
  background: white;
  border: 1px solid black;
  border-radius: 4px;
  padding: 1em 2em;
  outline: none;
  font: inherit;
  cursor: pointer;

  &:focus,
  &:hover {
    background: #f5f5f5;
  }

  &::-moz-focus-inner {
    border: 0;
  }
`;

const StyledListboxList = styled(ListboxList)`
  position: absolute;
  top: 100%;
  left: 0;
  padding: 0;
  margin: 0;
  border: 1px solid black;
  border-radius: 4px;
  overflow: hidden;
  list-style: none;
`;

const StyledListboxOption = styled(ListboxOption)`
  background: white;
  padding: 1em 2em;
  outline: none;
  white-space: nowrap;
  cursor: pointer;

  &:focus,
  &:hover {
    background: #f5f5f5;
  }
`;

export const withStyles = () => (
  <StyledStatefulListbox>
    <StyledListboxButton>
      <ListboxButtonLabel />
    </StyledListboxButton>
    <StyledListboxList>
      <StyledListboxOption>Choose a fruit</StyledListboxOption>
      <StyledListboxOption value='apple'>Apple</StyledListboxOption>
      <StyledListboxOption value='banana'>Banana</StyledListboxOption>
      <StyledListboxOption value='orange'>Orange</StyledListboxOption>
    </StyledListboxList>
  </StyledStatefulListbox>
);
