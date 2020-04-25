import * as React from 'react';
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

function StatefulSelect(props) {
  const [value, setValue] = React.useState();
  return <Listbox {...props} value={value} onChange={setValue} />;
}

export const simple = () => {
  return (
    <StatefulSelect>
      <ListboxButton>
        <ListboxButtonLabel />
      </ListboxButton>
      <ListboxList>
        <ListboxOption>Choose a fruit</ListboxOption>
        <ListboxOption value='apple'>Apple</ListboxOption>
        <ListboxOption value='banana'>Banana</ListboxOption>
        <ListboxOption value='orange'>Orange</ListboxOption>
      </ListboxList>
    </StatefulSelect>
  );
};
