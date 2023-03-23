import axios from 'axios';
import useSWR from 'swr';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';
import { getFrequency } from '@/components/Autoship/constants';
import useAthena from '@/hooks/useAthena';

export default function useSubscription(subscriptionId) {
  const { enqueueSnackbar } = useSnackbar();
  const { getLang } = useAthena();

  const { data: subscriptionData, error, mutate, ...rest } = useSWR(
    subscriptionId && `/api/v3/autoship-activities/${subscriptionId}`,
    async (url) => axios.get(url).then(({ data }) => data),
    {
      revalidateOnFocus: false,
    },
  );

  const success = useCallback(
    (message) => {
      enqueueSnackbar({
        key: 'subscription-success',
        variant: SNACKVARIANTS.SUCCESS,
        messageHeader: getLang('snackbarSuccessText', { fallback: 'Success' }),
        messageSubheader: message,
      });
    },
    [enqueueSnackbar, getLang],
  );

  const fail = useCallback(
    (message) => {
      enqueueSnackbar(
        {
          key: 'subscription-error',
          variant: SNACKVARIANTS.ERROR,
          messageHeader: getLang('snackbarErrorText', { fallback: 'Error' }),
          messageSubheader: message,
        },
        { persist: true },
      );
    },
    [enqueueSnackbar, getLang],
  );

  const updateSubscription = useCallback(
    async ({ customerId, data }, onSuccess = null) => {
      try {
        const response = await axios.patch(`/api/v1/subscriptions/${subscriptionId}`, data, {
          headers: {
            'X-User-Id': customerId,
          },
        });

        // Very well aware that this is not good practice
        // But is needed until we can solve the SIDS, ODS delay
        //
        setTimeout(async () => {
          await mutate({
            ...data,
            fulfillmentFrequency: response?.data?.fulfillmentFrequency,
            fulfillmentFrequencyUom: response?.data?.fulfillmentFrequencyUom,
            nextFulfillmentDate: response?.data?.nextFulfillmentDate,
          });

          const frequency = getFrequency(data?.fulfillment_frequency, data?.fulfillment_uom);
          success(`Autoship frequency has been updated to ${frequency}`);

          if (onSuccess) {
            onSuccess();
          }
        }, 3000);
      } catch {
        fail('Failed to update subscription frequency');
      }
    },
    [success, fail],
  );

  return {
    data: subscriptionData,
    error,
    mutate,
    updateSubscription,
    ...rest,
  };
}
