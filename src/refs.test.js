import { refSetter } from './refs';
import React from 'react';

describe('ref utils', () => {
  describe('refSetter', () => {
    it('should call function refs with the element', () => {
      const ref = jest.fn();
      const otherRef = jest.fn();

      refSetter(ref, otherRef)('foo');

      expect(ref).toHaveBeenCalledTimes(1);
      expect(ref).toHaveBeenCalledWith('foo');
      expect(otherRef).toHaveBeenCalledTimes(1);
      expect(otherRef).toHaveBeenCalledWith('foo');
    });

    it('should assign the element to the current property on ref objects', () => {
      const ref = React.createRef();
      const otherRef = React.createRef();

      refSetter(ref, otherRef)('foo');

      expect(ref.current).toBe('foo');
      expect(otherRef.current).toBe('foo');
    });

    it('should accept a mix of function refs and object refs', () => {
      const objectRef = React.createRef();
      const functionRef = jest.fn();

      refSetter(objectRef, functionRef)('foo');

      expect(objectRef.current).toBe('foo');
      expect(functionRef).toHaveBeenCalledTimes(1);
      expect(functionRef).toHaveBeenCalledWith('foo');
    });

    it('should ignore nil refs', () => {
      const ref = jest.fn();

      refSetter(null, undefined, ref)('foo');

      expect(ref).toHaveBeenCalledTimes(1);
      expect(ref).toHaveBeenCalledWith('foo');
    });
  });
});
