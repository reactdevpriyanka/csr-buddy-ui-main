import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';
import { Card, Box, Grid } from '@mui/material';
import toFormattedPhoneNumber from '@/utils/formatters';
import usePayment from '@/hooks/usePayment';
import Progress from '@material-ui/core/CircularProgress';
import { useState } from 'react';
import { currencyFormatter, snakeCaseToTitleCase } from '@/utils/string';
import useAthena from '@/hooks/useAthena';
import { getPaymentIcon, getPaymentTypeLabel } from '@/components/PaymentMethod/paymentMethodConst';
import OrderDetailsPaymentDetailsDialog from './OrderDetailsPaymentDetailsDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    '& li:first-of-type': {
      whiteSpace: 'nowrap',
      display: 'block',
      fontFamily: 'Roboto',
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: '2.875rem',
      overFlowX: 'auto',
    },
  },
  parentCard: {
    marginBottom: theme.utils.fromPx(12),
  },
  childCard: {
    display: 'flex',
    marginBottom: '1rem',
    marginTop: '1rem',
    border: '1px solid #000000',
    padding: `${theme.utils.fromPx(6)} ${theme.utils.fromPx(16)} ${theme.utils.fromPx(
      6,
    )} ${theme.utils.fromPx(10)}`,
  },
  paymentText: {
    color: '#666666',
    fontSize: theme.utils.fromPx(14),
  },
  paymentContainer: {
    '& li:first-of-type': {
      whiteSpace: 'nowrap',
      display: 'block',
    },
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: theme.utils.fromPx(16),
    color: theme.palette.blue.dark,
    display: 'inline',
  },
  billingtitle: {
    fontFamily: 'Roboto',
    color: '#666666',
    marginTop: '0.75rem',
  },

  paymentdetailLink: {
    float: 'right',
    display: 'inline',
    fontWeight: 600,
    color: '#1C49C2',
    '&:focus, &:hover': {
      cursor: 'pointer',
    },
  },
  icon: {
    width: theme.utils.fromPx(60),
    height: theme.utils.fromPx(60),
    marginRight: theme.utils.fromPx(8),
  },
  paypalicon: {
    paddingTop: '5px',
    marginRight: '5px',

    '& svg': {
      width: '50px',
      height: '50px',
    },

    '& #G_Pay_Acceptance_Mark': {
      width: '75px !important',
      height: '75px !important',
      marginLeft: '-10px !important',
    },
  },
  gifticon: {
    display: 'inline-block',
    transform: 'scale(1.7)',
    padding: '23px 24px 18px 18px',
  },
  billingAddresscontent: {
    color: '#666666',
    fontWeight: '700',
  },
  servicePaymentText: {
    color: '#666666',
    marginLeft: '20px',
  },
  paypalcontent: {
    // padding: '24px 16px 20px 15px ',
    display: 'flex',
    alignItems: 'center',

    '& #payment-details-label-GOOGLE_PAY': {
      marginLeft: '5px !important',
    },
  },
  orderDetailContent: {
    padding: '1rem',
  },
  paymentBalanceContent: {
    marginTop: `${theme.utils.fromPx(16)}`,
    marginLeft: `${theme.utils.fromPx(16)}`,
    marginBottom: `${theme.utils.fromPx(16)}`,
    marginRight: `${theme.utils.fromPx(16)}`,
    fontFamily: 'Roboto',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(18),
    color: '121212',
  },
}));

const OrderDetailsPayment = ({ orderNumber }) => {
  const classes = useStyles();

  const { data: paymentdetails = {}, error } = usePayment(orderNumber);

  const { getLang } = useAthena(); // athena config

  const [openPaymentDetailsDialog, setOpenPaymentDetailsDialog] = useState({
    open: false,
    paymentDetail: {},
  });

  const showPaymentDetail = (paymentReferenceId) => {
    const paymentDetails = _.find(
      paymentdetails?.paymentDetailList,
      (details) => details?.paymentReferenceId === paymentReferenceId,
    );
    setOpenPaymentDetailsDialog({
      open: true,
      paymentDetail: paymentDetails,
    });
  };

  if (error) {
    return null;
  }

  if (!paymentdetails) {
    return (
      <div className={classes.root}>
        <Progress />
      </div>
    );
  }

  return (
    <div data-testid="orderDetailsPayment" className={classes.root}>
      {paymentdetails?.paymentDetailList?.length > 0 &&
        paymentdetails?.paymentDetailList
          ?.filter((details) => details?.paymentReferenceId)
          .map((paymentInfo, index, list) => {
            const paymentMethod = paymentInfo.paymentMethod;
            const rootTestId = `payment:${paymentInfo?.paymentReferenceId}`;
            return (
              <Card key={rootTestId} className={classes.parentCard} elevation={0}>
                <div className={classes.orderDetailContent}>
                  <span className={classes.title}>
                    {list.length > 1 ? `Payment ${index + 1} of ${list.length}` : 'Payment'}{' '}
                  </span>
                  <Link
                    className={classes.paymentdetailLink}
                    onClick={() => {
                      showPaymentDetail(paymentInfo?.paymentReferenceId);
                    }}
                  >
                    {getLang('orderPaymentDetails', { fallback: 'Payment Details' })}
                  </Link>
                  <Card className={classes.childCard} elevation={0}>
                    {paymentMethod?.type === 'CREDIT_CARD' ||
                    paymentMethod?.type === 'GIFT_CARD' ? (
                      <Grid container alignItems="center">
                        <Grid item xs="auto">
                          {paymentMethod?.type === 'CREDIT_CARD' && (
                            <div
                              className={classes.icon}
                              data-testid={`payment-details-icon-${paymentMethod?.creditCard?.cardType}`}
                            >
                              {getPaymentIcon(_.toUpper(paymentMethod?.creditCard?.cardType))}
                            </div>
                          )}
                          {paymentMethod?.type === 'GIFT_CARD' && (
                            <span
                              className={classes.gifticon}
                              data-testid={`payment-details-icon-${paymentMethod?.type}`}
                            >
                              {getPaymentIcon(_.toUpper(paymentMethod?.type))}
                            </span>
                          )}
                          {paymentMethod?.service?.type === 'APPLE_PAY' && (
                            <span
                              className={classes.gifticon}
                              data-testid={`payment-details-icon-${paymentMethod?.service?.type}`}
                            >
                              {getPaymentIcon(_.toUpper(paymentMethod?.service?.type))}
                            </span>
                          )}
                        </Grid>
                        <Grid item xs>
                          <div className={classes.paymentText}>
                            {paymentMethod?.type === 'CREDIT_CARD' ? (
                              <div>
                                {snakeCaseToTitleCase(paymentMethod?.creditCard?.cardholderName)}
                              </div>
                            ) : (
                              <div>{'Gift Card'}</div>
                            )}
                            <div>
                              {paymentMethod?.type === 'CREDIT_CARD'
                                ? paymentMethod?.creditCard?.cardNumber
                                : paymentMethod?.giftCard?.cardNumber}
                            </div>
                            {paymentMethod?.type === 'CREDIT_CARD'
                              ? paymentMethod?.creditCard?.expireMonth &&
                                paymentMethod?.creditCard?.expireYear && (
                                  <div>
                                    {getLang('orderExpiry', { fallback: 'Expiry' })}{' '}
                                    {paymentMethod?.creditCard?.expireMonth}/
                                    {paymentMethod?.creditCard?.expireYear}
                                  </div>
                                )
                              : null}
                          </div>
                        </Grid>
                        <Grid item xs>
                          {paymentInfo?.paymentState === 'VALID' ? (
                            <Box
                              sx={{
                                display: 'inline-block',
                                fontWeight: '700',
                                color: '#FFFFFF',
                                backgroundColor: '#006B2B',
                                float: 'right',
                                height: '20px',
                                width: 'auto',
                                paddingRight: '12px',
                                paddingBottom: '8px',
                                paddingLeft: '12px',
                                borderRadius: '4px',
                              }}
                            >
                              {paymentInfo?.paymentState === 'VALID' ? 'Valid' : null}
                            </Box>
                          ) : null}
                        </Grid>
                      </Grid>
                    ) : (
                      <div className={classes.paypalcontent}>
                        <span
                          data-testid={`payment-details-icon-${paymentMethod?.service?.type}`}
                          id={`payment-details-icon-${paymentMethod?.service?.type}`}
                          className={classes.paypalicon}
                        >
                          {getPaymentIcon(_.toUpper(paymentMethod?.service?.type))}
                        </span>
                        <span
                          data-testid={`payment-details-label-${paymentMethod?.service?.type}`}
                          id={`payment-details-label-${paymentMethod?.service?.type}`}
                          className={classes.servicePaymentText}
                        >
                          {paymentMethod?.service?.email ||
                            getPaymentTypeLabel(_.toUpper(paymentMethod?.service?.type))}
                        </span>
                      </div>
                    )}
                  </Card>
                  <div>
                    {paymentMethod?.type === 'CREDIT_CARD' &&
                    paymentMethod?.creditCard?.billingAddress &&
                    paymentMethod?.creditCard?.billingAddress?.addressLine2 ? (
                      <div>
                        <div className={classes.billingtitle}>
                          {' '}
                          {getLang('orderBillingAddress', { fallback: 'Billing address' })}
                        </div>
                        {paymentMethod?.creditCard?.billingAddress?.addressLine1}
                        <br />
                        {paymentMethod?.creditCard?.billingAddress?.addressLine2}
                        {paymentMethod?.creditCard?.billingAddress?.addressLine2 && <br />}
                        {paymentMethod?.creditCard?.billingAddress?.city},{' '}
                        {paymentMethod?.creditCard?.billingAddress?.state},{' '}
                        {paymentMethod?.creditCard?.billingAddress?.postcode},{' '}
                        {paymentMethod?.creditCard?.billingAddress?.country}
                        <br />
                        {'P: '}
                        {toFormattedPhoneNumber(paymentMethod?.creditCard?.billingAddress?.phone)}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            );
          })}
      <Card className={classes.parentCard} elevation={0}>
        <div className={classes.paymentBalanceContent}>
          <div>
            <span className={classes.billingAddresscontent}>
              {getLang('orderBalance', { fallback: 'Balance: ' })}
            </span>
            <span>{currencyFormatter(paymentdetails?.orderBalance)}</span>
          </div>
          <div>
            <span className={classes.billingAddresscontent}>
              {getLang('orderPaymentStatus', { fallback: 'Order Payment Status: ' })}
            </span>
            <span
              style={{
                // FIXME should the color change based on status?
                color: 'green',
              }}
            >
              {snakeCaseToTitleCase(paymentdetails.orderPaymentStatus)}
            </span>
          </div>
        </div>
      </Card>
      {openPaymentDetailsDialog.open && (
        <OrderDetailsPaymentDetailsDialog
          isOpen={openPaymentDetailsDialog}
          openDialog={setOpenPaymentDetailsDialog}
          paymentDetail={openPaymentDetailsDialog.paymentDetail}
        />
      )}
    </div>
  );
};

OrderDetailsPayment.propTypes = {
  orderNumber: PropTypes.string,
};

export default OrderDetailsPayment;
