import { useState, useEffect } from 'react';

const useDebounced = (value) => {
  let [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    let timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, 800);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value]);

  return debouncedValue;
};

export default useDebounced;
