import {
  getSessionStorage,
  removeSessionStorageItemByKey,
  removeSessionStorageKey,
} from '@/utils/sessionStorage';
import { debounceUpdateSessionStorage, mergeFormValuesWithContext } from '@/utils/workflows-ui';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

export default function useFlowHistory({
  renderingFromHistory,
  outcomeMap,
  nodeMap,
  currentContext,
  outcomes,
}) {
  const router = useRouter();
  const { activityId, flowName } = router.query;

  /* Add the current flow 'state' to sessionStorage */
  const updateGwfHistory = () => {
    if (renderingFromHistory.current) return;
    debounceUpdateSessionStorage({
      storageKey: `${flowName}-${activityId}`,
      outcomeMap,
      nodeMap,
      context: mergeFormValuesWithContext(currentContext),
      outcomes,
    });
  };

  /* We want to prevent 'Next' flows from being called while
  components/useEffects unwind the history data. 500ms is
  a somewhat arbitrary number, but given that the full
  history-render can take multiple cycles it's not really an
  exact science */
  const unlockHistoryRender = useCallback(() => {
    if (renderingFromHistory.current) {
      setTimeout(() => {
        renderingFromHistory.current = false;
      }, 500);
    }
  }, [renderingFromHistory]);

  const lockHistoryRender = useCallback(() => {
    renderingFromHistory.current = true;
    unlockHistoryRender();
  }, [unlockHistoryRender, renderingFromHistory]);

  /* Remove `summary` flow data from sessionStorage if the user
  moved back in the form and made updates */
  const checkSummaryHistory = useCallback(() => {
    if (renderingFromHistory.current) return;
    const summaryFlow = 'returns-continueToSummary';
    const gwfHistory = getSessionStorage('gwf:history') || {};

    if (flowName !== summaryFlow && gwfHistory[`${summaryFlow}-${activityId}`]) {
      removeSessionStorageItemByKey('gwf:history', `${summaryFlow}-${activityId}`);
      removeSessionStorageItemByKey('gwf:history', `ToggleableNodes-${activityId}`);
      window.dispatchEvent(new Event('gwf:breadcrumbs:refresh'));
    }
  }, [flowName]);

  useEffect(() => {
    /* If it's a fresh load (ie page refresh) using history */
    unlockHistoryRender();

    /* Lock the rendering callbacks if the user is navigating via breadcrumbs */
    window.addEventListener('gwf:breadcrumbs:navigate', lockHistoryRender);

    return () => {
      window.removeEventListener('gwf:breadcrumbs:navigate', lockHistoryRender);
    };
  });

  /* Update session storage with outcomes that result from a Next flow */
  useEffect(() => {
    if (outcomes.length > 0) {
      updateGwfHistory();
    }
  }, [outcomes, nodeMap]);

  /* Delete session storage after they submit */
  useEffect(() => {
    if (flowName === 'returns-submit') {
      removeSessionStorageKey('gwf:history');
      window.dispatchEvent(new Event('gwf:breadcrumbs:refresh'));
    }
  }, [router.query]);

  return { updateGwfHistory, checkSummaryHistory, lockHistoryRender };
}
