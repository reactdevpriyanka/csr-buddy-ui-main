import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import ActivityLoadingSkeleton from './ActivityLoadingSkeleton';

const LoadingSkeleton = () => <ActivityLoadingSkeleton />;

const OrderActivity = dynamic(
  () =>
    import(
      /* webpackChunkName: "order-activity" */
      '@/activity-feed-v3/OrderActivity'
    ),
  { loading: LoadingSkeleton },
);

const AutoshipActivity = dynamic(
  () =>
    import(
      /* webpackChunkName: "autoship-activity" */
      '@/activity-feed-v3/AutoshipActivity'
    ),
  { loading: LoadingSkeleton },
);

export default function RelayedActivity({ activityCategory }) {
  switch (activityCategory) {
    case 'AUTOSHIP':
      return <AutoshipActivity />;
    case 'ORDER':
      return <OrderActivity />;
    default:
      return null;
  }
}

RelayedActivity.propTypes = {
  activityCategory: PropTypes.string,
};
