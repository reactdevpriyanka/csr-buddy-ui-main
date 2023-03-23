import PropTypes from 'prop-types';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import fact from './shapes/fact';
import TrackerFactHeading from './TrackerFactHeading';

const useStyles = makeStyles((theme) => ({
  root: {},
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  heading: {
    ...theme.fonts.body.bold,
    color: theme.palette.gray.medium,
    display: 'block',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(16),
    marginBottom: theme.utils.fromPx(6),
    textDecoration: 'none',
    '&.orderNumber': {
      color: theme.palette.blue.dark,
      display: 'block',
      marginBottom: theme.utils.fromPx(16),
    },
  },
  group: {
    marginBottom: theme.utils.fromPx(24),
    '&.full': {
      gridColumn: 'span 2',
    },
  },
  value: {
    color: theme.palette.gray.light,
  },
}));

const TrackerFacts = ({ orderNumber, facts = [] }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <span className={cn([classes.heading, 'orderNumber'])}>{`Order #${orderNumber}`}</span>
      <div className={classes.grid} data-testid="tracker-facts:grid">
        {facts.map(
          ({ heading, value, help = null }) =>
            !!value && (
              <div
                key={heading}
                className={cn([classes.group, heading === 'Fulfillment Center' && 'full'])}
              >
                <TrackerFactHeading heading={heading} help={help} />
                <span className={classes.value}>{value}</span>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

TrackerFacts.propTypes = {
  facts: PropTypes.arrayOf(PropTypes.shape(fact)),
  orderNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default TrackerFacts;
