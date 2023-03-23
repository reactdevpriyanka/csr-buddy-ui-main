import { useCallback } from 'react';
import useOracle from './useOracle';

export default function useSuzzieTab() {
  const oracle = useOracle();
  return useCallback(
    (event) => {
      event.preventDefault();
      oracle?.emit('loadInSuzzie', { href: event.target.href });
      if (!oracle?.initialized) {
        window.open(event.target.href);
      }
    },
    [oracle],
  );
}
