import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    width: theme.utils.fromPx(275),
  },
  orderInfo: {
    color: theme.palette.white,
    fontSize: theme.utils.fromPx(12),
    fontWeight: 400,
    lineHeight: theme.utils.fromPx(14),
    marginBottom: theme.utils.fromPx(10),
  },
  frequencyInfo: {
    color: theme.palette.white,
    fontSize: theme.utils.fromPx(12),
    fontWeight: 500,
    lineHeight: theme.utils.fromPx(16),
    marginBottom: theme.utils.fromPx(5),
  },
  label: {
    color: theme.palette.white,
    fontSize: theme.utils.fromPx(12),
    fontWeight: 400,
    lineHeight: theme.utils.fromPx(18),
  },
  value: {
    color: theme.palette.white,
    fontSize: theme.utils.fromPx(14),
    fontWeight: 500,
    lineHeight: theme.utils.fromPx(19),
    letter: '0.25px',
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  orderPanel: {
    width: '100%',
    textAlign: 'left',
  },
  statusPanel: {
    textAlign: 'right',
  },
}));

const PopoverOrderItem = ({
  orderId = 'N/A',
  orderTotal = 'N/A',
  frequency = 'N/A',
  status = 'N/A',
}) => {
  const classes = useStyles();
  const { getLang } = useAthena(); // athena config
  return (
    <div className={classes.root}>
      <div className={classes.orderInfo}>
        {getLang('orderId', { fallback: 'Order #' })}
        {orderId}
      </div>
      <div className={classes.frequencyInfo}>
        {getLang('frequencyText', { fallback: 'Frequency:' })} {frequency}
      </div>
      <div className={classes.subContainer}>
        <div className={classes.orderPanel}>
          <div className={classes.label}>
            {getLang('orderSummaryOrderTotal', { fallback: 'Order Total' })}
          </div>
          <div className={classes.value}>{`$${orderTotal}`}</div>
        </div>

        <div className={classes.statusPanel}>
          <div className={classes.label}>{getLang('orderStatus', { fallback: 'Status' })}</div>
          <div className={classes.value}>{status}</div>
        </div>
      </div>
    </div>
  );
};

PopoverOrderItem.propTypes = {
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  orderTotal: PropTypes.string,
  frequency: PropTypes.string,
  status: PropTypes.string,
};

export default PopoverOrderItem;
