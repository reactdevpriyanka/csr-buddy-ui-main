import axios from 'axios';
import useSWR from 'swr';
import useSanitizedRouter from './useSanitizedRouter';

export default function useParentSubscriptions(providedCustomerId = null) {
  const { id } = useSanitizedRouter();

  let customerId = providedCustomerId;

  if (!providedCustomerId) {
    customerId = id;
  }

  const { data, ...rest } = useSWR(
    customerId // conditionally fetch the subscription if customerId is provided
      ? `/api/v2/activities/autoship?customerId=${customerId}`
      : null,
    async (url) => await axios.get(url).then(({ data }) => data),
    {
      refreshInterval: 0,
      revalidateOnFocus: true,
    },
  );

  return { data, ...rest };
}
