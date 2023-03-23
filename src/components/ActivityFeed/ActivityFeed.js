/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import ErrorBoundary from '@components/ErrorBoundaries';
import { makeStyles } from '@material-ui/core/styles';
import DateFeed from '@models/DateFeed';
import { Typography } from '@mui/material';
import Activity from './Activity';

// @TODO @THEME : there are some gray tones below that may be usable elsewhere; if so,
// add them to the global MUI theme.
const useStyles = makeStyles((theme) => ({
  root: {
    padding: `0 ${theme.utils.fromPx(24)} ${theme.utils.fromPx(24)} ${theme.utils.fromPx(24)}`,
  },
  list: {
    listStyle: 'none',
    margin: '0',
    padding: '0',
  },
  feedItem: {
    marginTop: '1.5rem',
  },
  feedDate: {
    color: '#555',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(24),
    lineHeight: theme.utils.fromPx(24),
    letterSpacing: theme.utils.fromPx(0.15),
    margin: `${theme.utils.fromPx(24)} 0`,
  },
  summaryContainer: {
    marginTop: '0',
    marginBottom: '1rem',
  },
  summary: {
    display: 'block',
    fontWeight: 'bold',
  },
  summaryDate: {
    display: 'block',
    color: '#555',
  },
  activityFeedContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    paddingTop: '12px',
    margin: `0 ${theme.utils.fromPx(-24)}`,
    backgroundColor: '#FFFFFF',
  },
  spinner: {
    padding: theme.utils.fromPx(24),
    textAlign: 'center',
  },
  complete: {
    textAlign: 'center',
    fontSize: theme.utils.fromPx(24),
  },
  tabs: {
    flexGrow: 1,
    justifySelf: 'self-start',
    '& > *': {
      margin: `${theme.utils.fromPx(12)} ${theme.utils.fromPx(16)} ${theme.utils.fromPx(
        0,
      )} ${theme.utils.fromPx(16)} !important`,
    },
  },
  navContainer: {
    '& div:first-of-type': {
      paddingLeft: '0px !important',
    },
  },
}));

const ActivityFeed = ({ activities }) => {
  const classes = useStyles();

  if (activities?.length === 0) {
    return (
      <div>
        <Typography color="red">Customer has no orders since May 2021.</Typography>
      </div>
    );
  }

  const feed = new DateFeed(activities).activities();

  return (
    <div className={classes.root}>
      <ul data-testid="activity-feed" className={classes.list}>
        {feed.map(({ date, activities }) =>
          activities?.length === 0 ? null : (
            <li
              key={date}
              className={classes.feedItem}
              data-testid={`activity-feed-item-${date.split(' ').join('-')}`}
            >
              <h2 className={classes.feedDate}>{date}</h2>
              {activities.map(({ type, createdAt, data }) => (
                <ErrorBoundary key={`${type}-${createdAt}`}>
                  <Activity type={type} data={data} />
                </ErrorBoundary>
              ))}
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

ActivityFeed.propTypes = {
  activities: PropTypes.array,
};

export default ActivityFeed;
