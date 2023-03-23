import axios from 'axios';
import hasher from 'object-hash';
import useSWR from 'swr';
import useCustomer from '@/hooks/useCustomer';
import useActivity from '@/hooks/useActivity';
import processWorkflowData from '@/utils/workflows';
import ATHENA_KEYS from '@/constants/athena';
import {
  addSessionStorageItem,
  getSessionStorageItemByKey,
  removeSessionStorageItemByKey,
} from '@/utils/sessionStorage';
import useAthena from './useAthena';
import useSanitizedRouter from './useSanitizedRouter';

const resetWorkflowIfRestarted = (flowName, activityId) => {
  try {
    if (flowName === 'fixIssue-start') {
      addSessionStorageItem('gwf:history', {
        [`gwf:ts:${activityId}`]: Date.now(),
      });
      removeSessionStorageItemByKey('gwf:history', `gwf:${activityId}`);
    }
  } catch {}
};

const getSavedContext = (activityId) => {
  try {
    return getSessionStorageItemByKey('gwf:history', `gwf:${activityId}`);
  } catch {
    return {};
  }
};

export default function useWorkflowStart({ shouldFetch }) {
  const { activityId, flowName } = useSanitizedRouter();

  const { data: customer } = useCustomer();

  const { lang, getLang } = useAthena();

  const activity = useActivity();

  resetWorkflowIfRestarted(flowName, activityId);

  const context = getSavedContext(activityId);

  const gwfData = { ...activity, ...context, customer };

  const hash = hasher(gwfData);

  const gwfVersion = getLang(ATHENA_KEYS.GWF_VERSION, { fallback: '1' });

  const gwfSummaryVersion = getLang(ATHENA_KEYS.SUMMARY_GWF_VERSION, { fallback: '1' });

  return useSWR(
    () =>
      activity && customer && lang && shouldFetch
        ? `/api/v1/gwf/version/${
            flowName === 'returns-continueToSummary' ? gwfSummaryVersion : gwfVersion
          }/name/${flowName}-${hash}`
        : null,
    async () =>
      axios
        .post(
          `/api/v1/gwf/version/${
            flowName === 'returns-continueToSummary' ? gwfSummaryVersion : gwfVersion
          }/name/${flowName}`,
          gwfData,
        )
        .then(({ data }) => processWorkflowData(data, lang)),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );
}
