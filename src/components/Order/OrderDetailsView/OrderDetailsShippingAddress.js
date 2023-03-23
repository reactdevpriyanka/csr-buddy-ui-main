import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';
import { Card } from '@mui/material';
import toFormattedPhoneNumber from '@/utils/formatters';
import { useState } from 'react';
import useAthena from '@/hooks/useAthena';
import ShowShippingAddressDialog from './Dialogs/ShowShippingAddressDialog';
import { AllowableActions } from './utils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& li:first-of-type': {
      whiteSpace: 'nowrap',
      display: 'block',
    },
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'normal',
    fontSize: '0.875rem',
    lineHeight: '1rem',
    color: '#121212',
    marginBottom: '0.3rem',
  },
  content: {
    paddingLeft: theme.utils.fromPx(16),
    paddingRight: theme.utils.fromPx(16),
    paddingBottom: theme.utils.fromPx(16),
  },

  title: {
    fontFamily: 'Roboto',
    marginTop: theme.utils.fromPx(16),
    marginLeft: '0.9375rem',
    fontWeight: '700',
    fontSize: theme.utils.fromPx(16),
    color: theme.palette.blue.dark,
  },
  title2: {
    fontFamily: 'Roboto',
    color: '#666666',
    fontSize: '0.95rem',
    marginBottom: '1rem',
  },
  shippingTitle2: {
    fontFamily: 'Roboto',
    color: '#666666',
    fontSize: theme.utils.fromPx(16),
    display: 'inline-block',
    justifyContent: 'space-between',
  },
  link: {
    float: 'right',
    display: 'inline',
    fontWeight: 600,
    color: '#1C49C2',
    '&:focus, &:hover': {
      cursor: 'pointer',
    },
  },
  hr: {
    flexGrow: '0',
    border: '1px solid #CCCCCC',
  },
  parentCard: {
    borderRadius: '0.25rem',
  },
  shippingAddress: {
    whiteSpace: 'nowrap',
    marginTop: theme.utils.fromPx(16),
  },
}));

const OrderDetailsShippingAddress = ({
  shippingAddress,
  giftCardOnlyEmail,
  orderNumber,
  isActionAllowed,
}) => {
  const classes = useStyles();

  const [openShippingAddressDialog, setOpenShippingAddressDialog] = useState(false);

  const { getLang } = useAthena(); // athena config

  return (
    <div data-testid="orderDetailsShippingAddress" className={classes.root}>
      <Card className={classes.parentCard} elevation={0}>
        <div className={classes.title}> {'Recipient'} </div> <br />
        <div className={classes.content}>
          <div className={classes.title2}>
            {getLang('shippingRecipient', { fallback: 'Recipient' })}
            <div>
              <span data-testid="customer-shippingAddress-name" className={classes.text}>
                {giftCardOnlyEmail ? giftCardOnlyEmail : shippingAddress?.fullName}
              </span>
              <br />
            </div>
          </div>
          <hr className={classes.hr} />
          <div className={classes.shippingAddress}>
            {!giftCardOnlyEmail && shippingAddress ? (
              <>
                <span className={classes.shippingTitle2}>
                  {getLang('shippingAddress', { fallback: 'Shipping Address:' })}
                </span>
                {isActionAllowed({ actionName: AllowableActions.EDIT_SHIPPING_ADDRESS }) ? (
                  <Link
                    data-testid="orderDetailsShippingAddress:update"
                    className={classes.link}
                    onClick={() => {
                      setOpenShippingAddressDialog(true);
                    }}
                  >
                    Update
                  </Link>
                ) : undefined}
                <br />
                {shippingAddress.addressLine1}
                <br />
                {shippingAddress.addressLine2}
                {shippingAddress.addressLine2 && <br />}
                {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.postcode},{' '}
                {shippingAddress.country}
                <br />
                {'P: '}
                {toFormattedPhoneNumber(shippingAddress.phone)}
                <br />
              </>
            ) : (
              <>
                <span className={classes.shippingTitle2}>
                  {getLang('shippingAddress', { fallback: 'Shipping Address:' })}
                </span>
                <br />
                {'N/A'}
              </>
            )}
          </div>
        </div>
      </Card>
      {openShippingAddressDialog && (
        <ShowShippingAddressDialog
          orderNumber={orderNumber}
          isOpen={openShippingAddressDialog}
          openDialog={setOpenShippingAddressDialog}
          shippingAddress={shippingAddress}
        />
      )}
    </div>
  );
};

OrderDetailsShippingAddress.propTypes = {
  shippingAddress: PropTypes.object,
  giftCardOnlyEmail: PropTypes.string,
  orderNumber: PropTypes.string.isRequired,
  isActionAllowed: PropTypes.func,
};

export default OrderDetailsShippingAddress;
