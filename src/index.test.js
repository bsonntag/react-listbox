import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import {
  Listbox,
  ListboxButton,
  ListboxButtonLabel,
  ListboxList,
  ListboxOption,
} from '.';

function StatefulListbox({ children, initialValue }) {
  const [value, setValue] = React.useState(initialValue);
  return (
    <Listbox value={value} onChange={setValue}>
      {children}
    </Listbox>
  );
}

describe('Listbox', () => {
  it('should select the option that has the provided value', () => {
    const { getByLabelText } = render(
      <Listbox value='apple' onChange={() => {}}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    expect(getByLabelText('Fruit')).toHaveTextContent('Apple');
  });

  it('should open the option list when the button is clicked', () => {
    const { getByLabelText, getByRole } = render(
      <Listbox value='apple' onChange={() => {}}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    expect(getByRole('listbox', { hidden: true })).not.toBeVisible();

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    expect(getByRole('listbox', { hidden: true })).toBeVisible();
  });

  it('should focus the selected option when the option list is opened', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox value='apple' onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    expect(getByRole('option', { name: 'Apple' })).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should focus the first option when the option list is opened and no option is selected', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    expect(getByRole('option', { name: 'Apple' })).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should focus the first non-empty option when the option list is opened and no option is selected', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          {null}
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    expect(getByRole('option', { name: 'Apple' })).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should select the first option when the option list is opened and no option is selected and `autoSelect` is true', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList autoSelect>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    expect(getByRole('option', { name: 'Apple' })).toHaveFocus();
    expect(onChange).toHaveBeenCalledWith('apple');
  });

  it('should select an option and close the list when it is clicked', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox value='apple' onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    // Click "Banana" option.
    const option = getByRole('option', { name: 'Banana' });
    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledWith('banana');
    expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
  });

  it('should select an option and close the list when the enter key is pressed on it', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox value='apple' onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    // Press Enter on the "Banana" option.
    const option = getByRole('option', { name: 'Banana' });
    fireEvent.keyDown(option, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('banana');
    expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
  });

  it('should focus the button when an option is selected', () => {
    const { getByLabelText, getByRole } = render(
      <Listbox value='apple' onChange={() => {}}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    // Select the "Banana" option.
    const option = getByRole('option', { name: 'Banana' });
    fireEvent.click(option);

    expect(button).toHaveFocus();
  });

  it('should focus the next option when the down arrow key is pressed', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox value='apple' onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    const option = getByRole('option', { name: 'Apple' });
    fireEvent.keyDown(option, { key: 'ArrowDown' });

    expect(onChange).not.toHaveBeenCalled();
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Banana' })).toHaveFocus();
  });

  it('should select the next option when the down arrow key is pressed and `autoSelect` is true', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox value='apple' onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList autoSelect>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    const option = getByRole('option', { name: 'Apple' });
    fireEvent.keyDown(option, { key: 'ArrowDown' });

    expect(onChange).toHaveBeenCalledWith('banana');
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Banana' })).toHaveFocus();
  });

  it('should focus the first option when the down arrow key is pressed on the last option', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox value='orange' onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    const option = getByRole('option', { name: 'Orange' });
    fireEvent.keyDown(option, { key: 'ArrowDown' });

    expect(onChange).not.toHaveBeenCalled();
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Choose one' })).toHaveFocus();
  });

  it('should focus the previous option when the up arrow key is pressed', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox value='banana' onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    const option = getByRole('option', { name: 'Banana' });
    fireEvent.keyDown(option, { key: 'ArrowUp' });

    expect(onChange).not.toHaveBeenCalled();
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Apple' })).toHaveFocus();
  });

  it('should select the previous option when the up arrow key is pressed and `autoSelect` is true', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox value='banana' onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList autoSelect>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    const option = getByRole('option', { name: 'Banana' });
    fireEvent.keyDown(option, { key: 'ArrowUp' });

    expect(onChange).toHaveBeenCalledWith('apple');
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Apple' })).toHaveFocus();
  });

  it('should focus the last option when the up arrow key is pressed on the first option', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    const option = getByRole('option', { name: 'Choose one' });
    fireEvent.keyDown(option, { key: 'ArrowUp' });

    expect(onChange).not.toHaveBeenCalled();
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Orange' })).toHaveFocus();
  });

  it('should focus the first option when the home key is pressed', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox value='apple' onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    const option = getByRole('option', { name: 'Apple' });
    fireEvent.keyDown(option, { key: 'Home' });

    expect(onChange).not.toHaveBeenCalled();
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Choose one' })).toHaveFocus();
  });

  it('should select the first option when the home key is pressed and `autoSelect` is true', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox value='apple' onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList autoSelect>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    const option = getByRole('option', { name: 'Apple' });
    fireEvent.keyDown(option, { key: 'Home' });

    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Choose one' })).toHaveFocus();
  });

  it('should focus the last option when the end key is pressed', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox value='apple' onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    const option = getByRole('option', { name: 'Apple' });
    fireEvent.keyDown(option, { key: 'End' });

    expect(onChange).not.toHaveBeenCalled();
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Orange' })).toHaveFocus();
  });

  it('should select the last option when the end key is pressed and `autoSelect` is true', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Listbox value='apple' onChange={onChange}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList autoSelect>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    const option = getByRole('option', { name: 'Apple' });
    fireEvent.keyDown(option, { key: 'End' });

    expect(onChange).toHaveBeenCalledWith('orange');
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Orange' })).toHaveFocus();
  });

  it('should ignore empty options when navigating with the keyboard', () => {
    const { getByLabelText, getByRole } = render(
      <StatefulListbox initialValue='banana'>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          {undefined}
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          {null}
          <ListboxOption value='orange'>Orange</ListboxOption>
          {false}
        </ListboxList>
      </StatefulListbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    const listbox = getByRole('listbox');
    const appleOption = getByRole('option', { name: 'Apple' });
    const bananaOption = getByRole('option', { name: 'Banana' });
    const orangeOption = getByRole('option', { name: 'Orange' });

    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    expect(orangeOption).toHaveFocus();

    fireEvent.keyDown(listbox, { key: 'ArrowUp' });
    expect(bananaOption).toHaveFocus();

    fireEvent.keyDown(listbox, { key: 'Home' });
    expect(appleOption).toHaveFocus();

    fireEvent.keyDown(listbox, { key: 'End' });
    expect(orangeOption).toHaveFocus();
  });

  it('should close the options list when the escape key is pressed on an option', () => {
    const { getByLabelText, getByRole } = render(
      <Listbox value='apple' onChange={() => {}}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
          <ListboxOption value='banana'>Banana</ListboxOption>
          <ListboxOption value='orange'>Orange</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    const option = getByRole('option', { name: 'Apple' });
    fireEvent.keyDown(option, { key: 'Escape' });

    expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
  });

  it('should ignore false and nil values in options list', () => {
    const { getByLabelText, getByText, getByRole } = render(
      <Listbox value='apple' onChange={() => {}}>
        <ListboxButton aria-label='Fruit'>
          <ListboxButtonLabel />
        </ListboxButton>
        <ListboxList>
          {null}
          {undefined}
          {false}
          <ListboxOption>Choose one</ListboxOption>
          <ListboxOption value='apple'>Apple</ListboxOption>
        </ListboxList>
      </Listbox>
    );

    // Open listbox.
    const button = getByLabelText('Fruit');
    fireEvent.click(button);

    expect(getByRole('listbox').firstChild).toBe(getByText('Choose one'));
  });
});
