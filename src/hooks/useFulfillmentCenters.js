import { useMemo } from 'react';
import useSWR from 'swr';
import useCSPlatform from './useCSPlatform';

const useFulfillmentCenters = () => {
  const { getFulfillmentCenters } = useCSPlatform();

  const { data, error, ...other } = useSWR(
    '/cs-platform/v1/fcs/fulfillmentCenters?enable=true',
    () => getFulfillmentCenters(),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    },
  );

  // Sort the data and put it in the correct format
  // for use in list so it doesn't have to be done in calling
  // page
  const convertedData = useMemo(() => {
    if (data?.data?.data) {
      return data.data.data
        .map((fc) => {
          return { name: fc.id, value: fc.id };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    return data;
  }, [data]);

  return {
    data: convertedData,
    error,
    ...other,
  };
};

export default useFulfillmentCenters;
