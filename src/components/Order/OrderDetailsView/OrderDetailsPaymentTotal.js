import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@mui/material';
import cn from 'classnames';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    height: '15.75rem',
    maxWidth: '22rem',
    backgroundColor: '#F5F5F5',
  },
  orderDetailContent: {
    paddingLeft: theme.utils.fromPx(16),
    paddingRight: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(16),
  },
  detail: {
    marginTop: theme.spacing(0),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(0),
    paddingBottom: theme.spacing(1),
  },
  value: {
    display: 'inline-flex',
    height: theme.utils.fromPx(20),
    color: '#333333',
    fontWeight: '700',
    paddingBottom: theme.spacing(1),
    float: 'right',
  },
  label: {
    display: 'inline-block',
    color: '#666666',
  },
  hr: {
    flexGrow: '0',
    border: '1px solid #CCCCCC',
    width: '16.625rem',
    marginLeft: theme.spacing(0),
  },
}));

const OrderDetailsPaymentTotal = ({ paymentDetail }) => {
  const classes = useStyles();
  const { getLang } = useAthena(); // athena config

  return (
    <div data-testid="orderDetailsPaymentTotal">
      <Box className={classes.box}>
        <div className={classes.orderDetailContent}>
          <div className={cn(classes.detail)}>
            <span className={cn(classes.label)} data-testid="payment-requested-label">
              {getLang('paymentRequested', { fallback: 'Requested' })}
            </span>
            <span className={cn(classes.value)} data-testid="payment-requested-value">
              {paymentDetail?.paymentAmount?.max
                ? '$' + paymentDetail?.paymentAmount?.max
                : '$0.00'}
            </span>
          </div>
          <div className={cn(classes.detail)}>
            <span className={cn(classes.label)} data-testid="payment-approved-label">
              {getLang('paymentApproved', { fallback: 'Approved' })}
            </span>
            <span className={cn(classes.value)} data-testid="payment-approved-value">
              {paymentDetail?.paymentAmount?.approved
                ? '$' + paymentDetail?.paymentAmount?.approved
                : '$0.00'}
            </span>
          </div>
          <div className={cn(classes.detail)}>
            <span className={cn(classes.label)} data-testid="payment-deposited-label">
              {getLang('paymentDeposited', { fallback: 'Deposited' })}
            </span>
            <span className={cn(classes.value)} data-testid="payment-deposited-value">
              {paymentDetail?.paymentAmount?.deposited
                ? '$' + paymentDetail?.paymentAmount?.deposited
                : '$0.00'}
            </span>
          </div>
          <div className={cn(classes.detail)}>
            <span className={cn(classes.label)} data-testid="payment-balance-label">
              {getLang('paymentBalance', { fallback: 'Balance' })}
            </span>
            <span className={cn(classes.value)} data-testid="payment-balance-value">
              {paymentDetail?.paymentAmount?.balance
                ? '$' + paymentDetail?.paymentAmount?.balance
                : '$0.00'}
            </span>
          </div>
          <hr className={classes.hr} />
          <div className={cn(classes.detail)}>
            <span className={cn(classes.label)} data-testid="payment-credited-label">
              {getLang('paymentCredited', { fallback: 'Credited' })}
            </span>
            <span className={cn(classes.value)} data-testid="payment-credited-value">
              {paymentDetail?.paymentAmount?.credited
                ? '$' + paymentDetail?.paymentAmount?.credited
                : '$0.00'}
            </span>
          </div>
        </div>
      </Box>
    </div>
  );
};

OrderDetailsPaymentTotal.propTypes = {
  paymentDetail: PropTypes.object,
};

export default OrderDetailsPaymentTotal;
