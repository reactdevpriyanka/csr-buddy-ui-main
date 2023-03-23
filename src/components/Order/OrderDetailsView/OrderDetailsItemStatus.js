import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { formatDateYYYYMMDDTimeIgnoreTime } from '@/utils';

const useStyles = makeStyles((theme) => ({
  itemStatus: {
    display: 'grid',
    whiteSpace: 'nowrap',
  },
  text: {
    paddingBottom: `${theme.utils.fromPx(33)}`,
  },
}));

const OrderDetailsItemStatus = ({ row }) => {
  const classes = useStyles();

  return row?.status === 'SHIPPED' ? (
    <div className={classes.itemStatus}>
      {' '}
      <span>{row?.fulfillmentStatus}</span> {formatDateYYYYMMDDTimeIgnoreTime(row?.timeShipped)}
    </div>
  ) : row?.status === 'DEPOSITED' ? (
    <div className={classes.itemStatus}>
      {' '}
      <span>{row?.fulfillmentStatus}</span> {formatDateYYYYMMDDTimeIgnoreTime(row?.timeShipped)}
    </div>
  ) : row?.status === 'RELEASED' ? (
    <div className={classes.itemStatus}>
      {' '}
      <span>{row?.fulfillmentStatus}</span>{' '}
      {formatDateYYYYMMDDTimeIgnoreTime(row?.timeReleased || row?.timeCreated)}
    </div>
  ) : row?.fulfillmentStatus === (null || undefined) ||
    row?.inventoryStatus === (null || undefined) ? (
    <div className={classes.itemStatus}>
      <span className={classes.text}>{` `}</span>
    </div>
  ) : (
    <div className={classes.itemStatus}>
      <span>{row?.inventoryStatus}</span> {formatDateYYYYMMDDTimeIgnoreTime(row?.timeCreated)}
    </div>
  );
};

OrderDetailsItemStatus.propTypes = {
  row: PropTypes.object,
};

export default OrderDetailsItemStatus;
