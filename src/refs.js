export const refSetter = (...refs) => (element) => {
  refs.forEach((ref) => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(element);
      } else {
        ref.current = element;
      }
    }
  });
};
