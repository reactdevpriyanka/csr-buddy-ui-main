import axios from 'axios';
import useSWR from 'swr';
import useSanitizedRouter from './useSanitizedRouter';

export default function useOrderDetails() {
  const { id } = useSanitizedRouter();
  return useSWR(
    id && `/api/v1/orderdetails?customerId=${id}`,
    async (url) => axios.get(url).then(({ data }) => data),
    { revalidateOnFocus: false },
  );
}
