import PropTypes from 'prop-types';
import { removeSessionStorageKey } from '@/utils/sessionStorage';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import * as blueTriangle from '@utils/blueTriangle';
import useAthena from '@/hooks/useAthena';
import Activity from './Activity';
import RelayedActivity from './RelayedActivity';
export default function ActivityFeed({ feed }) {
  const { getLang } = useAthena();

  useEffect(() => {
    /* Ensure all previously debounced storage updates are
    wiped if user just came from the summary page on a GWF */
    setTimeout(() => {
      removeSessionStorageKey('gwf:history');
    }, 1000);
  }, []);

  const [componentInitialized, setComponentInitialized] = useState(false);

  const router = useRouter();
  const isAutoship = router.pathname.endsWith('/autoship');
  const pageName = isAutoship ? 'Autoship Tab - VT' : 'Activity Feed Tab';
  const { query = {} } = router;
  const emptyAutoship = `Customer has no ${
    query.byAutoshipAttribute && query.byAutoshipAttribute !== 'All'
      ? query.byAutoshipAttribute.toLocaleLowerCase()
      : ''
  } Autoships`;

  useEffect(() => {
    // do component load work
    setComponentInitialized(true);
    blueTriangle.start(pageName);
  }, []);

  useEffect(() => {
    if (componentInitialized) {
      // do component unload
      blueTriangle.end(pageName);
    }
  }, [componentInitialized]);

  if ((feed || []).length === 0) {
    return (
      <div>
        <Typography color="red">
          {isAutoship
            ? emptyAutoship
            : getLang('noOrdersText', { fallback: 'Customer has no orders since May 2021.' })}
        </Typography>
      </div>
    );
  }

  return (
    <div>
      {feed.map(({ date, activities }) => (
        <div key={date}>
          <h1>{date}</h1>
          {activities.map((activity) => (
            <Activity
              key={activity.activityId}
              activityId={activity.activityId}
              activityCategory={activity.activityCategory}
            >
              <RelayedActivity activityCategory={activity.activityCategory} />
            </Activity>
          ))}
        </div>
      ))}
    </div>
  );
}

ActivityFeed.propTypes = {
  feed: PropTypes.array,
};
