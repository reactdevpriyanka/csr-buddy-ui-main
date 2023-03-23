import { formatToUTC } from '@/utils';
import { cleanParams, sortParams, stringifyKeyValue } from '@/utils/cleanParams';
import { gqlRequest } from '@/utils/gqlRequest';
import { advancedOrderSearchQuery } from '@/utils/graphqlQueries';
import useSWR from 'swr';

const BASE_URL = '/gateway/proxy/orders/graphql';

const useAdvancedSearch = (
  { searchInProgress, page = 0, size = 50, sort = 'DESC', orderId, paymentId, ...searchParams },
  shouldRevalidate = false,
) => {
  const { timePlacedTo = null, timeUpdatedTo = null } = searchParams;

  const paramStr = Object.entries(
    cleanParams({
      ...searchParams,
      timePlacedTo: formatToUTC(timePlacedTo),
      timeUpdatedTo: formatToUTC(timeUpdatedTo),
    }),
  )
    .sort(sortParams)
    .map(([key, value]) => stringifyKeyValue(key, value))
    .join(', ');

  const query = advancedOrderSearchQuery(paramStr, 'DESC', page, size, orderId);
  const cacheKey = [paramStr, page, size, orderId];
  const fetcher = async () => gqlRequest(BASE_URL, query);

  const { data, error } = useSWR(searchInProgress ? cacheKey : null, fetcher, {
    revalidateIfStale: shouldRevalidate,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: true,
  });

  const loading = !data;

  return {
    data,
    error,
    loading,
    cacheKey,
  };
};

export default useAdvancedSearch;
