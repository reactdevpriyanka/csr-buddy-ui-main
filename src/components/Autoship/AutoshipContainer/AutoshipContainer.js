import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ModalSideHeader from '@components/ModalSideHeader/ModalSideHeader';
import useFindChildOrders from '@/hooks/useFindChildOrders';
import AutoshipContainerCard from './AutoshipContainerCard';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.white,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContainer: {
    overflowY: 'auto',
    marginTop: theme.utils.fromPx(24),
  },
  orderCountTxt: {
    fontFamily: 'Roboto',
    lineHeight: theme.utils.fromPx(20),
    fontSize: theme.utils.fromPx(16),
    fontWeight: 400,
    color: '#4D4D4D',
  },
  orderCountContainer: {
    marginLeft: theme.utils.fromPx(10),
    marginBottom: theme.utils.fromPx(20),
  },
  totalCountChip: {
    display: 'inline-block',
    backgroundColor: '#031657',
    borderRadius: theme.utils.fromPx(12),
    minWidth: theme.utils.fromPx(32),
    color: 'white',
    fontSize: theme.utils.fromPx(12),
    textAlign: 'center',
    marginRight: theme.utils.fromPx(10),
  },
}));

const AutoshipContainer = ({ subscriptionId, subscriptionName, customerId, frequency }) => {
  const classes = useStyles();
  const { data: childOrders } = useFindChildOrders(subscriptionId);
  const autoshipOrders = childOrders || [];

  return (
    <div className={classes.root}>
      <ModalSideHeader text={subscriptionName} />
      <div className={classes.scrollContainer}>
        <div className={classes.orderCountContainer}>
          <span
            data-testid={`autoship-container-orders-count-${subscriptionId}`}
            className={classes.totalCountChip}
          >
            {autoshipOrders.length}
          </span>
          <span className={classes.orderCountTxt}>Orders Displayed</span>
        </div>

        {autoshipOrders.map(({ timePlaced, externalOrderId, status, total, lineItems }) => (
          <AutoshipContainerCard
            key={externalOrderId}
            timePlaced={timePlaced}
            orderId={externalOrderId}
            frequency={frequency}
            status={status}
            total={total.value}
            customerId={customerId}
            lineItems={lineItems}
          />
        ))}
      </div>
    </div>
  );
};

AutoshipContainer.propTypes = {
  subscriptionId: PropTypes.string,
  subscriptionName: PropTypes.string,
  customerId: PropTypes.string,
  frequency: PropTypes.string,
};

export default AutoshipContainer;
