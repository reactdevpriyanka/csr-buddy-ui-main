import axios from 'axios';
import useSWR from 'swr';
import useSanitizedRouter from '@/hooks/useSanitizedRouter';

export default function useActivityFeed() {
  const { id: customerId } = useSanitizedRouter();

  const swr = useSWR(customerId && `/api/v1/activities?customerId=${customerId}`, async (url) =>
    axios.get(url).then(({ data }) => data),
  );

  return swr;
}
