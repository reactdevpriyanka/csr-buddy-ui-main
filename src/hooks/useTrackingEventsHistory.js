import axios from 'axios';
import useSWR from 'swr';

export default function useTrackingEventsHistory(orderId, packageId) {
  return useSWR(
    orderId && packageId && `/api/v1/orders/${orderId}/tracking/${packageId}`,
    async (url) => axios.get(url).then(({ data }) => data),
    { revalidateOnFocus: false },
  );
}
