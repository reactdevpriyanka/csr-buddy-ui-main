import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TrackerEvent from './TrackerEvent';
import events from './shapes/event';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 0,
  },
  list: {
    ...theme.utils.nospace,
    ...theme.utils.col,
    listStyle: 'none',
    position: 'relative',
    zIndex: 1,
    '& > li': { zIndex: 2 },
  },
  line: {
    position: 'absolute',
    top: '20px',
    left: '10px',
    borderLeft: `${theme.utils.fromPx(1)} dashed #ddd`,
    width: 0,
    height: 'calc(100% - 70px)',
    zIndex: 0,
  },
  button: {
    ...theme.utils.nospace,
    ...theme.fonts.body.medium,
    color: theme.palette.blue.light,
    border: 0,
    background: 'transparent',
  },
}));

const TrackerEvents = ({ events, as: EventComponent = TrackerEvent }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ul className={classes.list}>
        {[...events].reverse().map(({ title, subtitle }, index) => (
          <EventComponent
            key={`${index}-${title}-${subtitle}`}
            title={title}
            subtitle={subtitle}
            state="COMPLETE"
          />
        ))}
      </ul>
      <div className={classes.line} />
    </div>
  );
};

TrackerEvents.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape(events)),
  as: PropTypes.elementType,
};

export default TrackerEvents;
