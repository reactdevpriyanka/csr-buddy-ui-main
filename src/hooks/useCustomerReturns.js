import axios from 'axios';
import useSWR from 'swr';
import useSanitizedRouter from './useSanitizedRouter';

export const useCustomerReturns = () => {
  const { id: customerId } = useSanitizedRouter();

  const { data, error } = useSWR(
    customerId ? `/api/v1/customer/${customerId}/returns` : null,
    async (url) => axios.get(url).then(({ data }) => data),
  );

  return {
    data,
    error,
  };
};
