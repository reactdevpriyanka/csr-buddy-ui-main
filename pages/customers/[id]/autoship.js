import axios from 'axios';
import { SWRConfig } from 'swr';
import PropTypes from 'prop-types';
import { ActivityFeedProvider, AutoshipFilterNav, getPrefetchUrl } from '@/activity-feed-v3';
import { ActivityType } from '@/activity-feed-v3/ActivityType';
export default function AutoshipPage({ initialCache = {} }) {
  return (
    <SWRConfig value={{ provider: () => new Map(Object.entries(initialCache)) }}>
      <article data-testid="autoship-page">
        <AutoshipFilterNav />
        <ActivityFeedProvider />
      </article>
    </SWRConfig>
  );
}

AutoshipPage.propTypes = {
  initialCache: PropTypes.object,
};

export async function getServerSideActivities(context, initialCache) {
  const { id: customerId } = context.params;
  const { SESSION, routeKey, agentProfile } = context.req.cookies;
  const host = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : `https://csrb-gateway.csbb.${process.env.CHEWY_ENV}.chewy.com`;

  return axios
    .get(
      `${host}/api/v3/activities/?customerId=${customerId}&subscriptions=true`,
      {
        headers: {
          Cookie: `SESSION=${SESSION}; routeKey=${routeKey}; agentProfile=${encodeURIComponent(agentProfile)}`,
        },
      },
    )
    .then(({ data }) => {
      initialCache[`/api/v3/activities/?customerId=${customerId}&subscriptions=true`] = data;
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

    // please check this filter
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