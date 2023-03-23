import ActivityFeed from './ActivityFeed';
import useActivityFeed from './useActivityFeed';

export default function ActivityFeedProvider() {
  const { getAll } = useActivityFeed();

  const activities = getAll();

  return <ActivityFeed feed={activities} />;
}

ActivityFeedProvider.propTypes = {};
