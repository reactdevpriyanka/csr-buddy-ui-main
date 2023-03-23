import PropTypes from 'prop-types';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f5f5f5',
    padding: theme.utils.fromPx(15),
    '&.bordered': {
      border: `1px solid #d5d5d5`,
      borderLeft: 0,
      borderRight: 0,
    },
    '&.rounded': {
      borderBottom: `1px solid #d5d5d5`,
    },
  },
  heading: {
    ...theme.fonts.h3,
    color: theme.palette.blue.dark,
  },
  statusText: {
    ...theme.fonts.body.medium,
    fontSize: theme.fonts.size.xs,
  },
  items: {
    padding: theme.utils.fromPx(16),
  },
}));

// TODO: Address technical debt with respect to labeling these states
const Steps = {
  PENDING: { text: 'Pending', value: 0 },
  ORDER_PLACED: { text: 'Order Placed', value: 0 },
  PACKING_ITEMS: { text: 'Packing Items', value: 1 },
  IN_TRANSIT: { text: 'In Transit', value: 2 },
  OUT_FOR_DELIVERY: { text: 'Out for Delivery', value: 3 },
  DELIVERED: { text: 'Delivered', value: 4 },
  UNKNOWN: { text: 'Unknown' },
};

const Shipment = ({ headingText, state = 'UNKNOWN', variant = 'bordered', children }) => {
  const classes = useStyles();

  const { text: statusText } = Steps[state];

  return (
    <div className={classes.root}>
      <div className={cn([classes.header, variant])}>
        <span className={classes.heading}>{headingText}</span>
        <span className={classes.statusText}>{statusText}</span>
      </div>
      <div className={classes.items}>{children}</div>
    </div>
  );
};

Shipment.propTypes = {
  headingText: PropTypes.node,
  state: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.oneOf(['bordered', 'rounded']),
};

export default Shipment;
