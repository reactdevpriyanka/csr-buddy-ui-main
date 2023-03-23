import { convertOrderStatus, statusColors } from '@/constants/OrderStatus';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  icon: {
    borderRadius: '50%',
    minHeight: theme.utils.fromPx(8),
    minWidth: theme.utils.fromPx(8),
    marginRight: theme.utils.fromPx(8),
  },
}));

const OrderStatusCell = ({ status }) => {
  const classes = useStyles();
  return (
    <span className={classes.root}>
      <span className={classes.icon} style={{ backgroundColor: statusColors?.[status] }}>
        {' '}
      </span>
      <span>{convertOrderStatus(status)}</span>
    </span>
  );
};

OrderStatusCell.propTypes = {
  status: PropTypes.string,
};

export default OrderStatusCell;
