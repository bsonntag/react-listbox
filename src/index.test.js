import React from 'react';
import { render, fireEvent, getByText } from '@testing-library/react';
import {
  Listbox,
  ListboxButton,
  ListboxButtonLabel,
  ListboxList,
  ListboxOption,
} from '.';

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

    expect(getByRole('option', { name: 'Apple' })).toHaveFocus();
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

  it('should select the next option when the down arrow key is pressed', () => {
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

    expect(onChange).toHaveBeenCalledWith('banana');
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Banana' })).toHaveFocus();
  });

  it('should select the previous option when the up arrow key is pressed', () => {
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

    expect(onChange).toHaveBeenCalledWith('apple');
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Apple' })).toHaveFocus();
  });

  it('should select the first option when the home key is pressed', () => {
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

    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Choose one' })).toHaveFocus();
  });

  it('should select the last option when the end key is pressed', () => {
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

    expect(onChange).toHaveBeenCalledWith('orange');
    expect(getByRole('listbox', { hidden: true })).toBeVisible();
    expect(getByRole('option', { name: 'Orange' })).toHaveFocus();
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
