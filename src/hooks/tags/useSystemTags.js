import { useMemo } from 'react';
import _ from 'lodash';
import axios from 'axios';
import useSWR from 'swr';
import useAthena from '@/hooks/useAthena';

export default function useSystemTags() {
  const { lang } = useAthena();

  const { data = {}, ...rest } = useSWR(
    '/api/v1/tags',
    async (url) => axios.get(url).then(({ data }) => _.keyBy(data, 'name')),
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    },
  );

  const tags = useMemo(() => {
    const memoizedTags = {};

    if (lang && lang['feature.explorer.whitelistedTags']) {
      for (const tag of lang['feature.explorer.whitelistedTags']) {
        if (tag in data) {
          memoizedTags[tag] = data[tag];
        }
      }
    }

    return memoizedTags;
  }, [data, lang]);

  return { data: tags, ...rest };
}
