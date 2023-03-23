import axios from 'axios';
import useSWR from 'swr';

export default function useEventHistory(orderId) {
  const { data, error } = useSWR(
    orderId ? `/api/v1/event_history?order_id=${orderId}` : null,
    async (url) => axios.get(url).then(({ data }) => data),
  );

  return {
    data,
    error,
  };
}
