import axios from 'axios';
import useSWR from 'swr';
import useSanitizedRouter from './useSanitizedRouter';

const fetcher = async (url) => axios.get(url).then(({ data }) => data);

export default function useInteractionSummary() {
  const { id } = useSanitizedRouter();

  return useSWR(id ? `/api/v1/interactions/latest?customerId=${id}` : null, fetcher, {
    // Any interaction that has just been captured has an indeterminate creation
    // time, so it doesn't immediately get returned from this endpoint. Since
    // interactions can be captured from so many places, poll for interactions.
    refreshInterval: 15 * 1000,
    revalidateOnFocus: false,
  });
}
