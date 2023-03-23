import axios from 'axios';
import useSWR from 'swr';
import useCSRInfo from './useCSRInfo';
import useSanitizedRouter from './useSanitizedRouter';

export default function useReturnDetails() {
  const { returnId } = useSanitizedRouter();
  const { data: csr } = useCSRInfo();
  const callerId = csr?.userId;

  const { data, error, mutate } = useSWR(
    returnId ? `/api/v1/returns/${returnId}` : null,
    async (url) => axios.get(url).then(({ data }) => data),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
    },
  );

  const createNewReturnLabels = (returnId, body) => {
    return axios.post(`/gateway/proxy/returns/api/v1/returns/${returnId}/labels`, body, {
      headers: {
        'Caller-Id': callerId,
      },
    });
  };

  const markAllItemsAsReceived = (returnId) => {
    return axios.put(
      `/gateway/proxy/returns/api/v1/returns/${returnId}/received`,
      {},
      {
        headers: {
          'Caller-Id': callerId,
        },
      },
    );
  };

  const resendReturnLabels = (returnId) => {
    return axios.post(`/gateway/proxy/returns/api/v1/returns/${returnId}/labels/resend`, {});
  };

  const useReturnLabels = (returnId) => {
    const { data, errors } = useSWR(
      `/gateway/proxy/returns/api/v1/returns/${returnId}/labels`,
      async (url) => axios.get(url).then(({ data }) => data),
    );
    return {
      data,
      errors,
    };
  };

  return {
    data,
    error,
    mutate,
    createNewReturnLabels,
    markAllItemsAsReceived,
    resendReturnLabels,
    useReturnLabels,
  };
}
