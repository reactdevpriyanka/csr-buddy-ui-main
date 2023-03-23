import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useCallback } from 'react';
import { gqlRequest } from '@utils/gqlRequest';
import { snakeCaseToTitleCase } from '@utils/string';
import useEnv from '@/hooks/useEnv';
import useSWR from 'swr';
import useCustomer from '@/hooks/useCustomer';

const instance = axios.create();

const DEFAULT_PAGE_SIZE = 50;

instance.interceptors.request.use(
  (config) => {
    config.headers['x-request-id'] = `CSRB-${uuidv4()}`;
    return config;
  },
  (err) => Promise.reject(err),
);

export const setAuthenticationHeaders = ({ authToken, token }) => {
  instance.defaults.headers.common['Authorization'] = authToken;
  instance.defaults.headers.common['Token'] = token;
};

export default function useCSPlatform() {
  const { chewyEnv } = useEnv();

  const { data: customer } = useCustomer();

  const baseURL = `https://cs-platform.csbb.${chewyEnv}.chewy.com/cs-platform`;
  instance.defaults.baseURL = baseURL;

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

  const resolveOrder = async (orderId, body) => {
    return instance.post(`/v1/order-service/orders/${orderId}/resolveblock`, body);
  };

  const resolveAutoshipOrder = async (id, body) => {
    return instance.post(`/v1/order-service/${id}/resolve-block`, body);
  };

  const getAuthenticationHeaders = () => ({ ...instance.defaults.headers.common });

  const sendEmailNotification = async (body) =>
    instance.post(`/v1/notification-service/publish`, body);

  /* Reduce item quantity, or remove the item if no quantity is passed in */
  const reduceItemQuantity = async ({ orderId, itemId, quantity }) => {
    return instance.post(`/v1/order-service/orders/${orderId}/lineitems/${itemId}/cancel`, {
      quantity,
    });
  };

  const cancelReturn = async ({ returnId }) => {
    return instance.put(`/v1/return-service/returns/${returnId}/cancel`, {});
  };

  const processReturn = async ({ orderId }) => {
    return instance.post(`/v1/order-service/orders/${orderId}/process`, {});
  };

  const toggleOrderBlocked = async ({ id, status }) => {
    if (!['begin', 'end'].includes(status)) return;
    return instance.post(`/v1/order-service/orders/${id}/edit/${status}`, {});
  };

  const cancelOrder = async (body) => {
    const newComment = `Order was canceled due to: ${body.cancelReason} ${
      !body.comments ? '' : '\n\n' + body.comments
    }`;

    body = {
      ...body,
      comments: newComment,
    };

    return instance.post(`/v1/order-service/orders/${body.orderId}/cancel`, body);
  };

  const blockOrder = async (orderId, body) => {
    return instance.post(`/v1/order-service/orders/${orderId}/block`, body);
  };

  const updateShippingAddress = async (orderId, kyriosId = '') =>
    instance.post(`/v1/order-service/orders/${orderId}/edit/shippingaddress`, {
      kyriosId,
    });

  const useSubscriptionStatuses = ({ subscriptionId, customerId }) => {
    const { data, error } = useSWR(
      `/v1/subscription-service/subscriptions/${subscriptionId}/statuses`,
      async (url) =>
        instance
          .get(url, {
            headers: {
              'X-User-Id': customerId,
            },
          })
          .then(({ data }) => data.data),
    );
    return {
      data,
      error,
    };
  };

  const getOrderBlockReasons = useCallback(async () => {
    const queryKey = `
      {
        __type(name: "OrderBlockReason") {
          name
          enumValues {
            name
          }
        }
      }
    `;

    const endPoint = '/v1/order-service/graphql';

    const headers = getAuthenticationHeaders();

    let data = await gqlFetcher(endPoint, queryKey, headers);

    // Format response to title case
    const enumValues = data?.__type?.enumValues || [];
    return enumValues.map((val) => ({
      label: snakeCaseToTitleCase(val?.name),
    }));
  }, [gqlFetcher]);

  const getOrderCancelReasons = useCallback(async () => {
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

    const endPoint = '/v1/order-service/graphql';

    const headers = getAuthenticationHeaders();

    let data = await gqlFetcher(endPoint, queryKey, headers);

    // Format response to title case
    const enumValues = data?.__type?.enumValues || [];
    return enumValues.map((val) => ({
      label: snakeCaseToTitleCase(val?.name),
    }));
  }, [gqlFetcher]);

  const resetPassword = useCallback(
    () => instance.post('/v1/users/reset', { logonId: customer.email }),
    [customer],
  );

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

      const endPoint = '/v1/order-service/graphql';

      const headers = getAuthenticationHeaders();

      let data = await gqlFetcher(endPoint, queryKey, headers);

      return data;
    },
    [gqlFetcher],
  );

  const getSuzzieUrl = (path = '/') => `https://cs-platform.csbb.${chewyEnv}.chewy.com${path}`;

  const useReturnLabels = (returnId) => {
    const { data, errors } = useSWR(`/v1/return-service/returns/${returnId}/labels`, async (url) =>
      instance.get(url).then(({ data }) => data),
    );
    return {
      data,
      errors,
    };
  };

  const createNewReturnLabels = (returnId, body) => {
    return instance.post(`/v1/return-service/returns/${returnId}/labels`, body);
  };

  const resendReturnLabels = (returnId) => {
    return instance.post(`/v1/returns/${returnId}/labels/resend`);
  };

  const markAllItemsAsReceived = (returnId) => {
    return instance.put(`/v1/return-service/returns/${returnId}/received`);
  };

  const cancelRelease = (orderId, releaseId) => {
    return instance.post(`/v1/order-service/orders/${orderId}/releases/${releaseId}/cancel`, {
      forceCancel: false,
    });
  };

  const advancedOrderSearch = useCallback(
    async ({ page = 0, size = DEFAULT_PAGE_SIZE, sort = 'DESC', orderId, paymentId, query }) => {
      const endPoint = '/v1/order-service/graphql';

      const headers = getAuthenticationHeaders();

      let data = await gqlFetcher(endPoint, query, headers);

      return data;
    },
    [gqlFetcher],
  );

  const getFulfillmentCenters = () => {
    return instance.get(`/v1/fcs/fulfillmentCenters?enable=true`);
  };

  return {
    setAuthenticationHeaders,
    getAuthenticationHeaders,
    sendEmailNotification,
    getOrderBlockReasons,
    reduceItemQuantity,
    toggleOrderBlocked,
    cancelOrder,
    updateShippingAddress,
    getOrderCancelReasons,
    getSuzzieUrl,
    useSubscriptionStatuses,
    resetPassword,
    cancelReturn,
    useReturnLabels,
    createNewReturnLabels,
    resendReturnLabels,
    markAllItemsAsReceived,
    cancelRelease,
    processReturn,
    getOrderGraphql,
    resolveOrder,
    blockOrder,
    advancedOrderSearch,
    getFulfillmentCenters,
    resolveAutoshipOrder,
  };
}
