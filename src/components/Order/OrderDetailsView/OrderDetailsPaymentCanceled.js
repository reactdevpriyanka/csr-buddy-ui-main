import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { currencyFormatter, capitalize } from '@/utils/string';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '1rem',
    marginBottom: '0.75rem',
    color: theme.palette.blue.dark,
    marginTop: '20px',
  },
  paymentRow: {
    display: 'grid',
    gridTemplateColumns: '60% 20% 20%',
    backgroundColor: '#F5F5F5',
    maxWidth: '1090px',
    height: '50px !important',
    marginTop: '15px',
    columnGap: theme.utils.fromPx(62),
  },
  paymentPanel: {
    display: 'grid',
    gridTemplateColumns: '60% 20% 20%',
    maxWidth: '1090px',
    columnGap: theme.utils.fromPx(60),
    backgroundColor: '#F5F5F5',
  },
  paymentHeading: {
    paddingLeft: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(15),
    color: '#666666',
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(12),
  },
  paymentValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    paddingLeft: theme.utils.fromPx(16),
  },
  paymentLabelValuePanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  layout: {
    maxWidth: '1090px',
  },
}));
const OrderDetailsPaymentCanceled = ({ paymentDetail }) => {
  const classes = useStyles();

  const { getLang } = useAthena(); // athena config

  return (
    <div data-testid="orderDetailsCancelation">
      {paymentDetail?.paymentState === 'CANCELED' ? (
        <div>
          <div>
            <div className={classes.title}>{'Cancelation'}</div>
            <div className={classes.paymentRow}>
              <div className={classes.paymentHeading}>
                {getLang('orderCanceledID', { fallback: 'Cancelation ID' })}
              </div>
              <div className={classes.paymentHeading}>
                {getLang('orderCredited', { fallback: 'Credited' })}
              </div>
              <div className={classes.paymentHeading}>
                {getLang('orderStatus', { fallback: 'Status' })}
              </div>
            </div>
          </div>
          <div data-testid="order:cancelation:details" className={classes.layout}>
            <div className={classes.paymentPanel}>
              <div className={classes.paymentLabelValuePanel}>
                <span className={classes.paymentValue}>{paymentDetail?.instructionId}</span>
              </div>
              <div className={cn(classes.paymentLabelValuePanel)}>
                <span className={classes.paymentValue}>
                  {currencyFormatter(paymentDetail?.paymentAmount?.credited)}
                </span>
              </div>
              <div className={cn(classes.paymentLabelValuePanel)}>
                <span className={classes.paymentValue}>
                  {capitalize(paymentDetail?.paymentState)}
                </span>
              </div>
              <br />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

OrderDetailsPaymentCanceled.propTypes = {
  paymentDetail: PropTypes.object,
};

export default OrderDetailsPaymentCanceled;
