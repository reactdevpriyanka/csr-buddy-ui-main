import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then(({ data }) => data);

export default function useOrderBlockReasons() {
  return useSWR(`/api/v1/order-block/reasons`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryInterval: 0,
    errorRetryCount: 3,
    shouldRetryOnError: true,
  });
}
