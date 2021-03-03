import * as React from 'react';

export function Listbox(
  props: React.HTMLAttributes<HTMLDivElement> & {
    onChange: (value: any) => void;
    value: any;
  }
): JSX.Element;

export function ListboxButton(
  props: Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'aria-haspopup' | 'aria-expanded' | 'onClick'
  >
): JSX.Element;

export function ListboxButtonLabel(): JSX.Element;

export function ListboxList(
  props: React.HTMLAttributes<HTMLUListElement> & {
    autoSelect: (value: any) => void;
  }
): JSX.Element;

export function ListboxOption(
  props: React.HTMLAttributes<HTMLLIElement> & {
    value: any;
  }
): JSX.Element;
