import axios from 'axios';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useAthena from '@/hooks/useAthena';
import ATHENA_KEYS from '@/constants/athena';
import { ActivityType } from './ActivityType';
import ActivityContext from './ActivityContext';
import ActivityLoadingSkeleton from './ActivityLoadingSkeleton';

const useStyles = makeStyles((theme) => ({
  root: {},
  skeleton: {
    marginBottom: theme.utils.fromPx(24),
  },
}));

export default function Activity({ activityId, activityCategory, children = null }) {
  const classes = useStyles();
  const { getLang } = useAthena();
  const isContext = getLang(ATHENA_KEYS.TRACKING_PACKAGE_CONTEXT_MESSAGING_ENABLED, {
    fallback: false,
  });

  const versionStr =
    isContext && ActivityType[activityCategory] === 'order-activities' ? 'v4' : 'v3';

  const { data: activityData, error } = useSWR(
    activityId &&
      ActivityType[activityCategory] &&
      `/api/${versionStr}/${ActivityType[activityCategory]}/${activityId}`,
    async (url) => axios.get(url).then(({ data }) => data),
    {
      revalidateOnFocus: false, // prefer manual revalidation
    },
  );

  if (error) {
    /** TODO: we should really add a more helpful component here like a 'retry' */
    return <div>{'There was an error'}</div>;
  }

  if (!activityData) {
    return (
      <div className={classes.skeleton}>
        <ActivityLoadingSkeleton />
      </div>
    );
  }

  return <ActivityContext.Provider value={activityData}>{children}</ActivityContext.Provider>;
}

Activity.propTypes = {
  activityId: PropTypes.string.isRequired,
  activityCategory: PropTypes.string.isRequired,
  children: PropTypes.node,
};
