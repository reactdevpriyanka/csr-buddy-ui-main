import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Box } from '@mui/material';
import toFormattedPhoneNumber from '@/utils/formatters';
import useAthena from '@/hooks/useAthena';
import { getPaymentIcon, getPaymentTypeLabel } from '@/components/PaymentMethod/paymentMethodConst';
import { snakeCaseToTitleCase } from '@/utils/string';

const useStyles = makeStyles((theme) => ({
  paymentText: {
    color: '#666666',
    marginLeft: '6.5rem',
    marginTop: '-70px',
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '1rem',
    marginBottom: '0.75rem',
    color: theme.palette.blue.dark,
  },
  billingtitle: {
    fontFamily: 'Roboto',
    color: '#666666',
    fontSize: '0.85rem',
    marginTop: '1.65rem',
  },
  icon: {
    display: 'inline-block',
    maxWidth: '4.7500rem',
    width: '100%',
    marginTop: '1.825rem',
    marginLeft: '0.625rem',
  },
  gifticon: {
    marginTop: '1.825rem',
    display: 'inline-block',

    marginLeft: '15px',
    '& svg': {
      width: '75px',
      height: '75px',
    },
  },
  billingAddressContent: {
    marginTop: '0.75rem',
  },
  cardNum: {
    marginLeft: '0.1275rem',
    marginRight: '0.625rem',
  },
  servicePaymentText: {
    color: '#666666',
    alignSelf: 'center',
    marginTop: '10px',
  },
  properties: {
    '&.MuiPaper-root': {
      width: '25rem !important',
    },
    display: 'flex',
    maxWidth: '25rem',
    height: '8rem',
    marginBottom: '1rem',
    marginTop: '1rem',
    border: '1px solid #000000',
    padding: `${theme.utils.fromPx(6)} ${theme.utils.fromPx(16)} ${theme.utils.fromPx(
      6,
    )} ${theme.utils.fromPx(10)}`,
  },

  paypalicon: {
    display: 'flex',
    alignSelf: 'center',

    '& svg': {
      width: '75px',
      height: '75px',
    },

    '& #G_Pay_Acceptance_Mark': {
      width: '100px !important',
      height: '100px !important',
      marginLeft: '-10px !important',
    },
  },
  paypalcontent: {
    marginLeft: '15px',
    fontSize: '0.975rem',
    display: 'grid',
    gridTemplateColumns: '100px auto',
  },
}));

const OrderDetailsPaymentProperties = ({ paymentDetail }) => {
  const classes = useStyles();
  const paymentMethod = paymentDetail?.paymentMethod;

  const { getLang } = useAthena(); // athena config

  return (
    <div data-testid="orderDetailsPaymentProperties">
      <span className={classes.title}>
        {getLang('orderPaymentProperties', { fallback: 'Payment Properties' })}
      </span>
      <Card className={classes.properties} elevation={1}>
        {paymentMethod?.type === 'CREDIT_CARD' || paymentMethod?.type === 'GIFT_CARD' ? (
          <div>
            <span className={paymentMethod?.type === 'GIFT_CARD' ? classes.gifticon : classes.icon}>
              {paymentMethod?.type === 'CREDIT_CARD'
                ? getPaymentIcon(_.toUpper(paymentMethod?.creditCard?.cardType))
                : getPaymentIcon(_.toUpper(paymentMethod?.type))}
            </span>
            <div className={classes.paymentText}>
              <span>
                {paymentMethod?.type === 'CREDIT_CARD'
                  ? snakeCaseToTitleCase(paymentMethod?.creditCard?.cardholderName)
                  : 'Gift Card'}
              </span>
              <br />
              <span className={classes.cardNum}>
                {paymentMethod?.type === 'CREDIT_CARD'
                  ? paymentMethod?.creditCard?.cardNumber
                  : paymentMethod?.giftCard?.cardNumber}
              </span>
              {paymentDetail?.paymentState === 'VALID' ? (
                <Box
                  sx={{
                    display: 'inline-block',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    backgroundColor: '#006B2B',
                    marginLeft: '20px',
                    height: '20px',
                    paddingRight: '12px',
                    paddingBottom: '8px',
                    paddingLeft: '12px',
                    width: 'auto',
                  }}
                >
                  {paymentDetail?.paymentState === 'VALID' ? 'Valid' : null}
                </Box>
              ) : null}
              <br />
              {paymentMethod?.type === 'CREDIT_CARD'
                ? paymentMethod?.creditCard?.expireMonth &&
                  paymentMethod?.creditCard?.expireYear && (
                    <span className={classes.cardNum}>
                      {'Expiry'} {paymentMethod?.creditCard?.expireMonth}/
                      {paymentMethod?.creditCard?.expireYear}
                    </span>
                  )
                : null}
            </div>
          </div>
        ) : (
          <div className={classes.paypalcontent}>
            <span className={classes.paypalicon}>
              {getPaymentIcon(_.toUpper(paymentMethod?.service?.type))}
            </span>
            <span className={classes.servicePaymentText}>
              {paymentMethod?.service?.email ||
                getPaymentTypeLabel(_.toUpper(paymentMethod?.service?.type))}
            </span>
          </div>
        )}
      </Card>
      {paymentMethod?.type === 'CREDIT_CARD' ? (
        <div className={classes.billingAddressContent}>
          <div className={classes.billingtitle}>
            {getLang('orderPaymentBillingAddress', { fallback: 'Billing address' })}
          </div>
          <br />
          {paymentMethod?.creditCard?.billingAddress?.addressLine1}
          <br />
          {paymentMethod?.creditCard?.billingAddress?.addressLine2}
          {paymentMethod?.creditCard?.billingAddress?.addressLine2 && <br />}
          {paymentMethod?.creditCard?.billingAddress?.city},
          {paymentMethod?.creditCard?.billingAddress?.state},
          {paymentMethod?.creditCard?.billingAddress?.postcode},
          {paymentMethod?.creditCard?.billingAddress?.country}
          <br />
          {'P: '}
          {toFormattedPhoneNumber(paymentMethod?.creditCard?.billingAddress?.phone)}
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

OrderDetailsPaymentProperties.propTypes = {
  paymentDetail: PropTypes.object,
};

export default OrderDetailsPaymentProperties;
