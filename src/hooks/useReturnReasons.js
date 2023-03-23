import { parseReasons } from '@/utils/returnReasons';
import axios from 'axios';
import useSWR from 'swr';

export default function useReturnReasons({ pickOnly } = {}) {
  const { data } = useSWR(
    '/api/v1/returns/reasons',
    async (url) => axios.get(url).then(({ data }) => parseReasons(data)),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  if (!data) {
    return null;
  }
  if (pickOnly) {
    return { [pickOnly]: data[pickOnly] };
  }
  return data;
}
