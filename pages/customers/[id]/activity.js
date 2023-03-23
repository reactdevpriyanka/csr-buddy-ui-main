import axios from 'axios';
import { SWRConfig } from 'swr';
import { sub } from 'date-fns';
import PropTypes from 'prop-types';
import InteractionSummary from '@/components/InteractionSummary';
import { ActivityFeedProvider, ActivityFilterNav, getPrefetchUrl } from '@/activity-feed-v3';
import { ActivityType } from '@/activity-feed-v3/ActivityType';

export default function ActivityPage({ initialCache = {} }) {
  return (
    <SWRConfig value={{ provider: () => new Map(Object.entries(initialCache)) }}>
      <article data-testid="activity-feed-page">
        <ActivityFilterNav />
        <InteractionSummary />
        <ActivityFeedProvider />
      </article>
    </SWRConfig>
  );
}

ActivityPage.propTypes = {
  initialCache: PropTypes.object,
};

export async function getServerSideActivities(context, initialCache) {
  /**
   * Fetch the last 15 days of activities to prefetch and prioritize
   * above the fold content.
   */
  const endDate = new Date();
  const startDate = sub(new Date(), { days: 15 });
  const { id: customerId } = context.params;
  /**
   * Server-side fetching of the activity feed requires all of the cookies
   * from the current context to be sent to the Gateway in order to get
   * an actual success response i/o a weird whitelabel error page.
   */
  const { SESSION, routeKey, agentProfile } = context.req.cookies;
  /**
   * TODO: figure out a better way to handle this case
   */
  const host = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : `https://csrb-gateway.csbb.${process.env.CHEWY_ENV}.chewy.com`;

  return axios
    .get(
      `${host}/api/v3/activities/?customerId=${customerId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      {
        headers: {
          Cookie: `SESSION=${SESSION}; routeKey=${routeKey}; agentProfile=${encodeURIComponent(agentProfile)}`,
        },
      },
    )
    .then(({ data }) => {
      // Set the 15 days of data we just fetched in the cache, the client
      // will load the rest of the activity feed once it is initially rendered
      initialCache[`/api/v3/activities/?customerId=${customerId}&subscriptions=false`] = data;
      return data;
    });
}

export async function getSingleServerSideActivity(context, activity) {
  const host = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : `https://csrb-gateway.csbb.${process.env.CHEWY_ENV}.chewy.com`;

  const path = getPrefetchUrl(activity);

  const { SESSION, agentProfile, routeKey } = context.req.cookies;

  const activityData = await axios
    .get(`${host}${path}`, {
      headers: {
        Cookie: `SESSION=${SESSION}; routeKey=${routeKey}; agentProfile=${encodeURIComponent(agentProfile)}`,
      },
    })
    .then(({ data }) => data)
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
    });

  return [path, activityData];
}

export async function getServerSideProps(context) {
  const initialCache = {};
  
  try {
    // Pre-fetch the activity list in order to speed up rendering.
    const activities = await getServerSideActivities(context, initialCache);

    const filteredActivities = activities.filter((activity) =>
      ActivityType.hasOwnProperty(activity.activityCategory),
    );

    const results = await Promise.all(
      filteredActivities.map((activity) => getSingleServerSideActivity(context, activity)),
    );

    if (results) {
      for (const result of results) {
        const [path, activityData] = result;
        if (activityData) {
          initialCache[path] = activityData;
        }
      }
    }
  }
  catch {
    throw new Error('Server Error')
  }

  return {
    props: {
      initialCache,
    },
  };
}
