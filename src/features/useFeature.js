import axios from 'axios';
import useSWR from 'swr';

/**
 * TODO: Get the correct endpoint for configuration values.
 */

export default function useFeature(feature) {
  const { data: features, error } = useSWR(
    '/gateway/configuration',
    async (url) => await axios.get(url).then(({ data }) => data),
  );

  if (!features || error) {
    return false;
  }

  return !!features[feature];
}
