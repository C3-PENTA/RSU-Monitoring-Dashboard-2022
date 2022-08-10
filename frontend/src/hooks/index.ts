import { useEffect, useRef } from 'react';

/**
 * useEffect that not trigger on first render
 *
 * @param cb a function that handle useEffect logic
 * @param dep useEffect dependancy
 */
export const useLazyEffect: typeof useEffect = (cb, dep) => {
  const initializeRef = useRef<boolean>(false);

  useEffect((...args) => {
    if (initializeRef.current) {
      cb(...args);
      return;
    }
    initializeRef.current = true;
  }, dep);
};
