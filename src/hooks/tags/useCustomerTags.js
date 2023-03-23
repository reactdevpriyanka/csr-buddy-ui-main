import { useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import isEmpty from 'lodash/isEmpty';
import useSystemTags from './useSystemTags';

export default function useCustomerTags() {
  const router = useRouter();
  const { id } = router.query;

  const { data: systemTags, error: systemTagsError } = useSystemTags();

  const { data = [], error: customerTagsError, ...rest } = useSWR(
    () => id && !systemTagsError && `/api/v1/customer/${id}/tags?appliedTagsOnly=true`,
    async (url) => axios.get(url).then(({ data, ...res }) => data),
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (error.response.status !== 401 && isEmpty(systemTags) && retryCount === 1) {
          /**
           * Revalidate if this fails with a non-401 status while
           * we're still waiting for system tags. Only try this once.
           */
          setTimeout(() => revalidate({ retryCount }), 3000);
        } else {
          /**
           * Hard refresh to force re-auth if this fails with 401 after
           * system tags have arrived, or if we've already retried once.
           */
          window.location.reload(true);
        }
      },
    },
  );

  const tags = useMemo(() => {
    return data
      .filter((tag) => tag.name in systemTags)
      .map((cstTag) => ({ ...systemTags[cstTag.name], ...cstTag }));
  }, [data, systemTags]);

  return { ...rest, error: customerTagsError, data: tags, availableTags: systemTags };
}
