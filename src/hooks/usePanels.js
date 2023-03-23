import { useCallback } from 'react';
import { useRouter } from 'next/router';

export default function usePanels() {
  const router = useRouter();
  const navigateToPanel = useCallback(
    (interactionPanel) => {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            interactionPanel,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  return { navigateToPanel };
}
