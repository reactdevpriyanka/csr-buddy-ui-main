import axios from 'axios';
import useSWR from 'swr';
import useFeature from '@/features/useFeature';

export const useTokens = () => {
  const featureFlag = useFeature('feature.enableEnactRefreshTokenCall');

  const { data, error } = useSWR(
    featureFlag ? `/gateway/configuration/tokens` : null,
    async (url) => axios.put(url).then(({ data }) => data),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      refreshInterval: 900000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (error.response) {
          setTimeout(() => revalidate(), 900000);
        }
      },
    },
  );

  return {
    data,
    error,
  };
};
