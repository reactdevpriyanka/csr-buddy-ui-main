import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import useAthena from '@/hooks/useAthena';
import OrderDetailsPayment from './OrderDetailsPayment';
import OrderDetailsShippingAddress from './OrderDetailsShippingAddress';
import OrderDetailsOrderTotal from './OrderDetailsOrderTotal';
import OrderDetailsViewActionButtons from './OrderDetailsViewActionButtons';

const useStyles = makeStyles((theme) => ({
  root: {
    '& li:first-of-type': {
      whiteSpace: 'nowrap',
    },
  },
  rowDiv: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    columnGap: theme.utils.fromPx(16),
  },
  heading: {
    ...theme.fonts.h2,
    color: theme.palette.blue.dark,
    fontSize: theme.utils.fromPx(20),
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
  },
  titleRow: {
    display: 'flex',
    padding: '4.5px 0px 24px 16px',
  },
  actionButtons: {
    marginLeft: 'auto',
  },
}));

const OrderDetailsViewPayment = ({
  orderNumber,
  shippingAddress,
  giftCardOnlyEmail,
  isActionAllowed,
}) => {
  const classes = useStyles();

  const { getLang } = useAthena(); // athena config

  return (
    <div data-testid="orderDetailsViewPaymentContainer" className={classes.root}>
      <div className={classes.titleRow}>
        <Typography className={classes.heading} variant="h2">
          {getLang('orderViewPaymentLabel', { fallback: 'Payment' })}
        </Typography>
        <span className={classes.actionButtons}>
          <OrderDetailsViewActionButtons
            orderNumber={orderNumber}
            isActionAllowed={isActionAllowed}
          />
        </span>
      </div>
      <div className={classes.rowDiv}>
        <OrderDetailsPayment orderNumber={orderNumber} />
        <OrderDetailsShippingAddress
          orderNumber={orderNumber}
          shippingAddress={shippingAddress}
          giftCardOnlyEmail={giftCardOnlyEmail}
          isActionAllowed={isActionAllowed}
        />
        <OrderDetailsOrderTotal />
      </div>
    </div>
  );
};

OrderDetailsViewPayment.propTypes = {
  orderNumber: PropTypes.string,
  shippingAddress: PropTypes.object,
  giftCardOnlyEmail: PropTypes.string,
  isActionAllowed: PropTypes.func,
};

export default OrderDetailsViewPayment;
