import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { gqlRequest } from '@utils/gqlRequest';
import { snakeCaseToTitleCase } from '@utils/string';
import useEnv from '@/hooks/useEnv';
import useAthena from './useAthena';
import useCSRInfo from './useCSRInfo';

const ORDER_PROXY_BASE_URL = `/gateway/proxy/orders/api/v1/orders`;

export default function useOrder(orderId) {
  const router = useRouter();
  const { data: csr } = useCSRInfo();
  const callerId = csr?.userId;
  const { chewyEnv } = useEnv();

  const { id: customerId } = router.query;

  const { enqueueSnackbar } = useSnackbar();

  const { getLang } = useAthena();

  const instance = useMemo(() => axios.create(), []);

  const baseURL =
    process.env.NEXT_PUBLIC_NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : `https://csrb-gateway.csbb.${chewyEnv}.chewy.com`;

  const { data, error, mutate } = useSWR(
    orderId && `/api/v3/order-activities/${orderId}`,
    async (url) => instance.get(url).then(({ data }) => data),
    {
      revalidateOnFocus: false,
    },
  );

  const gqlFetcher = useCallback(
    (endPoint, query, headers) =>
      gqlRequest(baseURL + endPoint, query, headers).then((res) => {
        if (res?.response?.error || res?.response?.errors) {
          return res?.response;
        }
        return res;
      }),
    [baseURL],
  );

  const getOrderCancelReasons = async () => {
    const queryKey = `
      {
        __type(name: "OrderCancelReason") {
          name
          enumValues {
            name
          }
        }
      }
    `;

    const endPoint = `/gateway/proxy/orders/graphql`;

    const headers = callerId;

    let data = await gqlFetcher(endPoint, queryKey, headers);

    // Format response to title case
    const enumValues = data?.__type?.enumValues || [];
    return enumValues.map((val) => ({
      label: snakeCaseToTitleCase(val?.name),
    }));
  };

  const getOrderGraphql = useCallback(
    async (orderId) => {
      const queryKey = `
      query getOrder {
        byOrderId(externalOrderId: "${orderId}") {
          id
          blocks {
            id
            comments
            reason
            resolved
            resolvable
            timeBlocked
            legacyId
          }
          externalOrderId
          lineItems {
            id
            legacyId
            quantity
            status
          }
        }
      }
    `;

      const endPoint = '/gateway/proxy/orders/graphql';

      const headers = callerId;

      let data = await gqlFetcher(endPoint, queryKey, headers);

      return data;
    },
    [gqlFetcher],
  );

  const updateShippingAddress = async (orderId, kyriosId = '') =>
    instance.post(
      `/gateway/proxy/orders/api/v1/orders/${orderId}/edit/shippingaddress`,
      {
        kyriosId,
      },
      {
        headers: {
          'Caller-id': callerId,
        },
      },
    );

  const removeQty = async ({ orderId, itemId, quantity }) =>
    instance.post(
      `/gateway/proxy/orders/api/v1/orders/${orderId}/lineitems/${itemId}/cancel`,
      {
        quantity,
      },
      {
        headers: {
          'Caller-id': callerId,
        },
      },
    );

  const cancelOrder = async (body) => {
    const newComment = `Order was canceled due to: ${body.cancelReason} ${
      !body.comments ? '' : '\n\n' + body.comments
    }`;

    body = {
      ...body,
      comments: newComment,
    };

    return instance.post(`/gateway/proxy/orders/api/v1/orders/${body.orderId}/cancel`, body, {
      headers: {
        'Caller-id': callerId,
      },
    });
  };

  const resolveAutoshipOrder = async (id, body) =>
    instance.post(`${ORDER_PROXY_BASE_URL}/${id}/resolve-block`, body, {
      headers: {
        'Caller-id': callerId,
      },
    });

  const toggleOrderBlocked = async ({ id, status }) => {
    if (!['begin', 'end'].includes(status)) return;
    instance.post(
      `${ORDER_PROXY_BASE_URL}/${id}/edit/${status}`,
      {},
      {
        headers: {
          'Caller-id': callerId,
        },
      },
    );
  };

  const processReturn = async ({ orderId }) =>
    instance.post(
      `${ORDER_PROXY_BASE_URL}/${orderId}/process`,
      {},
      {
        headers: {
          'Caller-id': callerId,
        },
      },
    );

  const processOrderErrorText = useMemo(
    () => getLang('processOrderErrorText', { fallback: 'Process Order Failed!' }),
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
        key: 'order-success',
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
          key: 'order-error',
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

  const processOrder = useCallback(
    ({ orderId }, onSuccess = null) => {
      instance
        .post(
          `${ORDER_PROXY_BASE_URL}/${orderId}/process`,
          {},
          {
            headers: {
              'x-user-id': customerId,
              'Caller-id': '81',
            },
          },
        )
        .then(() => {
          success(`Order ${orderId} processed`);
        })
        .then(() => {
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch(() => fail(processOrderErrorText));
    },
    [instance, success, fail],
  );

  const cancelRelease = (releaseId) =>
    instance
      .post(
        `${ORDER_PROXY_BASE_URL}/${orderId}/releases/${releaseId}/cancel`,
        {
          forceCancel: true,
        },
        {
          headers: {
            'x-user-id': customerId,
            'Caller-id': '81',
          },
        },
      )
      .then(() => success(`Release #${releaseId} has been cancelled`))
      .catch(() => fail(`Error trying to cancel release #${releaseId}`));

  return {
    data,
    processOrder,
    cancelRelease,
    updateShippingAddress,
    cancelOrder,
    removeQty,
    resolveAutoshipOrder,
    toggleOrderBlocked,
    processReturn,
    getOrderCancelReasons,
    getOrderGraphql,
    error,
    mutate,
  };
}
