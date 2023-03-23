import { useCallback, useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import useSanitizedRouter from '@/hooks/useSanitizedRouter';
import { ActivityType } from './ActivityType';
import mapActivitiesByDate from './mapActivitiesByDate';

const ACTIVITY_FEED_TYPES = new Set(['ORDER', 'AUTOSHIP']);

export const matchesFilter = (activity, selectedFilter) => {
  switch (selectedFilter) {
    case 'Autoships':
      return activity?.orderAttributes?.includes('AUTOSHIP');
    case 'Returns':
      return activity?.returnItems?.length > 0;
    case 'Cancellations':
    case 'Cancelled':
      return activity?.status === 'CANCELLED' || activity?.status === 'CANCELED';
    case 'Prescription Items':
      return activity?.orderAttributes?.includes('PRESCRIPTION');
    case 'Active':
      return activity?.status === 'ACTIVE';
    default:
      return true;
  }
};

export default function useActivityFeed() {
  const router = useRouter();

  const { cache } = useSWRConfig();

  const { id: customerId, byAttribute, byAutoshipAttribute } = useSanitizedRouter();

  const isSubscriptions = router.pathname.endsWith('/autoship') ? true : false;

  const { data, ...rest } = useSWR(
    customerId && `/api/v3/activities/?customerId=${customerId}&subscriptions=${isSubscriptions}`,
    async (url) => axios.get(url).then(({ data }) => data),
  );

  const feedData = useMemo(() => {
    if (!data) {
      return [];
    }

    // client-side filtering via the byAttribute and byAutoshipAttribute querystring param

    const filterAttribute = router.pathname.endsWith('/autoship')
      ? byAutoshipAttribute
      : byAttribute;

    return data.filter((activity) => {
      return (
        ACTIVITY_FEED_TYPES.has(activity.activityCategory) &&
        matchesFilter(
          cache.get(`/api/v3/${ActivityType[activity.activityCategory]}/${activity.activityId}`),
          filterAttribute,
        )
      );
    });
  }, [byAttribute, data, router, byAutoshipAttribute]);

  const getAll = useCallback(() => mapActivitiesByDate(feedData), [feedData]);

  return {
    ...rest,
    data,
    getAll,
  };
}
