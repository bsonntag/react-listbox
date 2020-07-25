# react-listbox

[![CircleCI build](https://circleci.com/gh/bsonntag/react-listbox.svg?style=svg)](https://circleci.com/gh/bsonntag/react-listbox)

A customizable, accessible and controllable listbox component for React.

## Installation

Using npm:

```sh
npm install @bsonntag/react-listbox
```

Using yarn:

```sh
yarn add @bsonntag/react-listbox
```

## Usage

```js
import React from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxButtonLabel,
  ListboxList,
  ListboxOption,
} from '@bsonntag/react-listbox';

function Select() {
  const [value, setValue] = useState();
  return (
    <Listbox value={value} onChange={setValue}>
      <ListboxButton aria-label='Fruit'>
        <ListboxButtonLabel />
      </ListboxButton>
      <ListboxList>
        <ListboxOption>Choose one fruit</ListboxOption>
        <ListboxOption value='apple'>Apple</ListboxOption>
        <ListboxOption value='banana'>Banana</ListboxOption>
        <ListboxOption value='orange'>Orange</ListboxOption>
      </ListboxList>
    </Listbox>
  );
}
```

## Contributing

Please feel free to submit any issues or pull requests.

## License

MIT
