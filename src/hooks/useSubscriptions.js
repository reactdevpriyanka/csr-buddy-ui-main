import useSWR, { useSWRConfig } from 'swr';
import axios from 'axios';
import { useMemo, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';
import useAthena from '@/hooks/useAthena';
import useParentSubscriptions from '@/hooks/useParentSubscriptions';
import { getFrequency } from '@/components/Autoship/constants';
import useSanitizedRouter from './useSanitizedRouter';

export default function useSubscriptions() {
  const { id: customerId } = useSanitizedRouter();
  const { mutate } = useSWRConfig();
  const { mutate: mutateSubscriptions } = useParentSubscriptions(customerId);
  const { enqueueSnackbar } = useSnackbar();
  const { getLang } = useAthena();

  const skippedAutoshipSuccess = useMemo(
    () =>
      getLang('skipAutoshipSuccessText', { fallback: 'Customers next Autoship has been skipped' }),
    [getLang],
  );
  const skippedAutoshipError = useMemo(
    () => getLang('skipAutoshipErrorText', { fallback: 'Skip Autoship Failed!' }),
    [getLang],
  );
  const shipNowErrorText = useMemo(
    () => getLang('shipNowErrorText', { fallback: 'Ship Order Failed!' }),
    [getLang],
  );
  const snackBarSuccess = useMemo(() => getLang('snackbarSuccessText', { fallback: 'Success' }), [
    getLang,
  ]);
  const snackBarError = useMemo(() => getLang('snackbarErrorText', { fallback: 'Error' }), [
    getLang,
  ]);

  const success = useCallback(
    (message) => {
      enqueueSnackbar({
        key: 'subscription-success',
        variant: SNACKVARIANTS.SUCCESS,
        messageHeader: snackBarSuccess,
        messageSubheader: !Array.isArray(message) && message,
        listItems: Array.isArray(message) && [message],
      });
    },
    [enqueueSnackbar, snackBarSuccess],
  );

  const fail = useCallback(
    (message) => {
      enqueueSnackbar(
        {
          key: 'subscription-error',
          variant: SNACKVARIANTS.ERROR,
          messageHeader: snackBarError,
          messageSubheader: !Array.isArray(message) && message,
          listItems: Array.isArray(message) && [message],
        },
        { persist: true },
      );
    },
    [enqueueSnackbar, snackBarError],
  );

  const instance = useMemo(() => axios.create(), []);

  const updateSubscription = useCallback(
    ({ subscriptionId, customerId, data }, onSuccess = null) => {
      return instance
        .patch(`/api/v1/subscriptions/${subscriptionId}`, data, {
          headers: {
            'X-User-Id': customerId,
          },
        })
        .then((response) => {
          const frequency = getFrequency(data?.fulfillment_frequency, data?.fulfillment_uom);
          success(`Autoship frequency has been updated to ${frequency}`);
          const updateActivity = (activities) =>
            activities.map((activity) => {
              if (activity?.id === subscriptionId) {
                activity.fulfillmentFrequency = response?.data?.fulfillmentFrequency;
                activity.fulfillmentFrequencyUom = response?.data?.fulfillmentFrequencyUom;
                activity.nextFulfillmentDate = response?.data?.nextFulfillmentDate;
              }
              return activity;
            });
          mutate(updateActivity);
        })
        .then(() => {
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch(() => fail('Failed to update subscription frequency'));
    },
    [instance, success, fail],
  );

  const useSubscriptionCancelReasons = () =>
    useSWR(
      '/api/v1/subscriptions/cancel-reasons',
      async (url) => instance.get(url).then(({ data }) => data),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
      },
    );

  const cancelSubscription = useCallback(
    ({ subscriptionId, customerId, data }, onSuccess = null) => {
      instance
        .post(`/api/v1/subscriptions/${subscriptionId}/cancel`, data, {
          headers: {
            'x-user-id': customerId,
          },
        })
        .then(() => {
          success(`Autoship ${subscriptionId} cancelled`);
          const removeActivity = (activities) =>
            (activities || []).filter((activity) => activity.data?.autoship?.id !== subscriptionId);
          mutateSubscriptions(removeActivity);
          mutate(removeActivity);
        })
        .then(() => {
          if (onSuccess) {
            onSuccess();
            mutate(`/api/v3/autoship-activities/${subscriptionId}`);
          }
        })
        .catch(() => fail('Cancel Autoship Failed!'));
    },
    [instance, success, fail],
  );

  const shipSubscriptionNow = useCallback(
    ({ subscriptionId, customerId, data }, onSuccess = null) => {
      return instance
        .post(`/api/v1/subscriptions/${subscriptionId}/orderNow`, data, {
          headers: {
            'x-user-id': customerId,
          },
        })
        .then(({ data }) => {
          success('Autoship has been scheduled for release!');
          // TODO
          // This is an awful hack... we should have a better way of refreshing the feed
          // @see {https://chewyinc.atlassian.net/browse/CSRBT-810}
          instance
            .get(`/api/v1/subscriptions/${subscriptionId}`)
            .then(({ data }) => {
              const updateActivity = (activities) =>
                activities.map((activity) => {
                  if (
                    activity?.data?.autoship?.id === subscriptionId &&
                    data?.nextFulfillmentDate
                  ) {
                    activity.data.autoship.nextFulfillmentDate = data.nextFulfillmentDate;
                  }
                  return activity;
                });
              mutateSubscriptions(updateActivity);
              mutate(updateActivity);
            })
            .catch(() => {});
        })
        .then(() => {
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch(() => fail(shipNowErrorText));
    },
    [instance, shipNowErrorText],
  );

  const skipNextShipment = useCallback(
    ({ subscriptionId, customerId, data }, onSuccess = null) =>
      instance
        .post(`/api/v1/subscriptions/${subscriptionId}/skip`, data, {
          headers: {
            'x-user-id': customerId,
          },
        })
        .then(({ data }) => {
          success(skippedAutoshipSuccess);
          const skipActivity = (activities) =>
            activities.map((activity) => {
              if (activity?.data?.autoship?.id === subscriptionId) {
                activity.data.autoship.nextFulfillmentDate = data.nextFulfillmentDate;
              }
              return activity;
            });
          mutateSubscriptions(skipActivity);
          mutate(skipActivity);
        })
        .then(() => {
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch(() => fail(skippedAutoshipError)),
    [instance, success, fail, mutate, skippedAutoshipSuccess, skippedAutoshipError],
  );

  const resendSubscriptionEmail = useCallback(
    (subscriptionId, customerId, onSuccess = null) => {
      instance
        .post(
          `/api/v1/notification/publish`,
          {
            eventType: 'NOTIFICATION',
            customerId: customerId,
            subscriptionId: subscriptionId,
            notificationType: 'AUTOSHIP_CREATED',
          },
          {
            headers: {
              'x-user-id': customerId,
            },
          },
        )
        .then(() => {
          success(`Email notification sent to customer`);
        })
        .then(() => {
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch(() => {
          fail(`Failed to resend email for Autoship ${subscriptionId}!`);
        });
    },
    [instance, success, fail],
  );

  return {
    updateSubscription,
    useSubscriptionCancelReasons,
    cancelSubscription,
    shipSubscriptionNow,
    skipNextShipment,
    resendSubscriptionEmail,
  };
}
